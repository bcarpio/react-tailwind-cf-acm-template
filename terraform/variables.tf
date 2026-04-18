variable "environment" {
  type        = string
  description = "Environment name (dev or prd)"
  validation {
    condition     = contains(["dev", "prd"], var.environment)
    error_message = "Environment must be 'dev' or 'prd'."
  }
}

variable "app_name" {
  type        = string
  description = "Application/domain name (e.g., example.com)"
}

variable "aws_region" {
  type        = string
  description = "AWS region for primary resources"
  default     = "us-west-2"
}

variable "waf_enabled" {
  type        = bool
  description = "Enable AWS WAFv2 WebACL on the frontend CloudFront distribution"
  default     = false
}

variable "waf_managed_rules" {
  type = list(object({
    name            = string
    priority        = number
    override_action = string
  }))
  description = "AWS Managed Rule Groups to attach to the WAF WebACL. override_action must be 'none' (block per rule group action) or 'count' (log only)."
  default = [
    { name = "AWSManagedRulesCommonRuleSet", priority = 1, override_action = "count" },
    { name = "AWSManagedRulesKnownBadInputsRuleSet", priority = 2, override_action = "count" },
    { name = "AWSManagedRulesAmazonIpReputationList", priority = 3, override_action = "count" },
  ]
  validation {
    condition     = alltrue([for r in var.waf_managed_rules : contains(["none", "count"], r.override_action)])
    error_message = "override_action must be 'none' or 'count'."
  }
}
