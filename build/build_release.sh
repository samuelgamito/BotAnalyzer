#!/bin/sh

VERSION_PATH=$1


VERSION_NUMBER="$(cut -d'/' -f3 <<<"$VERSION_PATH")"

echo $VERSION_NUMBER

cp docker/docker-compose.yml target
cd target

echo $1 > version.txt

tar -czf "${VERSION_NUMBER}.tar.gz" *