if [ -f .env ]; then
    source .env
    echo "Loaded environment variables from .env"
else
    echo "No .env file found, using defaults"
fi

if [ -z "$REGISTRY_HOST" ]; then
    echo "REGISTRY_HOST environment variable is not set"
    echo "Please set it to your Yandex Container Registry host (e.g., cr.yandex/crxxxxxxxxxxxx)"
    exit 1
fi

echo "Registry Host is $REGISTRY_HOST"

echo "Build backend image..."
docker buildx build --no-cache --platform linux/amd64 -t task-manager-backend:latest ./backend --load

echo "Tag backend image..."
docker tag task-manager-backend:latest $REGISTRY_HOST/task-manager-backend:latest

echo "Push backend image..."
docker push $REGISTRY_HOST/task-manager-backend:latest


echo "Build frontend image..."
docker buildx build --no-cache --platform linux/amd64 -t task-manager-frontend:latest ./frontend --load

echo "Tag frontend image..."
docker tag task-manager-frontend:latest $REGISTRY_HOST/task-manager-frontend:latest

echo "Push frontend image..."
docker push $REGISTRY_HOST/task-manager-frontend:latest

#cd ansible
#
#ansible-playbook -i inventory.yml deploy.yml