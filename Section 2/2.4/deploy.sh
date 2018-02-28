#!/usr/bin/env bash

#aws s3 mb s3://v24-bucket

aws cloudformation package \
   --template-file template.yaml \
   --output-template-file v24-stack.yaml \
   --s3-bucket v24-bucket

aws cloudformation deploy \
   --template-file v24-stack.yaml \
   --capabilities CAPABILITY_IAM \
   --stack-name v24-stack