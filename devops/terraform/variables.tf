variable "aws_region" {
  description = "AWS region for infrastructure provisioning"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name tag prefix"
  type        = string
  default     = "ledger-ai"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_cidr" {
  description = "Public Subnet CIDR block"
  type        = string
  default     = "10.0.1.0/24"
}

variable "app_instance_type" {
  description = "EC2 instance type for Ledger AI app server"
  type        = string
  default     = "t3.medium"
}

variable "nagios_instance_type" {
  description = "EC2 instance type for Nagios monitoring server"
  type        = string
  default     = "t3.micro"
}

variable "public_key_path" {
  description = "Path to SSH public key for EC2 key pair"
  type        = string
  default     = "~/.ssh/id_rsa.pub"
}

