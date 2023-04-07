#!/bin/bash

# Script to push scentgraph image to DockerHub

DOCKER_TAG_NAME=apndx/scentgraph

echo 'Logging in with Docker'
docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD

echo "Building $DOCKER_TAG_NAME"
docker build -t $DOCKER_TAG_NAME .

echo 'Pushing to dockerhub'
docker push $DOCKER_TAG_NAME

echo 'Push finished!'
