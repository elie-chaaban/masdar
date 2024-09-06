#!/usr/bin/env bash

DOCKER_NAME=masdar-frontend-dashboard

rm .env
cp .env.masdar .env
docker build -t ${DOCKER_NAME} .
docker run --name ${DOCKER_NAME} -p 2331:80 ${1} -d ${DOCKER_NAME}
docker container ls -a
