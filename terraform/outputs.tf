output "vm_public_ip" {
  description = "Public IPv4 of the VM (if created)"
  value       = length(yandex_compute_instance.vm) > 0 ? yandex_compute_instance.vm[0].network_interface[0].nat_ip_address : null
}


