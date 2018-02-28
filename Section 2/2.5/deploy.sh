#!/usr/bin/env bash

#aws s3 mb s3://v25-bucket

aws cloudformation package \
   --template-file template.yaml \
   --output-template-file v25-stack.yaml \
   --s3-bucket v25-bucket \

aws cloudformation deploy \
   --template-file v25-stack.yaml \
   --capabilities CAPABILITY_IAM \
   --stack-name v25-stack \
   --parameter-overrides 'NotificationEmail=francesco.lerro@gmail.com'
