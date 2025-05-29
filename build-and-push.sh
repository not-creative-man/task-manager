#!/bin/bash

# Exit on error
set -e

# Load environment variables if .env file exists
if [ -f .env ]; then
    source .env
fi

# Check if registry host is set
if [ -z "$REGISTRY_HOST" ]; then
    echo "Error: REGISTRY_HOST environment variable is not set"
    echo "Please set it to your Yandex Container Registry host (e.g., cr.yandex/crxxxxxxxxxxxx)"
    exit 1
fi

# Login to Yandex Container Registry
echo "Logging in to Yandex Container Registry..."
yc container registry configure-docker

# Build and push backend image
echo "Building backend image..."
docker build -t $REGISTRY_HOST/task-manager-backend:latest ./backend
echo "Pushing backend image..."
docker push $REGISTRY_HOST/task-manager-backend:latest

# Build and push frontend image
echo "Building frontend image..."
docker build -t $REGISTRY_HOST/task-manager-frontend:latest ./frontend
echo "Pushing frontend image..."
docker push $REGISTRY_HOST/task-manager-frontend:latest

echo "All images have been built and pushed successfully!" 