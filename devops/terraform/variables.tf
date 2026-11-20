variable "aws_region" {
  description = "AWS region for provisioning resources"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project name prefix for tags and resources"
  type        = string
  default     = "ledger-ai"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "app_instance_type" {
  description = "Instance type for Ledger Next.js app server (Free Tier eligible)"
  type        = string
  default     = "t3.micro"
}

variable "nagios_instance_type" {
  description = "Instance type for Nagios Core monitoring server"
  type        = string
  default     = "t3.micro"
}
