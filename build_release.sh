#!/bin/sh

VERSION_NUMBER=$1

cp docker/docker-compose.yml target
cd target

echo $1 > version.txt

tar -czf "${VERSION_NUMBER}.tar.gz" *