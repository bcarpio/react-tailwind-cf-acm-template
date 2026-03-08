# Setup Guide

This guide walks you through deploying your site from scratch. The order matters — certain steps must complete before others will work.

## Prerequisites

- [AWS CLI](https://aws.amazon.com/cli/) installed and configured (`aws configure`)
- [Terraform](https://www.terraform.io/downloads) >= 1.5 installed
- [Node.js](https://nodejs.org/) >= 18 installed
- A registered domain name (from any registrar — GoDaddy, Namecheap, Google Domains, AWS Route53, etc.)

---

## Step 1: Create the Terraform State Bucket

Terraform needs an S3 bucket to store its state file. This must be created manually before anything else.

1. Log into the [AWS Console](https://console.aws.amazon.com/s3/)
2. Create a new S3 bucket for Terraform state:
   - **Bucket name**: Something like `terraform-state-ACCOUNT_ID-REGION` (e.g., `terraform-state-123456789012-us-west-2`)
   - **Region**: Match the region you plan to use (e.g., `us-west-2`)
   - **Versioning**: Enable (recommended for state recovery)
   - **Block all public access**: Enable
   - Leave everything else as default

Or via CLI:

```bash
aws s3api create-bucket \
  --bucket terraform-state-YOUR_ACCOUNT_ID-us-west-2 \
  --region us-west-2 \
  --create-bucket-configuration LocationConstraint=us-west-2

aws s3api put-bucket-versioning \
  --bucket terraform-state-YOUR_ACCOUNT_ID-us-west-2 \
  --versioning-configuration Status=Enabled
```

---

## Step 2: Configure Terraform Backend and Variables

```bash
cd terraform
```

### Copy the example files

```bash
cp backend.tf.example backend.tf
cp dev.tfvars.example dev.tfvars
cp prd.tfvars.example prd.tfvars
```

### Edit `backend.tf`

Update with your S3 state bucket name, a key for this project, and your region:

```hcl
terraform {
  backend "s3" {
    bucket = "terraform-state-123456789012-us-west-2"
    key    = "mysite.tfstate"
    region = "us-west-2"
  }
}
```

### Edit `prd.tfvars`

```hcl
environment = "prd"
app_name    = "yourdomain.com"
aws_region  = "us-west-2"
```

### Edit `dev.tfvars`

```hcl
environment = "dev"
app_name    = "yourdomain.com"
aws_region  = "us-west-2"
```

> **Note:** `app_name` is the same in both files — it's your root domain. The environment prefix (`dev.`) is handled automatically by Terraform.

---

## Step 3: Initialize Terraform and Create Workspaces

If you want separate dev and prd environments (recommended), you need Terraform workspaces. Each workspace maintains its own state, so dev and prd resources don't interfere with each other.

```bash
# Initialize Terraform (downloads providers and modules)
terraform init

# Create workspaces
terraform workspace new prd
terraform workspace new dev

# Verify workspaces exist
terraform workspace list
```

You should see:

```
  default
  dev
* prd
```

---

## Step 4: Targeted Apply — Create the Route53 DNS Zone (prd)

**This is the critical step most people miss.** You cannot run a full `terraform apply` on the first run because:

1. ACM certificates require DNS validation records in Route53
2. The Route53 zone must exist first so those records can be created
3. Your domain's nameservers must point to AWS Route53 before DNS validation will succeed

So you need a **targeted apply** to create just the Route53 zone first.

### Switch to the prd workspace

```bash
terraform workspace select prd
```

### Run the targeted apply

```bash
terraform plan -var-file=prd.tfvars -target=aws_route53_zone.main
terraform apply -var-file=prd.tfvars -target=aws_route53_zone.main
```

This creates only the Route53 hosted zone and outputs the **nameservers** you need.

### Copy the nameservers from the output

The output will look something like:

```
nameservers = tolist([
  "ns-1234.awsdns-26.org",
  "ns-567.awsdns-07.net",
  "ns-890.awsdns-47.co.uk",
  "ns-12.awsdns-01.com",
])
```

**Save these — you need them for the next step.**

---

## Step 5: Update Nameservers at Your Domain Registrar

> **If you purchased your domain through AWS Route53**, skip this step — the nameservers are already correct.

Go to your domain registrar (GoDaddy, Namecheap, Google Domains, Cloudflare, etc.) and update the nameservers for your domain to the four AWS nameservers from Step 4.

### Example: GoDaddy

1. Log into [GoDaddy](https://www.godaddy.com/)
2. Go to **My Products** → **DNS** for your domain
3. Click **Nameservers** → **Change Nameservers** → **Enter my own nameservers**
4. Enter the 4 AWS nameservers from the Terraform output
5. Save

### Example: Namecheap

1. Log into [Namecheap](https://www.namecheap.com/)
2. Go to **Domain List** → **Manage** for your domain
3. Under **Nameservers**, select **Custom DNS**
4. Enter the 4 AWS nameservers
5. Save

### DNS Propagation

After updating nameservers, you need to wait for DNS propagation. This can take anywhere from a few minutes to 48 hours, but typically completes within 15-30 minutes.

You can check propagation status:

```bash
# Check if AWS nameservers are responding for your domain
dig yourdomain.com NS

# Or use an online tool like https://dnschecker.org
```

When the `dig` output shows your AWS nameservers, you're ready to proceed.

---

## Step 6: Full Terraform Apply (prd)

Once DNS is pointing to AWS Route53, you can run the full apply. This creates everything: S3 buckets, CloudFront distributions, ACM certificates (with DNS validation), and all the DNS records.

```bash
terraform workspace select prd
terraform plan -var-file=prd.tfvars
terraform apply -var-file=prd.tfvars
```

> **Note:** ACM certificate validation can take a few minutes. Terraform will wait for the certificates to be validated before creating the CloudFront distributions that depend on them. This is normal — just let it run.

---

## Step 7: Deploy the Production Frontend

```bash
cd ../ui
npm install

# Set your domain for the deploy scripts
export SITE_DOMAIN="yourdomain.com"

# Build and deploy to production
npm run publish:prd
```

This will:
1. Build the React app with SSR/SSG (production mode)
2. Sync the built files to the S3 bucket
3. Invalidate the CloudFront cache

Your production site is now live at `https://www.yourdomain.com`

---

## Step 8: Deploy the Dev Environment

Now go back and deploy the dev environment. The dev workspace reads the Route53 zone ID from SSM (created in the prd apply), so prd must be deployed first.

```bash
cd ../terraform
terraform workspace select dev
terraform plan -var-file=dev.tfvars
terraform apply -var-file=dev.tfvars
```

Then deploy the dev frontend:

```bash
cd ../ui
export SITE_DOMAIN="yourdomain.com"
npm run publish:dev
```

Your dev site is now live at `https://www.dev.yourdomain.com`

---

## Step 9: Start Iterating

You're all set. From here:

- **Edit pages** in `ui/src/pages/`
- **Add blog posts** by dropping TSX files in `ui/src/pages/blogs/` (see [README](../README.md#adding-blog-posts))
- **Deploy changes** with `npm run publish:dev` (test) then `npm run publish:prd` (go live)
- **Local development** with `npm run dev` (runs at http://localhost:5173)

---

## Summary of the Full Sequence

```
1. Create S3 bucket for Terraform state (AWS Console or CLI)
2. Copy backend.tf.example → backend.tf (set your bucket)
3. Copy *.tfvars.example → *.tfvars (set your domain)
4. terraform init
5. terraform workspace new prd && terraform workspace new dev
6. terraform workspace select prd
7. terraform apply -var-file=prd.tfvars -target=aws_route53_zone.main
8. Update nameservers at your domain registrar (if not using Route53)
9. Wait for DNS propagation
10. terraform apply -var-file=prd.tfvars
11. cd ui && npm install && npm run publish:prd
12. cd ../terraform && terraform workspace select dev
13. terraform apply -var-file=dev.tfvars
14. cd ../ui && npm run publish:dev
15. Start building your site!
```

---

## Troubleshooting

### ACM certificate stuck in "Pending validation"

This means DNS isn't pointing to AWS yet. Verify your nameservers are updated:

```bash
dig yourdomain.com NS
```

If it still shows your old registrar's nameservers, wait longer or double-check the nameserver values at your registrar.

### "Error: No SSM parameter found"

If the dev apply fails looking for an SSM parameter, it means prd hasn't been applied yet. The dev environment reads the Route53 zone ID from an SSM parameter that prd creates. Always deploy prd first.

### S3 bucket name already taken

S3 bucket names are globally unique. If `yourdomain.com` is taken as a bucket name (used for the root redirect bucket), you may need to adjust. This is rare for domain-named buckets since you own the domain.

### CloudFront distribution takes a long time

CloudFront distributions can take 10-15 minutes to deploy. This is normal AWS behavior. Terraform will wait for it.

