[app]
app_server ansible_host=${app_ip} ansible_user=ubuntu ansible_ssh_private_key_file=../keys/ledger-key.pem ansible_ssh_common_args='-o StrictHostKeyChecking=no'

[monitoring]
nagios_server ansible_host=${nagios_ip} ansible_user=ubuntu ansible_ssh_private_key_file=../keys/ledger-key.pem ansible_ssh_common_args='-o StrictHostKeyChecking=no'

[all:vars]
ansible_python_interpreter=/usr/bin/python3
