#!/usr/bin/env bash

DOCKER_NAME=masdar-frontend-dashboard
CONTAINER_IDS=$(docker container ls -a -q -f name=${DOCKER_NAME})

if [[ "$CONTAINER_IDS" != "" ]]; then
    docker container rm -f ${CONTAINER_IDS} || true
    exit
fi

docker container ls -a
