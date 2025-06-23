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
  name        = "task-manager-vm-new"
  platform_id = "standard-v1"

  resources {
    cores  = 2
    memory = 6
  }

  boot_disk {
    initialize_params {
      image_id = "fd80qm01ah03dkqb14lc"  # Ubuntu 20.04 LTS
      size     = 35
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

  # Wait for the instance to be ready
  provisioner "remote-exec" {
    inline = ["echo 'Waiting for cloud-init to complete...'", "cloud-init status --wait"]

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("~/.ssh/yandex_cloud")
      host        = self.network_interface[0].nat_ip_address
    }
  }

  # Run Ansible playbook
  provisioner "local-exec" {
    command = <<-EOT
      cat > ansible/inventory.yml << 'EOF'
all:
  hosts:
    task-manager-vm:
      ansible_host: ${self.network_interface[0].nat_ip_address}
      ansible_user: ubuntu
      ansible_ssh_private_key_file: ~/.ssh/yandex_cloud
EOF
      # Run Ansible playbook
      ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i ansible/inventory.yml ansible/install_docker.yml
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