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
docker buildx build --platform linux/amd64,linux/arm64 -t $REGISTRY_HOST/task-manager-backend:latest ./backend --push

# Build and push frontend image
echo "Building frontend image..."
docker buildx build --platform linux/amd64,linux/arm64 -t $REGISTRY_HOST/task-manager-frontend:latest ./frontend --push

echo "All images have been built and pushed successfully!" 