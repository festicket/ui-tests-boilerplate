#!/bin/bash
# register-mac-node.sh

# script should be used manually to register selenium local nodes on mac
# make sure to update the SEL_VERSION and HOTFIX_VERSION numbers when required.

set -e

# argument for selenium hub-ip:port
SEL_HUB_URL=$1
# check if selenium hub-ip and port are passed in
if [ -z "$SEL_HUB_URL" ]; then echo "MISSING: selenium HUB_IP:PORT argument."; exit 1; fi;

# variables for download script
SEL_RELEASE_URL="http://selenium-release.storage.googleapis.com"
SEL_VERSION="3.141"
HOTFIX_VERSION="59"
SEL_FILENAME="selenium-server-standalone-$SEL_VERSION.$HOTFIX_VERSION.jar"
DOWNLOAD_LINK="$SEL_RELEASE_URL/$SEL_VERSION/$SEL_FILENAME"
FILE_LOCATION=$(dirname "$0")/$SEL_FILENAME

# Don't selenium server standalone file only if it doesn't exist
if [ ! -f "$FILE_LOCATION" ]; then
    echo "$SEL_FILENAME does not exist"
    echo "downloading $DOWNLOAD_LINK"
    curl -# -o $FILE_LOCATION $DOWNLOAD_LINK
fi

NODE_FILE=$(dirname "$0")/nodes/mac-config.json

if [ ! -f "$NODE_FILE" ]; then
    echo "$NODE_FILE does not exist, cannot continue to execute the script!"
    exit 1
fi

# register and start all browser in nodeConfig file against selenium server
java -jar $FILE_LOCATION -role node -nodeConfig $NODE_FILE -hub http://$SEL_HUB_URL/grid/register