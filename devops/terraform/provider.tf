terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.50.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.4"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Ledger-AI-Investment-Research"
      ManagedBy   = "Terraform"
      Environment = "Production"
      Course      = "INT333-DevOps"
      Owner       = "Hemant Kumar"
    }
  }
}
