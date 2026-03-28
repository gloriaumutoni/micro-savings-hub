output "bastion_public_ip" {
  description = "Elastic IP of the Bastion Host — SSH entry point and live application URL (http://<this-ip>)"
  value       = aws_eip.bastion.public_ip
}

output "app_vm_private_ip" {
  description = "Private IP of the App VM — use this in the Ansible inventory"
  value       = aws_instance.app.private_ip
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint — use this in DATABASE_URL (host:port)"
  value       = aws_db_instance.postgres.endpoint
}

output "ecr_backend_url" {
  description = "ECR URL for the backend image"
  value       = aws_ecr_repository.app.repository_url
}

output "ecr_frontend_url" {
  description = "ECR URL for the frontend image"
  value       = aws_ecr_repository.frontend.repository_url
}

output "aws_region" {
  description = "AWS region where resources were deployed"
  value       = var.aws_region
}
