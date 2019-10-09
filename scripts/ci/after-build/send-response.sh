#!/bin/bash
set -e

# generate a signuture required to validate request
SIGNATURE=$(echo -n $SEMAPHORE_PROJECT_NAME | openssl sha256 -hmac $QABOT_SECRET)
NEW_SIGNATURE=${SIGNATURE#*= }

PASSES=$(cat current-result.json | grep passes | grep -oE "[0-9]{1,}")
FAILURES=$(cat current-result.json | grep failures | grep -oE "[0-9]{1,}")
PENDING=$(cat current-result.json | grep pending | grep -oE "[0-9]{1,}")

generate_post_data()
{
  cat <<EOF
{
  "project": "$SEMAPHORE_PROJECT_NAME",
  "buildNumber": "$SEMAPHORE_BUILD_NUMBER",
  "result": "$SEMAPHORE_JOB_RESULT",
  "branch": "$BRANCH_NAME",
  "netlify": "$NETLIFY_URL",
  "site": "$SITE",
  "browser": "$BROWSER_NAME",
  "userId": "$USER_ID",
  "testsDetails": {
    "passes": $PASSES,
    "failures": $FAILURES,
    "pending": $PENDING
  }
}
EOF
}

if [[ $BRANCH_NAME == *selenoid-branch* ]]; then URL=$QABOT_URL; else URL=$QABOT_URL_DEV; fi;

# send a post request to generate slack message with results
curl -d "$(generate_post_data)" -H "qabot-signature: ${NEW_SIGNATURE}" -H "Content-Type: application/json" -H "Accept: application/json" -X POST $URL/results