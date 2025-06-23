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
