[app_servers]
ledger-app-node ansible_host=${app_ip} private_ip=${app_private_ip}

[monitoring_servers]
nagios-monitor-node ansible_host=${nagios_ip}

[all:vars]
ansible_user=ubuntu
ansible_ssh_private_key_file=~/.ssh/id_rsa
ansible_python_interpreter=/usr/bin/python3

