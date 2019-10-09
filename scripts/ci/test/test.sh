#!/bin/bash

# Break on errors and show logs
set -x

IS_SELENOID=$1
IS_PARALLEL=$2
REMOTE_SERVER_HOST=$3
REMOTE_SERVER_PORT=$4
SELENIUM_SERVER_STATUS=$5
BRANCH_NAME=$6
SITE=$7
BROWSER_NAME=$8
PLATFORM_NAME=$9
OPTS="${10}"

if [ $# -lt 9 ]
  then
    echo -e "\e[31mNo arguments or incorrect number of arguments supplied"
    exit 1
fi

if [[ "$SELENIUM_SERVER_STATUS" == *"200 OK"* && $IS_SELENOID == false ]]; then #RUN TESTS VIA SELENIUM GRID
    IS_LOCAL=false REMOTE_SERVER_HOST=$REMOTE_SERVER_HOST REMOTE_SERVER_PORT=$REMOTE_SERVER_PORT SITE=$SITE BROWSER_NAME=$BROWSER_NAME PLATFORM_NAME=$PLATFORM_NAME IS_PARALLEL=$IS_PARALLEL yarn test:ci $OPTS || error=true
elif [[ $IS_SELENOID == true ]]; then 
    IS_CI=true IS_LOCAL=true SITE=$SITE BROWSER_NAME=$BROWSER_NAME BROWSER_VERSION=74 yarn test:selenoid "$OPTS" || error=true
else
    echo -e "\e[31mSomething went wrong: check if you're missing a condition."
fi

if [ $error ]
then 
    echo -e "\e[31mAn error occured during execution!"
    exit 1
fi