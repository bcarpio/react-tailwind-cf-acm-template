# S3 bucket for frontend static site hosting
module "frontend_site_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "5.8.2"

  bucket = "${var.environment}-${local.app_name_sanitized}-frontend-site"

  # Enable versioning for rollback capability
  versioning = {
    enabled = true
  }

  # Lifecycle rules for old versions
  lifecycle_rule = [
    {
      id      = "expire-old-versions"
      enabled = true

      noncurrent_version_expiration = {
        days = 30
      }

      abort_incomplete_multipart_upload_days = 7
    }
  ]

  # Block public access - CloudFront OAC will be used
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  # Server-side encryption
  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }

  force_destroy = true

  tags = {
    Purpose = "Static site hosting for frontend"
  }
}

# S3 bucket policy to allow CloudFront OAC access to frontend site
resource "aws_s3_bucket_policy" "frontend_site_policy" {
  bucket = module.frontend_site_bucket.s3_bucket_id

  policy = data.aws_iam_policy_document.frontend_site_policy.json
}

data "aws_iam_policy_document" "frontend_site_policy" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = ["s3:GetObject"]

    resources = ["${module.frontend_site_bucket.s3_bucket_arn}/*"]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [module.frontend_cdn.cloudfront_distribution_arn]
    }
  }
}

# Root redirect bucket (example.com -> www.example.com)
module "root_redirect_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "5.8.2"

  bucket = local.base_domain

  # Enable versioning
  versioning = {
    enabled = true
  }

  # Lifecycle rules
  lifecycle_rule = [
    {
      id      = "expire-old-versions"
      enabled = true

      noncurrent_version_expiration = {
        days = 30
      }

      abort_incomplete_multipart_upload_days = 7
    }
  ]

  # Allow public access for redirect bucket
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false

  # Server-side encryption
  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }

  # Website configuration for redirect
  website = {
    redirect_all_requests_to = {
      host_name = "www.${local.base_domain}"
      protocol  = "https"
    }
  }

  force_destroy = true

  tags = {
    Purpose = "Root domain redirect to www.${local.base_domain}"
  }
}

# Public read policy for redirect bucket
resource "aws_s3_bucket_policy" "root_redirect_policy" {
  bucket = module.root_redirect_bucket.s3_bucket_id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid       = "PublicReadGetObject",
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "${module.root_redirect_bucket.s3_bucket_arn}/*"
      }
    ]
  })
}

# SSM parameters for bucket references
resource "aws_ssm_parameter" "s3_frontend_site" {
  name  = "/${var.environment}/${var.app_name}/s3/frontend_site"
  type  = "String"
  value = module.frontend_site_bucket.s3_bucket_id

  tags = {
    Purpose = "Frontend site S3 bucket name"
  }
}

resource "aws_ssm_parameter" "s3_root_redirect" {
  name  = "/${var.environment}/${var.app_name}/s3/root_redirect"
  type  = "String"
  value = module.root_redirect_bucket.s3_bucket_id

  tags = {
    Purpose = "Root redirect S3 bucket name"
  }
}
