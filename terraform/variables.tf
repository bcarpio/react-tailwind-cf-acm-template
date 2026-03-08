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
