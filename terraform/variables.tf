variable "yc_token" {
  description = "Yandex Cloud OAuth token"
  type        = string
  sensitive   = true
  default     = "t1.9euelZrImZ3Myp7GkMuZzpmaiYvGle3rnpWayc-UzJOKnoyKyZDOl8jOzJbl8_dhDHI6-e9tbjFN_d3z9yE7bzr5721uMU39zef1656Vms-JmI6ezZiLjo-Rl5yXysib7_zF656Vms-JmI6ezZiLjo-Rl5yXysib.77M-4V_f-CXHM6v4eI8rtD_zJj_jbJ4UOZvkF37IKHlGNwc2k-iv-VrU4t2RFX_5zS_0Kja2cnOEQuEzvF6EDQ"
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

variable "create_network" {
  type        = bool
  default     = true
  description = "Создавать новую сеть (false = использовать существующую)"
}

variable "create_subnet" {
  type        = bool
  default     = true
  description = "Создавать новую подсеть (false = использовать существующую)"
}

variable "create_vm" {
  type        = bool
  default     = true
  description = "Создавать новую vm (false = использовать существующую)"
}

variable "ssh_public_key_path" {
  description = "Путь к публичному SSH ключу"
  type        = string
  default     = "~/.ssh/yandex_cloud.pub"
}

variable "ssh_username" {
  description = "Имя пользователя в гостевой ОС (образ ubuntu: обычно 'ubuntu')"
  type        = string
  default     = "ubuntu"
}

variable "ssh_private_key_path" {
  description = "Path to the private SSH key"
  type        = string
  default     = "~/.ssh/yandex_cloud" # Стандартный путь по умолчанию
}