output "bastion_public_ip" {
  description = "Public IP of the Bastion Host — use this to SSH in and as the ProxyCommand host in Ansible"
  value       = aws_instance.bastion.public_ip
}

output "app_vm_private_ip" {
  description = "Private IP of the App VM — use this in the Ansible inventory"
  value       = aws_instance.app.private_ip
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint — use this in DATABASE_URL (host:port)"
  value       = aws_db_instance.postgres.endpoint
}

output "ecr_repository_url" {
  description = "ECR repository URL — use this to tag and push Docker images"
  value       = aws_ecr_repository.app.repository_url
}

output "aws_region" {
  description = "AWS region where resources were deployed"
  value       = var.aws_region
}
