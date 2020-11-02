#!/bin/sh

rm -r target/dashboard_api
mkdir -p target/dashboard_api


cd dashboard_api
npm install
npm run build

mv -f build/ package.json ../target/dashboard_api

cd ../target/dashboard_api
npm install --only=prod
