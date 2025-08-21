variable "yc_token" {
  description = "Yandex Cloud OAuth token"
  type        = string
  sensitive   = true
}

variable "cloud_id" {
  description = "Yandex Cloud ID"
  type        = string
  default     = "b1gu13ek3sen07rkpruo"
}

variable "folder_id" {
  description = "Yandex Cloud folder ID"
  type        = string
  default     = "b1gn6l9s1qgupdc3jtjs"
}

variable "create_vm" {
  type        = bool
  default     = true
  description = "Создавать новую vm (false = использовать существующую)"
}

# variable "ssh_public_key_path" {
#   description = "Путь к публичному SSH ключу"
#   type        = string
#   default     = "~/.ssh/yandex_cloud.pub"
# }
#
# variable "ssh_username" {
#   description = "Имя пользователя в гостевой ОС (образ ubuntu: обычно 'ubuntu')"
#   type        = string
#   default     = "ubuntu"
# }

variable "ssh_private_key_path" {
  description = "Path to the private SSH key"
  type        = string
  default     = "~/.ssh/yandex_cloud" # Стандартный путь по умолчанию
}