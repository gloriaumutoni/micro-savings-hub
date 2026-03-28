# Terraform — AfrikaSave Infrastructure

Provisions the complete AWS infrastructure for the AfrikaSave production environment.

## What Gets Created

| Resource | Type | Purpose |
|----------|------|---------|
| VPC | `10.0.0.0/16` | Isolated network |
| Public subnet | `10.0.1.0/24` | Bastion Host |
| Private subnet | `10.0.2.0/24` | App VM + RDS (AZ-a) |
| Private subnet B | `10.0.3.0/24` | RDS only (AZ-b, required by RDS) |
| Internet Gateway | — | Public internet access |
| NAT Gateway | — | Outbound internet for private subnet |
| Bastion Host | t2.micro Ubuntu 24.04 | SSH jump server |
| App VM | t2.micro Ubuntu 24.04 | Runs the backend container |
| RDS PostgreSQL 17 | db.t3.micro | Managed database |
| ECR repository | `micro-savings-hub` | Private Docker registry |
| Security Groups | 3 × SG | Bastion, App VM, RDS |
| IAM Role | EC2 → ECR read | App VM pulls images without keys |

## Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/downloads) >= 1.14
- AWS CLI configured (`aws configure`) with an IAM user that has EC2, RDS, ECR, VPC, and IAM permissions
- An SSH key pair (generate with `ssh-keygen -t ed25519 -f ~/.ssh/afrikasave-deploy`)

## Setup

```bash
# 1. Clone the repo and navigate to this directory
cd terraform

# 2. Copy the example vars file and fill in your values
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars — set ssh_public_key and db_password at minimum

# 3. Initialise Terraform (downloads the AWS provider)
terraform init

# 4. Preview what will be created
terraform plan

# 5. Apply — creates all resources (~5 minutes)
terraform apply
```

After `apply` completes, note the outputs — you will need them for Ansible:

```
bastion_public_ip   = "x.x.x.x"
app_vm_private_ip   = "10.0.2.x"
rds_endpoint        = "afrikasave-db.xxxx.eu-west-1.rds.amazonaws.com:5432"
ecr_repository_url  = "123456789.dkr.ecr.eu-west-1.amazonaws.com/micro-savings-hub"
```

## Tear Down

```bash
terraform destroy
```

This removes all resources. RDS is configured with `skip_final_snapshot = true` so destroy completes without manual steps.

## Security Notes

- The App VM has **no public IP** — it is only reachable via the Bastion Host
- The RDS instance is **not publicly accessible** — only the App VM security group can reach port 5432
- The App VM uses an **IAM instance profile** (not hardcoded AWS keys) to pull from ECR
- `terraform.tfvars` and `terraform.tfstate` are git-ignored — never commit them
