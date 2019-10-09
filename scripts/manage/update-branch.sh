#!/bin/bash
set -ex

BRANCHE_TARGET=$1
BRANCH_SOURCE=$2

git checkout $BRANCHE_TARGET
git merge --no-edit -X theirs $BRANCH_SOURCE
git push