#!/usr/bin/env bash

aws cloudformation package \
   --template-file template.yaml \
   --output-template-file v25-stack.yaml \
   --s3-bucket v25-bucket \

aws cloudformation deploy \
   --template-file v25-stack.yaml \
   --capabilities CAPABILITY_IAM \
   --stack-name v25-stack \
   --parameter-overrides 'NotificationEmail=noc@company.com'


# Setup

aws dynamodb put-item \
   --table-name "v25-stack-SitesHashes-1JZHD7C1NCFO1" \
   --item '{ "Site": {"S": "hackernews"},
             "Content": {"S": "placeholder"} }' \
    --return-consumed-capacity TOTAL

aws dynamodb get-item \
   --table-name "v25-stack-SitesHashes-1JZHD7C1NCFO1" \
   --key '{ "Site": {"S": "hackernews"} }'

aws lambda list-functions | grep v25

aws lambda invoke \
    --function-name v25-stack-VerifyUpdates-1AVGUGN0S2NM2 \
    output.txt && cat output.txt


# Clean-up

aws cloudformation delete-stack --stack-name=v25-stack

aws cloudformation describe-stack-events --stack-name v25-stack

