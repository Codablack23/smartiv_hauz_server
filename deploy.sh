#!/bin/bash

# === Nectere Server Deployment Script ===
# Make sure to run this from your project root.

set -e  # Exit immediately if any command fails

CONTAINER_NAME="smartiv-server-v9"
IMAGE_NAME="smartiv-server:v1"
PORT_MAPPING="4003:5505"
ENV_FILE=".env"

echo "🚀 Starting deployment for $CONTAINER_NAME..."

# 1. Pull latest code
echo "📦 Pulling latest changes from Git..."
git pull origin main

# 2. Build the Docker image
echo "🔨 Building Docker image..."
sudo docker build -t $IMAGE_NAME .

# 3. Stop running container (if any)
if [ "$(sudo docker ps -q -f name=$CONTAINER_NAME)" ]; then
  echo "🛑 Stopping existing container..."
  sudo docker stop $CONTAINER_NAME
fi

# 4. Remove old container (if exists)
if [ "$(sudo docker ps -aq -f name=$CONTAINER_NAME)" ]; then
  echo "🧹 Removing old container..."
  sudo docker rm $CONTAINER_NAME
fi

# 5. Run new container
echo "🚢 Starting new container..."
sudo docker run -d \
  --name $CONTAINER_NAME \
  --env-file $ENV_FILE \
  -p $PORT_MAPPING \
  $IMAGE_NAME

echo "✅ Deployment completed successfully!"
sudo docker ps | grep $CONTAINER_NAME
