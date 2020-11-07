#!/bin/sh

VERSION_PATH=$1

IFS='/'

Read -a VERSION_ARRAY <<< "$VERSION_PATH"

VERSION_NUMBER=$VERSION_ARRAY[2]

cp docker/docker-compose.yml target
cd target

echo $1 > version.txt

tar -czf "${VERSION_NUMBER}.tar.gz" *