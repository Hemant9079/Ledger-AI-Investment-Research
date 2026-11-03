# Ledger AI — End-to-End DevOps Architecture & Runbook

This directory contains the production-grade DevOps implementation for the **Ledger AI** multi-agent application, built across 6 automated stages using **Terraform**, **Ansible**, **PM2**, **Nginx**, and **Nagios Core**.

---

## 🏛 Architecture Overview

```
                      ┌─────────────────────────────────────────────────────────────┐
                      │                        AWS Cloud VPC                        │
                      │                                                             │
  [ Users / Web ] ───▶│   ┌─────────────────────────────────────────────────────┐   │
       (HTTP 80)      │   │         Ledger AI App Instance (t3.medium)          │   │
                      │   │  ┌──────────────┐     ┌─────────────┐     ┌──────┐  │   │
                      │   │  │ Nginx Proxy  │ ──▶ │ PM2 Process │ ──▶ │ Next │  │   │
                      │   │  │  (Port 80)   │     │ (App Node)  │     │ .js  │  │   │
                      │   │  └──────────────┘     └─────────────┘     └──────┘  │   │
                      │   │         │                                           │   │
                      │   │         ▼                                           │   │
                      │   │  [ NRPE Agent (Port 5666) ]                         │   │
                      │   └──────────────────────▲──────────────────────────────┘   │
                      │                          │ Internal NRPE Checks             │
                      │                          │ (CPU, RAM, Disk, HTTP, PM2)     │
                      │   ┌──────────────────────┴──────────────────────────────┐   │
  [ DevOps Admin ] ──▶│   │       Nagios Monitoring Instance (t3.micro)         │   │
   (Dashboard/SSH)    │   │  ┌──────────────────────┐   ┌────────────────────┐  │   │
                      │   │  │ Nagios Core Engine   │ ─▶│ Nagios Web UI      │  │   │
                      │   │  │ & Check Plugins      │   │ (Apache - Port 80) │  │   │
                      │   │  └──────────┬───────────┘   └────────────────────┘  │   │
                      │   │             │ Monitors External Uptime & SSL        │   │
                      │   └─────────────┼───────────────────────────────────────┘   │
                      └─────────────────┼──────────────────▲────────────────────────┘
                                        │                  │
                                        │                  ▼
                                        │       ┌────────────────────────────────────┐
                                        │       │ Vercel Edge Production             │
                                        │       │ (ledger-ai-investment-research...  │
                                        │       │  .vercel.app)                      │
                                        │       └────────────────────────────────────┘
                                        │ Trigger Alert (CRITICAL)
                                        ▼
                      ┌─────────────────────────────────────────────────────────────┐
                      │    Ansible Controller / Auto-Healing Runbook                │
                      │    Automated Remediation & Service Restart Playbook         │
                      └─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Execution Guide (The 6 Steps)

### Step 1: Terraform — Provision Infrastructure
Provisions AWS VPC, Subnets, Security Groups, and two EC2 instances (`ledger-app-server` and `nagios-server`).

```bash
cd devops/terraform
terraform init
terraform plan
terraform apply -auto-approve
```
*Outputs generated:*
- EC2 Public and Private IPs
- Nagios Dashboard URL
- Automatically generated `devops/ansible/inventory/hosts.ini`

---

### Step 2: Ansible — Base Server Configuration
Connects to both EC2 instances over SSH, runs updates, allocates 2GB swap space (prevents OOM during build), and enables UFW firewall with SSH access.

```bash
cd devops/ansible
# Test SSH connectivity
ansible all -m ping

# Run base configuration
ansible-playbook -i inventory/hosts.ini playbooks/01_base_setup.yml
```

---

### Step 3: Ansible — Deploy Ledger AI Application Stack
Installs **Node.js 20 LTS**, **PM2**, and **Nginx**. Builds the Next.js application, configures the PM2 cluster with systemd persistence, and starts Nginx as a reverse proxy on Port 80.

```bash
cd devops/ansible
ansible-playbook -i inventory/hosts.ini playbooks/02_app_deployment.yml
```

---

### Step 4: Nagios — Dedicated Monitoring Server Installation
Installs Apache2, PHP, compiles **Nagios Core 4.5.1**, **Nagios Plugins 2.4.8**, and the `check_nrpe` client on the dedicated monitoring instance.

```bash
cd devops/ansible
ansible-playbook -i inventory/hosts.ini playbooks/03_nagios_server_install.yml
```
*Access Web Dashboard:* `http://<NAGIOS_SERVER_PUBLIC_IP>/nagios`  
*Default User:* `nagiosadmin`  
*Default Password:* `LedgerAI@2026`

---

### Step 5: Monitoring — Health & Performance Checks
Installs the NRPE agent on the Ledger App server and registers active service checks inside Nagios:
1. **SSH Service** (Port 22)
2. **HTTP Web UI** (Port 80 response)
3. **HTTP Health Check** (`/health` route)
4. **CPU Load Average** (`check_load`)
5. **Memory (RAM) Usage** (`check_mem.sh`)
6. **Root Disk Space** (`check_disk`)
7. **Ledger AI Application Process** (`check_pm2.sh`)

```bash
cd devops/ansible
ansible-playbook -i inventory/hosts.ini playbooks/04_setup_monitoring_checks.yml
```

---

### Step 6: Testing, Failure Simulation & Automated Recovery
Validates alerting pipelines by simulating failures, watching Nagios transition to **CRITICAL**, and triggering automated recovery with Ansible.

#### 1. Simulate Failure:
```bash
cd devops/ansible

# Scenario A: Kill the PM2 application process
ansible-playbook -i inventory/hosts.ini playbooks/05_simulate_failure.yml -e "scenario=pm2"

# Scenario B: Stop Nginx web server
ansible-playbook -i inventory/hosts.ini playbooks/05_simulate_failure.yml -e "scenario=nginx"

# Scenario C: Spike CPU to 100%
ansible-playbook -i inventory/hosts.ini playbooks/05_simulate_failure.yml -e "scenario=cpu"
```
*Notice in the Nagios Web Dashboard that the corresponding service turns **RED (CRITICAL)**.*

#### 2. Execute Automated Recovery:
```bash
ansible-playbook -i inventory/hosts.ini playbooks/06_recovery_service.yml
```
*The recovery playbook inspects the server, restarts failed daemons (PM2 and Nginx), cleans rogue stress processes, verifies HTTP 200, and Nagios returns to **GREEN (OK)** automatically!*

