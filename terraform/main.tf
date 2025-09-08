terraform {
  required_providers {
    yandex = {
      source  = "yandex-cloud/yandex"
      version = "~> 0.142.0"
    }
  }
}

provider "yandex" {
  token     = var.yc_token
  cloud_id  = var.cloud_id
  folder_id = var.folder_id
  zone      = "ru-central1-a"
  endpoint  = "api.cloud.yandex.net:443"
}

data "http" "my_ip" {
  url = "https://ifconfig.me/ip"
}

# Создаем сеть и подсеть
resource "yandex_vpc_network" "network" {
  name = "task-manager-network"
}

resource "yandex_vpc_subnet" "subnet" {
  name           = "task-manager-subnet"
  zone           = "ru-central1-a"
  network_id     = yandex_vpc_network.network.id
  v4_cidr_blocks = ["192.168.10.0/24"]
}

# Container Registry
resource "yandex_container_registry" "registry" {
  name = "task-manager-registry"
}

# resource "yandex_container_registry_ip_permission" "my_ip_permission" {
#   registry_id = yandex_container_registry.registry.id
#   push        = ["${chomp(data.http.my_ip.response_body)}/32"]
#   pull        = ["${chomp(data.http.my_ip.response_body)}/32"]
# }

# Kubernetes кластер
resource "yandex_kubernetes_cluster" "cluster" {
  name        = "task-manager-cluster"
  network_id  = yandex_vpc_network.network.id

  release_channel = "REGULAR"

  master {
    version  = "1.30"
    public_ip = true
    zonal {
      zone      = "ru-central1-a"
      subnet_id = yandex_vpc_subnet.subnet.id
    }
  }

  service_account_id      = yandex_iam_service_account.k8s-admin.id
  node_service_account_id = yandex_iam_service_account.k8s-node.id

  depends_on = [
    yandex_resourcemanager_folder_iam_binding.k8s-admin-editor,
    yandex_resourcemanager_folder_iam_binding.k8s-node-puller
  ]
}

# Группа нод Kubernetes
resource "yandex_kubernetes_node_group" "workers" {
  cluster_id = yandex_kubernetes_cluster.cluster.id
  name       = "worker-group"
  version    = "1.30"

  instance_template {
    platform_id = "standard-v2"
    resources {
      memory = 4
      cores  = 2
    }
    boot_disk {
      type = "network-hdd"
      size = 50
    }
    network_interface {
      subnet_ids = [yandex_vpc_subnet.subnet.id]
      nat        = true
    }
  }

  scale_policy {
    fixed_scale {
      size = 2
    }
  }
}