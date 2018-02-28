#!/usr/bin/env bash

aws s3 mb s3://v24-bucket

aws cloudformation package \
   --template-file template.yaml \
   --output-template-file v24-stack.yaml \
   --s3-bucket v24-bucket

aws cloudformation deploy \
   --template-file v24-stack.yaml \
   --capabilities CAPABILITY_IAM \
   --stack-name v24-stack

# Test

aws s3 ls | grep v24-stack

aws s3 ls s3://v24-stack-srcbucket-1gunmxomkmc9w

aws s3 cp /tmp/image.png s3://v24-stack-srcbucket-1gunmxomkmc9w

aws s3 ls s3://v24-stack-srcbucket-1gunmxomkmc9w

aws s3 ls s3://v24-stack-destbucket-1nkok4h9mbcly

aws s3 ls s3://v24-stack-srcbucket-1gunmxomkmc9w

awslogs get /aws/lambda/v24-stack-CopyFile-7NUG9424IJLA


# Clean-up

aws logs describe-log-groups | grep v24

aws logs describe-log-streams \
    --log-kgroup="/aws/lambda/v24-stack-CopyFile-7NUG9424IJLA" \
    | grep logStreamName

aws logs get-log-events --output text \
    --log-group="/aws/lambda/v24-stack-CopyFile-7NUG9424IJLA" \
    --log-stream-name='2018/01/*' \

aws cloudformation delete-stack --stack-name=v24-stack

aws cloudformation describe-stack-events --stack-name v24-stack

