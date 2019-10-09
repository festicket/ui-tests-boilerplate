#!/bin/bash
set -ex

# health check, it fails on server errors
scripts/ci/before-build/health-check.sh $SITE_NUM

# install dependencies
yarn install --frozen-lockfile

# download previous report from s3 bucket, used to maintain history trends in reports, WORKS ONLY FOR ALLURE REPORTER
if [[ $BRANCH_NAME == *selenoid* ]]
then 
    scripts/ci/before-build/download-report-s3.sh
fi