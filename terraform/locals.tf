locals {
  # Domain configuration
  # prd: example.com
  # dev: dev.example.com
  env_prefix  = var.environment == "prd" ? "" : "${var.environment}."
  base_domain = "${local.env_prefix}${var.app_name}"

  # Sanitized app name for resource naming (replace dots with dashes)
  app_name_sanitized = replace(var.app_name, ".", "-")

  # Route53 zone ID (created in prd only, shared across environments)
  route53_zone_id = var.environment == "prd" ? aws_route53_zone.main[0].zone_id : nonsensitive(data.aws_ssm_parameter.route53_zone_id[0].value)
}

# Validate that workspace matches environment to prevent deploying wrong config
check "workspace_matches_environment" {
  assert {
    condition = (
      (terraform.workspace == "dev" && var.environment == "dev") ||
      (terraform.workspace == "prd" && var.environment == "prd")
    )
    error_message = "Terraform workspace '${terraform.workspace}' does not match environment variable '${var.environment}'. Run 'terraform workspace select ${var.environment}' to fix."
  }
}

# Data source to fetch Route53 zone ID from SSM in dev environment
data "aws_ssm_parameter" "route53_zone_id" {
  count = var.environment == "dev" ? 1 : 0
  name  = "/prd/${var.app_name}/route53/zone_id"
}
