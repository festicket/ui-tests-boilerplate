#!/bin/bash
set -ex

aws s3 cp ./allure-report/ "s3://rlve-private/artifacts/${BRANCH_NAME}_${SEMAPHORE_BUILD_NUMBER}/" --recursive

# use JS script to change value of successful report for a branch in a semaphore
UPDATE=true FIELD=lastReport VALUE=${SEMAPHORE_BUILD_NUMBER} node scripts/manage/handle-selenoid-data.js