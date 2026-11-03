output "app_server_public_ip" {
  description = "Public IP of the Ledger AI App Server"
  value       = aws_instance.app_server.public_ip
}

output "app_server_private_ip" {
  description = "Private IP of the Ledger AI App Server"
  value       = aws_instance.app_server.private_ip
}

output "nagios_server_public_ip" {
  description = "Public IP of the Nagios Monitoring Server"
  value       = aws_instance.nagios_server.public_ip
}

output "nagios_web_url" {
  description = "URL for Nagios Web Interface"
  value       = "http://${aws_instance.nagios_server.public_ip}/nagios"
}

# Automatically generate Ansible Inventory File
resource "local_file" "ansible_inventory" {
  content = templatefile("${path.module}/templates/hosts.ini.tpl", {
    app_ip         = aws_instance.app_server.public_ip
    app_private_ip = aws_instance.app_server.private_ip
    nagios_ip      = aws_instance.nagios_server.public_ip
  })
  filename = "${path.module}/../ansible/inventory/hosts.ini"
}

