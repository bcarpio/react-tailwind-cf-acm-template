# Response Headers Policy for caching static assets
resource "aws_cloudfront_response_headers_policy" "static_assets" {
  name    = "${var.environment}-${local.app_name_sanitized}-static-assets-cache"
  comment = "Cache static assets for 1 year (immutable hashed files)"

  custom_headers_config {
    items {
      header   = "Cache-Control"
      value    = "public, max-age=31536000, immutable"
      override = true
    }
  }
}

# CloudFront Function for URL rewriting (adds .html extension)
resource "aws_cloudfront_function" "url_rewrite" {
  name    = "${var.environment}-${local.app_name_sanitized}-url-rewrite"
  runtime = "cloudfront-js-2.0"
  comment = "Rewrite URLs to add .html extension for static pages"
  publish = true
  code    = <<-EOT
    function handler(event) {
      var request = event.request;
      var uri = request.uri;

      // If URI is exactly "/" or already has an extension, don't modify
      if (uri === '/' || uri.match(/\.[a-zA-Z0-9]+$/)) {
        return request;
      }

      // Add .html extension to path-only URIs
      request.uri = uri + '.html';

      return request;
    }
  EOT
}

# CloudFront distribution for frontend site (www.{base_domain})
module "frontend_cdn" {
  source  = "terraform-aws-modules/cloudfront/aws"
  version = "3.4.0"

  aliases = [
    "www.${local.base_domain}"
  ]

  comment = "${var.app_name} Frontend Site CDN"
  enabled = true

  # Origin Access Control (OAC) for S3 access
  create_origin_access_control = true
  origin_access_control = {
    "${var.environment}-frontend-oac" = {
      description      = "CloudFront access to S3 - ${var.app_name} Frontend"
      origin_type      = "s3"
      signing_behavior = "always"
      signing_protocol = "sigv4"
    }
  }

  # S3 origin configuration
  origin = {
    "${var.environment}-frontend-origin" = {
      domain_name           = module.frontend_site_bucket.s3_bucket_bucket_regional_domain_name
      origin_access_control = "${var.environment}-frontend-oac"
    }
  }

  # Default cache behavior with CloudFront Function (for HTML pages - no long cache)
  default_cache_behavior = {
    target_origin_id       = "${var.environment}-frontend-origin"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    function_association = {
      "viewer-request" = {
        function_arn = aws_cloudfront_function.url_rewrite.arn
      }
    }
  }

  # Ordered cache behaviors for static assets (JS, CSS, images) with long cache
  ordered_cache_behavior = [
    {
      path_pattern               = "/assets/*"
      target_origin_id           = "${var.environment}-frontend-origin"
      viewer_protocol_policy     = "redirect-to-https"
      allowed_methods            = ["GET", "HEAD"]
      cached_methods             = ["GET", "HEAD"]
      compress                   = true
      response_headers_policy_id = aws_cloudfront_response_headers_policy.static_assets.id
    },
    {
      path_pattern               = "/images/*"
      target_origin_id           = "${var.environment}-frontend-origin"
      viewer_protocol_policy     = "redirect-to-https"
      allowed_methods            = ["GET", "HEAD"]
      cached_methods             = ["GET", "HEAD"]
      compress                   = true
      response_headers_policy_id = aws_cloudfront_response_headers_policy.static_assets.id
    }
  ]

  # SSL certificate configuration
  viewer_certificate = {
    acm_certificate_arn      = aws_acm_certificate.www_site_cert.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  # Default document for SPA
  default_root_object = "index.html"

  # Custom error responses for SPA routing
  custom_error_response = [
    {
      error_code         = 404
      response_code      = 200
      response_page_path = "/index.html"
    },
    {
      error_code         = 403
      response_code      = 200
      response_page_path = "/index.html"
    }
  ]

  # Pricing class (PriceClass_100 = North America & Europe only for lower cost)
  price_class = "PriceClass_100"

  tags = {
    Purpose = "Frontend site CloudFront distribution"
  }

  # Wait for ACM certificate validation
  depends_on = [aws_acm_certificate_validation.www_site_cert_validation]
}

# CloudFront distribution for root redirect ({base_domain} -> www.{base_domain})
module "root_redirect_cdn" {
  source  = "terraform-aws-modules/cloudfront/aws"
  version = "3.4.0"

  aliases = [
    local.base_domain
  ]

  comment = "${var.app_name} Root Domain Redirect CDN"
  enabled = true

  # S3 website endpoint origin (for redirect)
  origin = {
    "${var.environment}-root-redirect-origin" = {
      domain_name = module.root_redirect_bucket.s3_bucket_website_endpoint
      origin_id   = "${var.environment}-root-redirect-origin"

      custom_origin_config = {
        http_port              = 80
        https_port             = 443
        origin_protocol_policy = "http-only"
        origin_ssl_protocols   = ["TLSv1.2"]
      }
    }
  }

  # Default cache behavior
  default_cache_behavior = {
    target_origin_id       = "${var.environment}-root-redirect-origin"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
  }

  # SSL certificate configuration
  viewer_certificate = {
    acm_certificate_arn      = aws_acm_certificate.root_site_cert.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  default_root_object = ""

  # Pricing class
  price_class = "PriceClass_100"

  tags = {
    Purpose = "Root domain redirect to www.${local.base_domain}"
  }

  # Wait for ACM certificate validation
  depends_on = [aws_acm_certificate_validation.root_site_cert_validation]
}

# SSM parameters for CloudFront distribution references
resource "aws_ssm_parameter" "frontend_cdn_distribution_id" {
  name  = "/${var.environment}/${var.app_name}/cloudfront/frontend_distribution_id"
  type  = "String"
  value = module.frontend_cdn.cloudfront_distribution_id

  tags = {
    Purpose = "Frontend CloudFront distribution ID"
  }
}

resource "aws_ssm_parameter" "frontend_cdn_domain_name" {
  name  = "/${var.environment}/${var.app_name}/cloudfront/frontend_domain_name"
  type  = "String"
  value = module.frontend_cdn.cloudfront_distribution_domain_name

  tags = {
    Purpose = "Frontend CloudFront distribution domain name"
  }
}
