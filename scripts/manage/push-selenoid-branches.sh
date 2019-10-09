#!/bin/bash
set -e

if [ $# -eq 0 ]
  then
    echo "An argument with number of selenoid branches required."
    exit 1
fi

BRANCHES_NUMBER=$1

if [ ${BRANCHES_NUMBER} -gt 5 ]
  then
    echo "Are you sure you want ${BRANCHES_NUMBER} branches?"
    exit 1
fi

git checkout master

for (( i=1; i<=${BRANCHES_NUMBER}; i++ ))
do
    NAME="selenoid-branch-$i"
    if echo $* | grep -e "--remove" -q
    then
        git branch -D $NAME
        git push origin --delete $NAME
        echo "removed $NAME"
    else
        git checkout -b $NAME
        git push --set-upstream origin $NAME
        echo "created $NAME"
    fi
done