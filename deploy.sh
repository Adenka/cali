#!/bin/bash

build () {
    npm run build --prefix ./frontend
}

upload () {
    password=$(<password)
    plink -pw $password charodziej@s1.ct8.pl "cd ./domains/cali.ct8.pl/public_nodejs/cali &&
                                              rm -rf ./frontend/build ./backend" &&

    pscp -r -v -pw $password ./backend package.json charodziej@s1.ct8.pl:./domains/cali.ct8.pl/public_nodejs/cali &&
    pscp -r -v -pw $password ./frontend/build charodziej@s1.ct8.pl:./domains/cali.ct8.pl/public_nodejs/cali/frontend &&

    plink -pw $password charodziej@s1.ct8.pl "cd ./domains/cali.ct8.pl/public_nodejs/cali &&
                                              npm install &&
                                              devil www restart cali.ct8.pl"   
}

case $1 in
    build)
        build; date
        ;;
    upload)
        upload; date
        ;;
    full)
        build && upload; date
        ;;
    *)
        echo $"Usage $0 {build|upload|full}"
esac