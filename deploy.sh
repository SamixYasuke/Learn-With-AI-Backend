#!/bin/bash

# Stop and remove any existing containers for this compose setup
docker-compose down

# Build and start containers in detached mode
docker-compose up --build -d

# Show running containers for verification
docker-compose ps
