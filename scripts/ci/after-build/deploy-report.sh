#!/bin/bash
set -e

# deploy to netlify and get an url
URL=$(yarn netlify deploy --auth $NETLIFY_AUTH_TOKEN | grep -o 'https://.*netlify*.com$')
echo $URL