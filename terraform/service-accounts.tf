# Service Accounts for Kubernetes
resource "yandex_iam_service_account" "k8s-admin" {
  name        = "task-manager-k8s-admin"
  description = "Service account for Kubernetes cluster management"
}

resource "yandex_resourcemanager_folder_iam_binding" "k8s-admin-editor" {
  folder_id = var.folder_id
  role      = "editor"
  members   = [
    "serviceAccount:${yandex_iam_service_account.k8s-admin.id}"
  ]
}

resource "yandex_iam_service_account" "k8s-node" {
  name        = "task-manager-k8s-node"
  description = "Service account for Kubernetes worker nodes"
}

resource "yandex_resourcemanager_folder_iam_binding" "k8s-node-puller" {
  folder_id = var.folder_id
  role      = "container-registry.images.puller"
  members   = [
    "serviceAccount:${yandex_iam_service_account.k8s-node.id}"
  ]
}

resource "yandex_resourcemanager_folder_iam_binding" "k8s-node-kms" {
  folder_id = var.folder_id
  role      = "kms.keys.encrypterDecrypter"  # Для работы с шифрованием
  members   = [
    "serviceAccount:${yandex_iam_service_account.k8s-node.id}"
  ]
}