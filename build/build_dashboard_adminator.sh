#!/bin/sh


BASE_PATH=`pwd`
TARGET_PATH="${BASE_PATH}/target/dashboard_adminator"
PROJECT_PATH="${BASE_PATH}/dashboard"

echo "[Building] dashboard Adminator"
echo "Project path: ${PROJECT_PATH}"
echo "Target path: ${BASE_PATH}"

rm -rf $TARGET_PATH
mkdir -p $TARGET_PATH


cd $PROJECT_PATH
npm install
npm run build

echo "Compressing Dashboard Adminator"
tar -czf dashboard_adminator.tar.gz build



echo "Moving project to target folder"
mv -f dashboard_adminator.tar.gz $TARGET_PATH

echo "Download and packaging production dependecies"
cd $TARGET_PATH


echo "Building docker container"
mkdir docker
cp dashboard_adminator.tar.gz docker
cp "${BASE_PATH}/docker/nginx/Dockerfile" "docker"