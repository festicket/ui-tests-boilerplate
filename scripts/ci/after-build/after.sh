#!/bin/bash
set -x

if [ $# -lt 1 ]
  then
    echo -e "\e[31mNo arguments or incorrect number of arguments supplied"
    exit 1
fi

if [[ $BRANCH_NAME == *selenoid* ]]
then 
    # generate report, fail if there are no results (health check failed)
    yarn report:ci || error=true

    # if report generated, upload it to s3 bucket
    if [ ! $error ]; then scripts/ci/after-build/upload-report-s3.sh; fi

    # if report generated, deploy to netlify and get an url
    if [ ! $error ]; then NETLIFY_URL=$(scripts/ci/after-build/deploy-report.sh); fi

    # use JS script to get userId of requesting user from a semaphore
    USER=$(FIELD=userId node scripts/manage/handle-selenoid-data.js)

    # send execution data to qa-bot to generate slack result message
    BROWSER_NAME="$1" SITE=$SITE_NUM USER_ID=${USER} scripts/ci/after-build/send-response.sh;
    
    # notify qa-bot that execution finished and it can start to process next request
    scripts/ci/after-build/notify-qabot.sh;
fi