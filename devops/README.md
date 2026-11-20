# Ledger AI – DevOps Infrastructure & Monitoring Pipeline
**Course:** INT 333 - DevOps Advance Configuration Management  
**Student:** Hemant Kumar (Reg No: 12307937, Roll: 37, Section: K2O2314)  
**Institution:** Lovely Professional University  

---

## 🏗️ Architecture Overview

```mermaid
flowchart TD
    subgraph AWS_Cloud ["AWS Cloud (ap-south-1)"]
        subgraph VPC ["VPC (10.0.0.0/16)"]
            subgraph PublicSubnet ["Public Subnet (10.0.1.0/24)"]
                AppServer["EC2: Ledger AI App Server (t3.medium)\n- Node.js 20 & PM2 Cluster\n- Nginx Reverse Proxy (Port 80)\n- NRPE Monitoring Agent (Port 5666)"]
                NagiosServer["EC2: Nagios Core Server (t3.micro)\n- Nagios Core 4.5.1\n- Apache2 + PHP Web UI (Port 80)\n- check_nrpe Plugin"]
            end
        end
    end

    subgraph Edge ["External Edge"]
        VercelApp["Vercel Production Deployment\nhttps://ledger-ai-investment-research.vercel.app"]
    end

    NagiosServer -->|"NRPE (5666)"| AppServer
    NagiosServer -->|"HTTP / PING"| AppServer
    NagiosServer -->|"HTTPS / SSL Check"| VercelApp
    User -->|"HTTP (Port 80)"| AppServer
    User -->|"HTTP (Port 80/nagios)"| NagiosServer
```

---

## 🚀 Step-by-Step Runbook

### Step 1: Provision Infrastructure with Terraform
```powershell
cd devops/terraform
terraform init
terraform plan
terraform apply -auto-approve
```
*Outputs: EC2 Public IPs, SSH connection commands, and automatically generates `devops/ansible/inventory/hosts.ini`.*

### Step 2: Base System Hardening & Tools (Ansible)
```bash
cd devops/ansible
ansible-playbook -i inventory/hosts.ini playbooks/01_base_setup.yml
```

### Step 3 & 4: Application Deployment (Ansible)
```bash
ansible-playbook -i inventory/hosts.ini playbooks/02_app_deployment.yml
```
*Deploys Node.js 20, pulls code from GitHub, sets up PM2 in cluster mode, configures Nginx reverse proxy.*

### Step 5: Install & Configure Nagios Core (Ansible)
```bash
ansible-playbook -i inventory/hosts.ini playbooks/03_nagios_server_install.yml
ansible-playbook -i inventory/hosts.ini playbooks/04_setup_monitoring_checks.yml
```
*Access Nagios Dashboard at: `http://<NAGIOS_PUBLIC_IP>/nagios` (User: `admin`, Password: `LedgerAI@2026`).*

### Step 6: Failure Simulation & Automated Recovery
1. **Simulate failure:**
   ```bash
   ansible-playbook -i inventory/hosts.ini playbooks/05_simulate_failure.yml -e "scenario=pm2"
   ```
2. **Observe alert:** Check Nagios web interface to confirm service turns **CRITICAL (RED)**.
3. **Execute auto-healing:**
   ```bash
   ansible-playbook -i inventory/hosts.ini playbooks/06_recovery_service.yml
   ```
4. **Confirm recovery:** Verify Nagios service status returns to **OK (GREEN)**.
