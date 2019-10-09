#!/bin/bash
set -ex

if [ $# -eq 0 ]
  then
    echo "Pass number of branches and branch name"
    exit 1
fi

BRANCHES_NUMBER=$1
BRANCH_TO_MERGE=$2

for (( i=1; i<=${BRANCHES_NUMBER}; i++ ))
do
     NAME="selenoid-branch-$i"
     ./scripts/manage/update-branch.sh $NAME $BRANCH_TO_MERGE
done