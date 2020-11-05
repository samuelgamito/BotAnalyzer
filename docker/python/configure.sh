#!/bin/bash

apt-get update
apt-get install -y python3 python-dev python3-pip
apt-get install -y python3-scipy

tar -xf *.tar.gz
python3 -m pip install -r requirements.txt
python3 src/download.py
