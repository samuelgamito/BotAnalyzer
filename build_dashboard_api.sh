#!/bin/sh


BASE_PATH=`pwd`
TARGET_PATH="${BASE_PATH}/target/dashboard_api"
PROJECT_PATH="${BASE_PATH}/core/dashboard_api"

echo "[Building] dashbord_api"
echo "Project path: ${PROJECT_PATH}"
echo "Target path: ${BASE_PATH}"

rm -rf $TARGET_PATH

mkdir -p $TARGET_PATH


echo "Building NODE project dashboard_api"
cd $PROJECT_PATH
npm install
npm run build


echo "Moving project to target folder"
mv -f build/ $TARGET_PATH
cp -f package.json $TARGET_PATH


echo "Download and packaging production dependecies"
cd $TARGET_PATH
tar -czf dashboard_api.tar.gz *


echo "Building docker container"
mkdir docker
mv dashboard_api.tar.gz docker
cp "${BASE_PATH}/docker/nodejs/Dockerfile" "docker"