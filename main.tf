terraform {
  required_providers {
    yandex = {
      source  = "yandex-cloud/yandex"
      version = "~> 0.142.0"
    }
  }
}

provider "yandex" {
  token     = "y0__xDHs6yyAxjB3RMgqN61nxMtY6rg_xYYDCjo-ts5ocaoT1bi6A"
  cloud_id  = "b1gu13ek3sen07rkpruo"
  folder_id = "b1gn6l9s1qgupdc3jtjs"
  zone      = "ru-central1-a"
}

resource "yandex_compute_instance" "vm" {
  name        = "my-vm-new"
  platform_id = "standard-v1"

  resources {
    cores  = 2
    memory = 4
  }

  boot_disk {
    initialize_params {
      image_id = "fd80qm01ah03dkqb14lc"  # Ubuntu 20.04 LTS
      size     = 30
    }
  }

  network_interface {
    subnet_id = yandex_vpc_subnet.subnet.id
    nat       = true
  }

  metadata = {
    ssh-keys = <<-EOT
      ubuntu:${file("~/.ssh/yandex_cloud.pub")}
      ubuntu:${file("~/.ssh/yandex_cloud_new.pub")}
    EOT
    user-data = <<-EOT
      #cloud-config
      users:
        - name: ubuntu
          sudo: ALL=(ALL) NOPASSWD:ALL
          shell: /bin/bash
          ssh_authorized_keys:
            - ${file("~/.ssh/yandex_cloud.pub")}
            - ${file("~/.ssh/yandex_cloud_new.pub")}
      ssh_pwauth: false
    EOT
  }
}

resource "yandex_vpc_network" "network" {
  name = "my-network-new"
}

resource "yandex_vpc_subnet" "subnet" {
  name           = "my-subnet-new"
  zone           = "ru-central1-a"
  network_id     = yandex_vpc_network.network.id
  v4_cidr_blocks = ["192.168.10.0/24"]
}

output "external_ip" {
  value = yandex_compute_instance.vm.network_interface[0].nat_ip_address
} 