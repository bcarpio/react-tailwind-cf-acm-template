resource "aws_wafv2_web_acl" "frontend" {
  count    = var.waf_enabled ? 1 : 0
  provider = aws.us_east_1

  name        = "${var.environment}-${local.app_name_sanitized}-frontend"
  description = "WAF WebACL for ${var.app_name} frontend CDN"
  scope       = "CLOUDFRONT"

  default_action {
    allow {}
  }

  dynamic "rule" {
    for_each = var.waf_managed_rules
    content {
      name     = rule.value.name
      priority = rule.value.priority

      override_action {
        dynamic "none" {
          for_each = rule.value.override_action == "none" ? [1] : []
          content {}
        }
        dynamic "count" {
          for_each = rule.value.override_action == "count" ? [1] : []
          content {}
        }
      }

      statement {
        managed_rule_group_statement {
          name        = rule.value.name
          vendor_name = "AWS"
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = rule.value.name
        sampled_requests_enabled   = true
      }
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${var.environment}-${local.app_name_sanitized}-frontend"
    sampled_requests_enabled   = true
  }

  tags = {
    Purpose = "Frontend WAF WebACL"
  }
}

resource "aws_ssm_parameter" "frontend_waf_web_acl_arn" {
  count = var.waf_enabled ? 1 : 0

  name  = "/${var.environment}/${var.app_name}/waf/frontend_web_acl_arn"
  type  = "String"
  value = aws_wafv2_web_acl.frontend[0].arn

  tags = {
    Purpose = "Frontend WAF WebACL ARN"
  }
}
