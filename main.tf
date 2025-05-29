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
  name        = "task-manager-vm"
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

      # Install Docker
      package_update: true
      package_upgrade: true
      packages:
        - apt-transport-https
        - ca-certificates
        - curl
        - software-properties-common
        - gnupg

      runcmd:
        # Add Docker's official GPG key
        - curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        # Add Docker repository
        - echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        # Install Docker
        - apt-get update
        - apt-get install -y docker-ce docker-ce-cli containerd.io
        # Add ubuntu user to docker group
        - usermod -aG docker ubuntu
        # Start and enable Docker service
        - systemctl start docker
        - systemctl enable docker
        # Install Docker Compose
        - curl -L "https://github.com/docker/compose/releases/download/v2.24.6/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        - chmod +x /usr/local/bin/docker-compose
    EOT
  }
}

resource "yandex_vpc_network" "network" {
  name = "task-manager-network"
}

resource "yandex_vpc_subnet" "subnet" {
  name           = "task-manager-subnet"
  zone           = "ru-central1-a"
  network_id     = yandex_vpc_network.network.id
  v4_cidr_blocks = ["192.168.10.0/24"]
}

resource "yandex_container_registry" "registry" {
  name = "task-manager-registry"
}

output "external_ip" {
  value = yandex_compute_instance.vm.network_interface[0].nat_ip_address
}

output "registry_id" {
  value = yandex_container_registry.registry.id
}

output "registry_url" {
  value = "cr.yandex/${yandex_container_registry.registry.id}"
} 