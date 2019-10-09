#!/bin/bash
set -ex

# use JS script to get requested site from a semaphore
SITE=$(FIELD=site node scripts/manage/handle-selenoid-data.js)
echo "$SITE"