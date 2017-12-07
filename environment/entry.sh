#!/usr/bin/env bash
# set -e

if [ "$1" = 'dev' ]; then

    yarn install
    yarn start

else

    exec "$@"

fi