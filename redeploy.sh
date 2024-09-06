#!/usr/bin/env bash

DOCKER_NAME=i-district-frontend-canada
CONTAINER_IDS=$(docker container ls -a -q -f name=${DOCKER_NAME})

if [[ "$CONTAINER_IDS" != "" ]]; then
    docker container rm -f ${CONTAINER_IDS} || true
    exit
fi

docker login --username=nxn2021 --password=NXNLogin@2019

docker pull nxn2021/i-district-frontend-canada:latest
docker system prune -f

docker run --name ${DOCKER_NAME} -p 2331:80 ${1} nxn2021/i-district-frontend-canada:latest
docker container ls -a