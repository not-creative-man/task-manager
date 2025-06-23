# Развертывание Task Manager на виртуальной машине

## Предварительные требования

На виртуальной машине должны быть установлены:
- Docker
- Docker Compose
- Git (опционально)

## Способ 1: Передача через образы (рекомендуемый)

### На локальной машине:

1. **Экспорт образов:**
   ```bash
   chmod +x export-images.sh
   ./export-images.sh
   ```

2. **Передача файлов на VM:**
   ```bash
   # Через SCP
   scp task-manager-images.tar.gz user@vm-ip:/path/to/destination/
   scp docker-compose.prod.yml user@vm-ip:/path/to/destination/
   scp import-images.sh user@vm-ip:/path/to/destination/
   
   # Или через rsync
   rsync -avz task-manager-images.tar.gz docker-compose.prod.yml import-images.sh user@vm-ip:/path/to/destination/
   ```

### На виртуальной машине:

1. **Импорт образов:**
   ```bash
   chmod +x import-images.sh
   ./import-images.sh
   ```

2. **Запуск приложения:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Проверка статуса:**
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   ```

## Способ 2: Передача исходного кода

### На локальной машине:

1. **Архивирование проекта:**
   ```bash
   tar -czf task-manager-source.tar.gz --exclude=node_modules --exclude=.git .
   ```

2. **Передача на VM:**
   ```bash
   scp task-manager-source.tar.gz user@vm-ip:/path/to/destination/
   ```

### На виртуальной машине:

1. **Распаковка и сборка:**
   ```bash
   tar -xzf task-manager-source.tar.gz
   cd task-manager
   docker-compose up -d --build
   ```

## Способ 3: Использование Docker Registry

### Настройка приватного registry:

1. **Создание registry:**
   ```bash
   docker run -d -p 5000:5000 --name registry registry:2
   ```

2. **Публикация образов:**
   ```bash
   docker tag task-manager-frontend:latest localhost:5000/task-manager-frontend:latest
   docker push localhost:5000/task-manager-frontend:latest
   ```

3. **На VM - загрузка образов:**
   ```bash
   docker pull localhost:5000/task-manager-frontend:latest
   ```

## Проверка работоспособности

После запуска проверьте:

- **Frontend:** http://vm-ip:8080
- **Backend API:** http://vm-ip:3000/api/health
- **MySQL:** vm-ip:3306

## Переменные окружения

Создайте файл `.env` на VM:
```env
HOST=vm-ip-address
REGISTRY_HOST=your-registry-host
```

## Мониторинг

```bash
# Логи контейнеров
docker-compose -f docker-compose.prod.yml logs -f

# Статистика ресурсов
docker stats

# Проверка здоровья
docker-compose -f docker-compose.prod.yml ps
```

## Troubleshooting

1. **Проблемы с портами:** Убедитесь, что порты 8080, 3000, 3306 открыты
2. **Проблемы с памятью:** Увеличьте лимиты Docker или добавьте swap
3. **Проблемы с сетью:** Проверьте firewall и настройки сети 