# ACM certificate for www.{base_domain}
# Must be created in us-east-1 for CloudFront
resource "aws_acm_certificate" "www_site_cert" {
  provider          = aws.us_east_1
  domain_name       = "www.${local.base_domain}"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Purpose = "Certificate for www frontend CloudFront distribution"
  }
}

# DNS validation records for www certificate
resource "aws_route53_record" "www_site_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.www_site_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  zone_id = local.route53_zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 300
}

# Certificate validation
resource "aws_acm_certificate_validation" "www_site_cert_validation" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.www_site_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.www_site_cert_validation : record.fqdn]
}

# ACM certificate for {base_domain} (root domain)
# Used for root redirect CloudFront distribution
resource "aws_acm_certificate" "root_site_cert" {
  provider          = aws.us_east_1
  domain_name       = local.base_domain
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Purpose = "Certificate for root domain redirect CloudFront distribution"
  }
}

# DNS validation records for root certificate
resource "aws_route53_record" "root_site_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.root_site_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  zone_id = local.route53_zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 300
}

# Certificate validation
resource "aws_acm_certificate_validation" "root_site_cert_validation" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.root_site_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.root_site_cert_validation : record.fqdn]
}
