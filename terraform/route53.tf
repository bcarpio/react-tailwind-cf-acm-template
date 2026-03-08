# Route53 Hosted Zone
# Only create in prd environment - dev uses the same DNS zone
resource "aws_route53_zone" "main" {
  count = var.environment == "prd" ? 1 : 0

  name = var.app_name

  tags = {
    Environment = "production"
    Purpose     = "${local.app_name_sanitized}-domain"
  }
}

# Store zone ID in SSM for easy reference by other applications/environments
resource "aws_ssm_parameter" "zone_id" {
  count = var.environment == "prd" ? 1 : 0

  name  = "/prd/${var.app_name}/route53/zone_id"
  type  = "String"
  value = aws_route53_zone.main[0].zone_id

  description = "Route53 hosted zone ID for ${var.app_name}"

  tags = {
    Purpose = "${local.app_name_sanitized}-zone-id"
  }
}

# ============================================================================
# CloudFront DNS Configuration
# ============================================================================

# A record for www.{base_domain}
# Points to frontend CloudFront distribution
resource "aws_route53_record" "www_frontend" {
  zone_id = local.route53_zone_id
  name    = "www.${local.base_domain}"
  type    = "A"

  alias {
    name                   = module.frontend_cdn.cloudfront_distribution_domain_name
    zone_id                = module.frontend_cdn.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}

# A record for {base_domain}
# Points to root redirect CloudFront distribution
resource "aws_route53_record" "root_redirect" {
  zone_id = local.route53_zone_id
  name    = local.base_domain
  type    = "A"

  alias {
    name                   = module.root_redirect_cdn.cloudfront_distribution_domain_name
    zone_id                = module.root_redirect_cdn.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}

# ============================================================================
# Outputs
# ============================================================================

output "nameservers" {
  value       = var.environment == "prd" ? aws_route53_zone.main[0].name_servers : []
  description = "Configure these nameservers at your domain registrar (prd only)"
}

output "zone_id" {
  value       = var.environment == "prd" ? aws_route53_zone.main[0].zone_id : null
  description = "Route53 hosted zone ID (prd only)"
}
