#!/bin/bash
PROJECT_PATH="/home/ubuntu/seo/gitrepos/IIDT-backend"

SERVICE_PID=`ps -ef | grep -ie "-p 3031"  | grep -v grep | awk '{print $2}'`
APPLICATION_NAME='ifs'

# 기존 폴더 삭제 후 재 생성 
rm -rf ${PROJECT_PATH}/bulid
mkdir ${PROJECT_PATH}/bulid

 # data 복사 
cp -r  /home/ubuntu/bulid/bulid  ${PROJECT_PATH}/bulid
    

cd ${PROJECT_PATH}

# docker script 실행 
./start.sh

echo
echo "==[${APPLICATION_NAME}] process start"

