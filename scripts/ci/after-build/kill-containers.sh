#!/bin/bash

# Break on errors and show logs
set -x

docker container stop $(docker container ls -aq)
docker container rm $(docker container ls -aq)