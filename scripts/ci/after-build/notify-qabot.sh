#!/bin/bash
set -e

# generate a signuture required to validate request
SIGNATURE=$(echo -n $SEMAPHORE_PROJECT_NAME | openssl sha256 -hmac $QABOT_SECRET)
NEW_SIGNATURE=${SIGNATURE#*= }  

if [[ $BRANCH_NAME == *selenoid-branch* ]]; then URL=$QABOT_URL; else URL=$QABOT_URL_DEV; fi;

# send a post request to notify qabot that execution finished
curl -H "qabot-signature: ${NEW_SIGNATURE}" -X POST $URL/free