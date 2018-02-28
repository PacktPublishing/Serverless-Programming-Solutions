#!/usr/bin/env bash

aws s3 mb s3://v22-bucket

aws cloudformation package \
   --template-file template.yaml \
   --output-template-file v22-stack.yaml \
   --s3-bucket v22-bucket

aws cloudformation deploy \
   --template-file v22-stack.yaml \
   --capabilities CAPABILITY_IAM \
   --stack-name v22-stack

aws lambda invoke \
    --invocation-type RequestResponse \
    --function-name v22-stack-PrintMyNameFunction-RTCI249N09W7 \
    --region eu-central-1 \
    output.txt
