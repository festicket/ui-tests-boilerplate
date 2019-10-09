#!/bin/bash

# Break on errors and show logs
set -x
set +e

# jq is a lightweight and flexible command-line JSON processor
# https://stedolan.github.io/jq/

if [ "$(uname)" == "Darwin" ]; then
    # Mac OS X platform
    # Local dev environment - install manually `brew install jq`
    jqc='jq'
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    # GNU/Linux platform
    wget -O jq https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64
    sudo chmod +x ./jq
    jqc='./jq'
fi
# get the list of images from browsers config and docker pull them
docker pull $(cat ./packages/config-service/src/selenoid/browsers.json | $jqc -r '..|.image?|strings')

# For when you'd like to use SELENOID_ENABLE_VIDEO feature
docker pull selenoid/video-recorder:latest-release


docker run -d --name selenoid                   \
-p 4444:4444                                    \
-v /var/run/docker.sock:/var/run/docker.sock    \
-v `pwd`/packages/config-service/src/selenoid/:/etc/selenoid/:ro     \
-v `pwd`/video/:/opt/selenoid/video/            \
-v `pwd`/logs/:/opt/selenoid/logs/              \
-e OVERRIDE_VIDEO_OUTPUT_DIR=`pwd`/video/       \
aerokube/selenoid:latest-release -limit 2 -log-output-dir /opt/selenoid/logs

