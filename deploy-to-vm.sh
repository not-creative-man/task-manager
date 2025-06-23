#!/bin/bash

# Exit on error
set -e

echo "Starting deployment on VM..."

# Pull latest images (no need to login if using public registry or pre-authenticated)
echo "Pulling latest images..."
docker pull ${REGISTRY_HOST}/task-manager-backend:latest
docker pull ${REGISTRY_HOST}/task-manager-frontend:latest

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
