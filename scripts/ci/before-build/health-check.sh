#!/bin/bash
set -e

function getUrl {
     if [[ $1 == "prod" ]]
     then
         echo "https://www.festicket.com"
    else
        echo "https://$1.festicket.io"
     fi
}

URL=$(getUrl $1)
echo "Health check for: ${URL}"

COOKIE="X-FESTICKET-AUTH=${INTERNAL_AUTH_COOKIE_VALUE}"

# print actual http status from server response
curl ${URL} -sI --cookie ${COOKIE} --connect-timeout 30 | grep HTTP

# health check, it fails the script on server errors
curl ${URL} -k -s -f -o /dev/null --cookie ${COOKIE} --connect-timeout 30 && exit 0 || exit 1