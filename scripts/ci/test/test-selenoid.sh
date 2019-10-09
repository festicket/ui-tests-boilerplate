#!/bin/bash

# Break on errors and show logs
set -x
set +e

OPTS=$1

`pwd`/scripts/ci/test/selenoid-docker.sh

if [[ $IS_CI == true ]]; then 
    yarn test:ci $OPTS || error=true
else
    yarn test $OPTS || error=true
fi

`pwd`/scripts/ci/after-build/kill-containers.sh

if [ $error ]; then 
    exit -1
fi

