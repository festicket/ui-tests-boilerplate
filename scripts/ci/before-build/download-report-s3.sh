#!/bin/bash
set -ex

# use JS script to get id of previous successful report from a semaphore
PREVIOUS_REPORT=$(FIELD=lastReport node scripts/manage/handle-selenoid-data.js)
echo "previous report: $PREVIOUS_REPORT"

aws s3 cp "s3://rlve-private/artifacts/${BRANCH_NAME}_${PREVIOUS_REPORT}/" ./allure-report/ --recursive