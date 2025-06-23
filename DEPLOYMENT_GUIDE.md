# Руководство по развертыванию Task Manager

Это руководство описывает различные способы сборки контейнеров на локальной машине и их автоматического развертывания на виртуальной машине.

## Предварительные требования

### На локальной машине:
- Docker и Docker Compose
- Yandex Cloud CLI (`yc`) (для работы с Container Registry)
- SSH доступ к виртуальной машине
- Ansible (опционально, для автоматического развертывания)

### На виртуальной машине:
- Docker и Docker Compose (устанавливается через Ansible)
- Yandex Cloud CLI (`yc`) (для работы с Container Registry)

## Способ 1: Использование Yandex Container Registry (рекомендуемый)

Этот способ использует Yandex Container Registry для хранения образов и автоматического развертывания.

### Настройка

1. **Создайте файл `.env` на основе `env.example`:**
   ```bash
   cp env.example .env
   ```

2. **Отредактируйте `.env` файл:**
   ```env
   # Yandex Container Registry configuration
   REGISTRY_HOST=cr.yandex/crxxxxxxxxxxxx
   
   # VM configuration
   VM_IP=your-vm-ip-address
   VM_USER=ubuntu
   
   # Application configuration
   HOST=your-vm-ip-address
   ```

3. **Убедитесь, что у вас настроен Yandex Cloud CLI:**
   ```bash
   yc config list
   ```

### Развертывание

1. **Запустите основной скрипт развертывания:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

Этот скрипт выполнит следующие действия:
- Соберет Docker образы для backend и frontend
- Загрузит образы в Yandex Container Registry
- Создаст production конфигурацию docker-compose
- Передаст файлы на виртуальную машину
- Автоматически развернет приложение

## Способ 2: Передача образов через tar архивы

Этот способ не требует Container Registry и передает образы напрямую.

### Развертывание

1. **Запустите скрипт для локальных образов:**
   ```bash
   chmod +x deploy-local-images.sh
   ./deploy-local-images.sh
   ```

Этот скрипт выполнит:
- Сборку образов локально
- Сохранение образов в tar архивы
- Передачу архивов на VM
- Загрузку образов на VM
- Развертывание приложения

## Способ 3: Использование Ansible (для автоматизации)

Этот способ использует Ansible для полной автоматизации процесса.

### Настройка

1. **Убедитесь, что Ansible установлен:**
   ```bash
   ansible --version
   ```

2. **Настройте inventory файл:**
   ```bash
   # ansible/inventory.yml уже настроен в main.tf
   ```

### Развертывание

1. **Запустите Ansible плейбук:**
   ```bash
   export REGISTRY_HOST=cr.yandex/crxxxxxxxxxxxx
   export VM_IP=your-vm-ip-address
   ansible-playbook -i ansible/inventory.yml ansible/deploy-app.yml
   ```

## Способ 4: Ручное развертывание

Если вы предпочитаете выполнять шаги вручную:

### На локальной машине:

1. **Соберите образы:**
   ```bash
   docker buildx build --platform linux/amd64 -t task-manager-backend:latest ./backend
   docker buildx build --platform linux/amd64 -t task-manager-frontend:latest ./frontend
   ```

2. **Сохраните образы:**
   ```bash
   docker save task-manager-backend:latest | gzip > task-manager-backend.tar.gz
   docker save task-manager-frontend:latest | gzip > task-manager-frontend.tar.gz
   ```

3. **Передайте файлы на VM:**
   ```bash
   scp task-manager-backend.tar.gz task-manager-frontend.tar.gz docker-compose.prod.yml user@vm-ip:~/task-manager-deployment/
   ```

### На виртуальной машине:

1. **Загрузите образы:**
   ```bash
   docker load < task-manager-backend.tar.gz
   docker load < task-manager-frontend.tar.gz
   ```

2. **Запустите приложение:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Проверка развертывания

После успешного развертывания проверьте:

- **Frontend:** http://vm-ip:8080
- **Backend API:** http://vm-ip:3000/health
- **MySQL:** vm-ip:3306

### Команды для мониторинга:

```bash
# Статус контейнеров
docker-compose -f docker-compose.prod.yml ps

# Логи приложения
docker-compose -f docker-compose.prod.yml logs -f

# Статистика ресурсов
docker stats

# Проверка здоровья сервисов
curl http://vm-ip:3000/health
```

## Устранение неполадок

### Проблемы с подключением к Container Registry:
```bash
# Проверьте авторизацию
yc container registry configure-docker

# Проверьте права доступа
yc container registry list
```

### Проблемы с портами:
```bash
# Проверьте открытые порты на VM
sudo netstat -tlnp | grep -E ':(8080|3000|3306)'

# Проверьте firewall
sudo ufw status
```

### Проблемы с Docker:
```bash
# Перезапустите Docker
sudo systemctl restart docker

# Проверьте логи Docker
sudo journalctl -u docker -f
```

### Проблемы с контейнерами:
```bash
# Проверьте логи конкретного контейнера
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.prod.yml logs mysql
```

## Обновление приложения

Для обновления приложения просто запустите соответствующий скрипт развертывания заново:

```bash
# Для Container Registry
./deploy.sh

# Для локальных образов
./deploy-local-images.sh

# Для Ansible
ansible-playbook -i ansible/inventory.yml ansible/deploy-app.yml
```

## Рекомендации

1. **Используйте Container Registry** для production окружений - это более надежно и масштабируемо
2. **Настройте CI/CD** для автоматического развертывания при изменениях в коде
3. **Используйте health checks** для мониторинга состояния сервисов
4. **Настройте backup** для базы данных
5. **Используйте переменные окружения** для конфигурации 