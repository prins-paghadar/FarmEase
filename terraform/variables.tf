variable "region" {
  default = "eu-north-1"
}

variable "cluster_name" {
  default = "farmease-cluster"
}

variable "vpc_id" {
  description = "VPC ID"
  default     = "vpc-0ea7554e0590ba343"
}

variable "subnet_ids" {
  description = "List of subnet IDs"
  type        = list(string)

  default = [
    "subnet-0ddf95c32615e7252",
    "subnet-0f9dcad3a38a8dc54"
  ]
}