# Развертывание Task Manager

## Предварительные требования

1. Установленный Terraform (версия >= 1.0.0)
2. Установленный Yandex Cloud CLI (yc)
3. Настроенный доступ к Yandex Cloud (токен, cloud_id, folder_id)
4. SSH-ключи для доступа к виртуальной машине

## Шаги развертывания

### 1. Настройка Terraform

1. Убедитесь, что у вас есть все необходимые переменные в `main.tf`:
   - token
   - cloud_id
   - folder_id
   - SSH-ключи

2. Инициализируйте Terraform:
   ```bash
   terraform init
   ```

3. Примените конфигурацию:
   ```bash
   terraform apply
   ```

4. После успешного применения сохраните вывод команды, особенно:
   - external_ip (IP-адрес виртуальной машины)
   - registry_url (URL Container Registry)

### 2. Настройка Container Registry

1. Создайте файл `.env` в корневой директории проекта:
   ```bash
   REGISTRY_HOST=<registry_url_from_terraform_output>
   ```

2. Убедитесь, что вы авторизованы в Yandex Cloud CLI:
   ```bash
   yc init
   ```

### 3. Сборка и публикация Docker-образов

1. Запустите скрипт сборки и публикации:
   ```bash
   ./build-and-push.sh
   ```

### 4. Запуск приложения

1. Подключитесь к виртуальной машине:
   ```bash
   ssh ubuntu@<external_ip>
   ```

2. Клонируйте репозиторий на виртуальную машину:
   ```bash
   git clone <repository_url>
   cd task-manager
   ```

3. Создайте файл `.env` с настройками Container Registry:
   ```bash
   echo "REGISTRY_HOST=<registry_host>" > .env
   ```

4. Запустите приложение:
   ```bash
   docker-compose up -d
   ```

## Проверка работоспособности

1. Frontend доступен по адресу: `http://<external_ip>:8080`
2. Backend API доступен по адресу: `http://<external_ip>:3000`
3. MySQL доступен на порту 3306 (только локально)

## Обновление приложения

1. Внесите необходимые изменения в код
2. Запустите скрипт сборки и публикации:
   ```bash
   ./build-and-push.sh
   ```
3. На виртуальной машине обновите образы:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

## Удаление инфраструктуры

Для удаления всей созданной инфраструктуры выполните:
```bash
terraform destroy
```

## Безопасность

- Все пароли и чувствительные данные хранятся в переменных окружения
- SSH-доступ настроен только по ключам
- Docker-образы хранятся в приватном Container Registry
- База данных доступна только внутри Docker-сети 