#!/bin/sh


BASE_PATH=`pwd`
TARGET_PATH="${BASE_PATH}/target/nlp_api"
PROJECT_PATH="${BASE_PATH}/core/nlp_api"

echo "[Building] nlp_api"
echo "Project path: ${PROJECT_PATH}"
echo "Target path: ${BASE_PATH}"

rm -rf $TARGET_PATH

mkdir -p $TARGET_PATH


echo "Compressing PY project nlp_api"
cd $PROJECT_PATH
tar -czf nltk_api.tar.gz *


echo "Moving project to target folder"
mv -f nltk_api.tar.gz $TARGET_PATH


cd $TARGET_PATH


echo "Building docker container"
mkdir docker
mv nltk_api.tar.gz docker
cp "${BASE_PATH}/docker/python/Dockerfile" "docker"
cp "${BASE_PATH}/docker/python/configure.sh" "docker"