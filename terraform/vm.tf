# resource "yandex_vpc_address" "static_ip" {
#   name = "task-manager-ip"
#   external_ipv4_address {
#     zone_id = "ru-central1-a"
#   }
# }

resource "yandex_compute_instance" "vm" {
  count = var.create_vm ? 1 : 0

  name        = "task-manager-vm"
  platform_id = "standard-v1"

  resources {
    cores  = 2
    memory = 6
  }

  boot_disk {
    initialize_params {
      image_id = "fd80qm01ah03dkqb14lc"
      size     = 35
    }
  }

  network_interface {
    subnet_id = yandex_vpc_subnet.subnet.id
    nat       = true
  }

  metadata = {
    ssh-keys  = <<-EOT
      ubuntu:${file("~/.ssh/yandex_cloud.pub")}
      ubuntu:${file("~/.ssh/yandex_cloud_new.pub")}
    EOT
    user-data = <<-EOT
      #cloud-config
package_update: true
  package_upgrade: true
  packages:
    - python3
    - python3-pip
    - git
    - curl

      runcmd:
      - [systemctl, stop, cloud-init]  # Останавливаем cloud-init после завершения
      - [sed, -i, 's/^#Port 22$/Port 22/g', /etc/ssh/sshd_config]
      - [systemctl, restart, sshd]

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

  provisioner "remote-exec" {
    inline = ["echo 'Waiting for cloud-init to complete...'", "cloud-init status --wait"]

    connection {
      type = "ssh"
      user = "ubuntu"
      private_key = file("~/.ssh/yandex_cloud")
      host = self.network_interface[0].nat_ip_address
    }
  }

  provisioner "local-exec" {
    command = <<-EOT
    echo "Waiting for VM to be ready..."
    attempts=0
    max_attempts=30
    until nc -zv ${self.network_interface[0].nat_ip_address} 22 || [ $attempts -eq $max_attempts ]; do
      sleep 10
      attempts=$((attempts+1))
      echo "Attempt $attempts/$max_attempts - Waiting for SSH..."
    done

    if [ $attempts -eq $max_attempts ]; then
      echo "Failed to connect to VM after $max_attempts attempts"
      exit 1
    fi

    # Создаём inventory.yml с правильным форматом
    cat > ${path.module}/../ansible/inventory.yml << EOF
all:
  hosts:
    task-manager-vm:
      ansible_host: ${self.network_interface[0].nat_ip_address}
      ansible_user: ubuntu
      ansible_ssh_private_key_file: ${var.ssh_private_key_path}
      ansible_python_interpreter: /usr/bin/python3
EOF

    # Запускаем Ansible с увеличенными таймаутами
    ANSIBLE_CONFIG=ansible.cfg ansible-playbook -i ${path.module}/../ansible/inventory.yml ${path.module}/../ansible/install-docker.yml -vvv
  EOT
  }
}