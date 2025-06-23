#!/bin/bash

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Load environment variables
if [ -f .env ]; then
    source .env
    print_status "Loaded environment variables from .env"
else
    print_warning "No .env file found, using defaults"
fi

# Check required variables
if [ -z "$VM_IP" ]; then
    print_error "VM_IP environment variable is not set"
    echo "Please set it to your VM's IP address"
    exit 1
fi

if [ -z "$VM_USER" ]; then
    VM_USER="ubuntu"
    print_warning "VM_USER not set, using default: ubuntu"
fi

if [ -z "$SSH_KEY" ]; then
    SSH_KEY="~/.ssh/yandex_cloud"
    print_warning "SSH_KEY not set, using default: ~/.ssh/yandex_cloud"
fi

# Step 1: Build images locally
print_status "Step 1: Building Docker images locally"

# Build backend image
print_status "Building backend image..."
docker buildx build --platform linux/amd64 -t task-manager-backend:latest ./backend

# Build frontend image
print_status "Building frontend image..."
docker buildx build --platform linux/amd64 -t task-manager-frontend:latest ./frontend --no-cache

# Step 2: Save images to tar files
print_status "Step 2: Saving images to tar files"
docker save task-manager-backend:latest | gzip > task-manager-backend.tar.gz
docker save task-manager-frontend:latest | gzip > task-manager-frontend.tar.gz

# Step 3: Create production docker-compose file
print_status "Step 3: Creating production docker-compose configuration"
cat > docker-compose.prod.yml << EOF
services:
  mysql:
    image: mysql:5.7
    platform: linux/amd64
    restart: always
    command: --default-authentication-plugin=mysql_native_password
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=my_db
      - HOST=${VM_IP}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-ppassword"]
      interval: 5s
      timeout: 10s
      retries: 5

  backend:
    image: task-manager-backend:latest
    platform: linux/amd64
    restart: always
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=mysql
      - DB_USER=root
      - DB_PASSWORD=password
      - HOST=${VM_IP}
    healthcheck:
      test: "CMD curl -f http://localhost:3000/health"
      interval: 5s
      timeout: 10s
      retries: 5
    depends_on:
      - mysql

  frontend:
    image: task-manager-frontend:latest
    platform: linux/amd64
    restart: always
    ports:
      - "8080:80"
    environment:
      - HOST=${VM_IP}
      - VITE_API_URL=http://${VM_IP}:3000
    depends_on:
      - backend

volumes:
  mysql_data:
EOF

# Step 4: Create deployment script for VM
print_status "Step 4: Creating deployment script for VM"
cat > deploy-local-to-vm.sh << 'EOF'
#!/bin/bash

# Exit on error
set -e

echo "Starting deployment on VM..."

# Load images
echo "Loading Docker images..."
docker load < task-manager-backend.tar.gz
docker load < task-manager-frontend.tar.gz

# Stop existing containers
echo "Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down || true

# Start new containers
echo "Starting new containers..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Check service status
echo "Checking service status..."
docker-compose -f docker-compose.prod.yml ps

echo "Deployment completed successfully!"
echo "Frontend: http://${VM_IP}:8080"
echo "Backend API: http://${VM_IP}:3000"
EOF

chmod +x deploy-local-to-vm.sh

# Step 5: Transfer files to VM and deploy
print_status "Step 5: Transferring files to VM and deploying"

# Create deployment directory on VM
ssh -i $SSH_KEY -o StrictHostKeyChecking=no $VM_USER@$VM_IP "mkdir -p ~/task-manager-deployment"

# Transfer files
print_status "Transferring deployment files to VM..."
scp -i $SSH_KEY -o StrictHostKeyChecking=no docker-compose.prod.yml $VM_USER@$VM_IP:~/task-manager-deployment/
scp -i $SSH_KEY -o StrictHostKeyChecking=no deploy-local-to-vm.sh $VM_USER@$VM_IP:~/task-manager-deployment/
scp -i $SSH_KEY -o StrictHostKeyChecking=no task-manager-backend.tar.gz $VM_USER@$VM_IP:~/task-manager-deployment/
scp -i $SSH_KEY -o StrictHostKeyChecking=no task-manager-frontend.tar.gz $VM_USER@$VM_IP:~/task-manager-deployment/
scp -i $SSH_KEY -o StrictHostKeyChecking=no -r db/ $VM_USER@$VM_IP:~/task-manager-deployment/

# Set environment variables on VM and run deployment
print_status "Running deployment on VM..."
ssh -i $SSH_KEY -o StrictHostKeyChecking=no $VM_USER@$VM_IP "cd ~/task-manager-deployment && VM_IP=$VM_IP ./deploy-local-to-vm.sh"

# Cleanup local tar files
print_status "Cleaning up local tar files..."
rm -f task-manager-backend.tar.gz task-manager-frontend.tar.gz

print_status "Deployment completed successfully!"
print_status "Your application is now running at:"
echo "  Frontend: http://$VM_IP:8080"
echo "  Backend API: http://$VM_IP:3000"
echo "  MySQL: $VM_IP:3306" 