# react-tailwind-cf-acm-template

A production-ready template for deploying React + Tailwind CSS static sites on AWS with CloudFront, ACM, and Route53 - all managed with Terraform.

## What's Included

- **React 19** + TypeScript + Vite (SSR/SSG)
- **Tailwind CSS v4** with custom theme
- **AWS CloudFront** CDN with S3 origin and Origin Access Control
- **ACM SSL certificates** with automatic DNS validation
- **Route53** DNS management
- **Auto-discovered blog system** - drop a TSX file, it's indexed automatically
- **Sitemap generation** at build time
- **Environment support** - dev (dev.example.com) and prd (example.com) via Terraform workspaces
- **One-command deploy** - `npm run publish:prd`

## Quick Start

See **[docs/setup-guide.md](docs/setup-guide.md)** for the full step-by-step walkthrough, including Terraform state bucket creation, workspace setup, DNS configuration, and deployment order.

### The short version

```bash
# 1. Configure terraform
cd terraform
cp backend.tf.example backend.tf       # Set your S3 state bucket
cp prd.tfvars.example prd.tfvars       # Set your domain
cp dev.tfvars.example dev.tfvars       # Set your domain

# 2. Init and create workspaces
terraform init
terraform workspace new prd
terraform workspace new dev

# 3. Create DNS zone first (prd workspace)
terraform workspace select prd
terraform apply -var-file=prd.tfvars -target=aws_route53_zone.main

# 4. Update nameservers at your domain registrar, wait for propagation

# 5. Full deploy
terraform apply -var-file=prd.tfvars

# 6. Deploy frontend
cd ../ui
npm install
export SITE_DOMAIN="yourdomain.com"
npm run publish:prd

# 7. Deploy dev environment
cd ../terraform
terraform workspace select dev
terraform apply -var-file=dev.tfvars
cd ../ui
npm run publish:dev
```

**tfvars** - just plug in your domain:
```hcl
environment = "prd"
app_name    = "yourdomain.com"
aws_region  = "us-west-2"
```

## Adding Blog Posts

Drop a TSX file in `ui/src/pages/blogs/` with exported metadata:

```tsx
import { BlogMetadata } from '../../types/blog'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export const metadata: BlogMetadata = {
  title: 'My First Post',
  description: 'A brief description for the blog index and SEO.',
  date: '2025-03-15',
  slug: 'my-first-post',
  author: 'Your Name',
  tags: ['Example']
}

export default function MyFirstPost() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <article className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{metadata.title}</h1>
            <p>Your blog content here...</p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
```

The post automatically appears in the blog index, sitemap, and gets its own static HTML page at `/blogs/my-first-post`.

## Adding New Pages

1. Create component in `ui/src/pages/`
2. Add route in `ui/src/main.tsx` and `ui/src/entry-server.tsx`
3. Add to `staticRoutes` and `routeMeta` in `ui/scripts/generate-static.js`

## Architecture

```
├── terraform/              # AWS infrastructure
│   ├── main.tf             # Provider config (dual-region for CloudFront ACM)
│   ├── variables.tf        # Input variables (app_name, environment)
│   ├── locals.tf           # Domain logic (dev prefix, sanitized names)
│   ├── s3.tf               # Frontend bucket (OAC) + root redirect bucket
│   ├── cloudfront.tf       # CDN distributions + URL rewrite function
│   ├── acm.tf              # SSL certificates (us-east-1) with DNS validation
│   ├── route53.tf          # DNS zone + CloudFront records
│   ├── *.tfvars.example    # Template configs - just add your domain
│   └── backend.tf.example  # S3 state backend template
│
├── ui/                     # React frontend
│   ├── src/
│   │   ├── pages/blogs/    # Auto-discovered blog posts (just add .tsx files)
│   │   ├── components/     # Navbar, Footer
│   │   ├── utils/          # Blog discovery (import.meta.glob)
│   │   └── types/          # TypeScript interfaces
│   └── scripts/            # SSG + sitemap generation
│
├── docs/
│   └── setup-guide.md      # Full step-by-step deployment walkthrough
│
├── CLAUDE.md               # AI assistant context (for Claude, GPT, etc.)
└── Makefile                # fmt, validate, clean
```

## Commands

| Command | Description |
|---------|-------------|
| `make fmt` | Format Terraform code |
| `make validate` | Validate Terraform configuration |
| `make clean` | Clean build artifacts |
| `npm run dev` | Local dev server (in ui/) |
| `npm run build:prd` | Production build with SSG |
| `npm run publish:dev` | Build + deploy + invalidate (dev) |
| `npm run publish:prd` | Build + deploy + invalidate (prd) |

## Environment Strategy

| Environment | Frontend | DNS Zone |
|------------|----------|----------|
| **prd** | www.example.com | Created here |
| **dev** | www.dev.example.com | Shared from prd via SSM |

Deploy prd first (creates the Route53 zone), then dev (reads zone ID from SSM).

## Prerequisites

- [Terraform](https://www.terraform.io/) >= 1.5
- [Node.js](https://nodejs.org/) >= 18
- [AWS CLI](https://aws.amazon.com/cli/) configured with appropriate credentials
- A registered domain name
