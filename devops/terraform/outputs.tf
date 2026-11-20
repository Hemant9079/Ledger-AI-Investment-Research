output "app_server_public_ip" {
  description = "Public IP address of the Ledger Application server"
  value       = aws_instance.app_server.public_ip
}

output "nagios_server_public_ip" {
  description = "Public IP address of the Nagios Monitoring server"
  value       = aws_instance.nagios_server.public_ip
}

output "app_server_url" {
  description = "Web URL for the Ledger Application"
  value       = "http://${aws_instance.app_server.public_ip}"
}

output "nagios_dashboard_url" {
  description = "Web URL for the Nagios Core Dashboard"
  value       = "http://${aws_instance.nagios_server.public_ip}/nagios"
}

output "ssh_app_server" {
  description = "SSH command to connect to Application server"
  value       = "ssh -i ../keys/ledger-key.pem ubuntu@${aws_instance.app_server.public_ip}"
}

output "ssh_nagios_server" {
  description = "SSH command to connect to Nagios server"
  value       = "ssh -i ../keys/ledger-key.pem ubuntu@${aws_instance.nagios_server.public_ip}"
}

# Auto-generate Ansible inventory hosts.ini file
resource "local_file" "ansible_inventory" {
  content = templatefile("${path.module}/templates/hosts.ini.tpl", {
    app_ip    = aws_instance.app_server.public_ip
    nagios_ip = aws_instance.nagios_server.public_ip
  })
  filename = "${path.module}/../ansible/inventory/hosts.ini"
}
