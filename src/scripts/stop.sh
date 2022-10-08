#!/bin/bash
PROJECT_PATH="/home/ubuntu/seo/gitrepos/IIDT-backend/"

SERVICE_PID=`ps -ef | grep -ie "-p 6060"  | grep -v grep | awk '{print $2}'`
APPLICATION_NAME='ifs'

if [ $SERVICE_PID ]; then
        echo
        echo "==[${APPLICATION_NAME}](${SERVICE_PID}) is already running..."
        echo
else
        # 기존 폴더 삭제 후 재 생성 
        rm -rf ${PROJECT_PATH}
        mkdir ${PROJECT_PATH}
        # data 복사 
        cp -r  /home/ubuntu/app/*  ${PROJECT_PATH}
        #cp -r `ls /home/ubuntu/app/|grep -v scripts | grep -v appspec.yml`${PROJECT_PATH}

        cd /home/ubuntu/seo/gitrepos/IIDT-front-end/
        
        # echo
        # echo "==[${APPLICATION_NAME}] process: yarn install"
        # yarn install

        echo
        echo "==[${APPLICATION_NAME}] process: yarn run start"
        nohup yarn start > /dev/null 2>&1 &

        sleep 1

        echo
        echo "==[${APPLICATION_NAME}] Started Service (${SERVICE_PID})"
        echo
fi