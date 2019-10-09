#!/bin/bash
set -e

# SELENIUM_SERVER url will come from semaphore http://{host}:{port}/wd/hub
URL=$1/status

if [ $# -lt 1 ]
  then
    echo "No arguments or incorrect number of arguments supplied"
    exit 1
fi


echo "Health check for: ${URL}"

# print actual http status from server response
curl ${URL} -sSLI --connect-timeout 10 | grep HTTP

# health check, it fails the script on server errors
curl ${URL} -k -s -f -o /dev/null --connect-timeout 10 && exit 0 || exit 1