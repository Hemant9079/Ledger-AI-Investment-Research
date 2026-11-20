# Generate RSA 4096 private key for EC2 instances
resource "tls_private_key" "ledger_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# Upload public key to AWS EC2 Key Pairs
resource "aws_key_pair" "generated_key" {
  key_name   = "${var.project_name}-ec2-key"
  public_key = tls_private_key.ledger_key.public_key_openssh

  tags = {
    Name = "${var.project_name}-ec2-key"
  }
}

# Save private key locally for SSH / Ansible access
resource "local_file" "private_key" {
  content         = tls_private_key.ledger_key.private_key_pem
  filename        = "${path.module}/../keys/ledger-key.pem"
  file_permission = "0600"
}
