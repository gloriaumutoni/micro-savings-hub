variable "aws_region" {
  description = "AWS region to deploy resources into"
  type        = string
  default     = "eu-west-1"
}

variable "project_name" {
  description = "Short name used to prefix all resource names"
  type        = string
  default     = "afrikasave"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for the public subnet (Bastion Host)"
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidr" {
  description = "CIDR block for the private subnet (App VM + RDS)"
  type        = string
  default     = "10.0.2.0/24"
}

variable "private_subnet_cidr_b" {
  description = "Second private subnet CIDR: required by RDS subnet group (must span 2 AZs)"
  type        = string
  default     = "10.0.3.0/24"
}

variable "availability_zone" {
  description = "Primary availability zone"
  type        = string
  default     = "eu-west-1a"
}

variable "availability_zone_b" {
  description = "Secondary availability zone: used by the RDS subnet group"
  type        = string
  default     = "eu-west-1b"
}

variable "instance_type" {
  description = "EC2 instance type for both Bastion Host and App VM"
  type        = string
  # t3.micro is the free tier eligible type in eu-west-1
  default     = "t3.micro"
}

variable "ami_id" {
  description = "Ubuntu 24.04 LTS AMI ID (region-specific; update if you change region)"
  type        = string
  # Ubuntu 24.04 LTS (Noble) x86_64 hvm:ebs-ssd-gp3 in eu-west-1 (2026-03-20)
  # Find the latest: https://cloud-images.ubuntu.com/locator/ec2/
  default     = "ami-08f5d9f4870fa3a73"
}

variable "ssh_public_key" {
  description = "Public SSH key to install on EC2 instances"
  type        = string
  # Paste the contents of your ~/.ssh/id_rsa.pub or equivalent key here
}

variable "db_name" {
  description = "Name of the PostgreSQL database"
  type        = string
  default     = "micro_savings_hub"
}

variable "db_username" {
  description = "Master username for the RDS instance"
  type        = string
  default     = "appuser"
}

variable "db_password" {
  description = "Master password for the RDS instance (keep this out of version control)"
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}
