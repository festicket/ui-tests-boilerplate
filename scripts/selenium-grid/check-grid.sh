#!/bin/bash
# check-grid.sh
# THIS IS USED BY DOCKER WHEN LAUNCHING SELENIUM GRID
# https://github.com/SeleniumHQ/docker-selenium#adding-a-healthcheck-to-the-grid

set -e

HOST="localhost"
PORT="4444"

# process arguments
while [[ $# -gt 0 ]]
do
    case "$1" in
        --host)
        HOST=${2:-"localhost"}
        shift 2
        ;;
        --port)
        PORT=${2:-"4444"}
        shift 2
        ;;
        *)
        echoerr "Unknown argument: $1"
        ;;
    esac
done

curl -sSL http://${HOST}:${PORT}/wd/hub/status | jq -r '.value.ready' | grep "true" || exit 1