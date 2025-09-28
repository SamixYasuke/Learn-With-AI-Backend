use this for deploy.sh>
#!/usr/bin/env bash

# A script to safely build, stop the old container, and run the new one.

# Exit immediately if a command exits with a non-zero status.
set -e

# Define variables for your application
IMAGE_NAME="my-node-app"
CONTAINER_NAME="my-node-app-container"

echo "Starting deployment..."

# Build the Docker image from the Dockerfile in the current directory
echo "Building Docker image: $IMAGE_NAME"
docker build -t $IMAGE_NAME .

# Check if a container with the same name is running
if [ $(docker ps -q -f name=^/${CONTAINER_NAME}$) ]; then
    echo "Stopping running container: $CONTAINER_NAME"
    docker stop $CONTAINER_NAME
fi

# Check if a container with the same name exists (even if stopped)
if [ $(docker ps -aq -f status=exited -f name=^/${CONTAINER_NAME}$) ]; then
    echo "Removing old container: $CONTAINER_NAME"
docker rm $CONTAINER_NAME
fi

# Run the new Docker container in detached mode
echo "Starting new container: $CONTAINER_NAME"
docker run -d -p 5000:5000 --name $CONTAINER_NAME $IMAGE_NAME

echo ""
echo "Deployment successful!"
echo "Your application is running in the background on port 5000."
echo "To see the logs, run: docker logs $CONTAINER_NAME"
echo "To stop the container, run: docker stop $CONTAINER_NAME"