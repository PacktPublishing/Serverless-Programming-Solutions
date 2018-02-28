
const util = require('util');
const async = require('async');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

exports.handler = (event, context, callback) => {

    console.log("event object:\n", util.inspect(event, {depth: 5}));

    const sourceBucket = event.Records[0].s3.bucket.name;
    const objectName = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    const destBucket = process.env.BACKUP_BUCKET;
    
    console.log(`Duplicating ${sourceBucket}/${objectName} to ${destBucket}/${objectName} ...`);

    if (sourceBucket == destBucket) {
        callback("ERROR: Source and destination buckets are the same.");
        return;
    }

    const downloadFromSrcBucket = (next) => {
        console.log('Downloading...');
        s3.getObject({
                Bucket: sourceBucket,
                Key: objectName
            }, 
            next);
    };

    const uploadToDestBucket = (response, next) => {
        console.log('Uploading...');
        console.log("response object:\n", util.inspect(response, {depth: 5}));
        s3.putObject({
                Body: response.Body,
                Bucket: destBucket,
                Key: objectName
            },
            next);
    };
    
    async.waterfall([ downloadFromSrcBucket, uploadToDestBucket ],
        (err) => {
            if (err) {
                console.log('Error', err);
                callback(`Unable to upload ${objectName} to ${destBucket}`);
            } else {
                callback(null, `Uploaded ${objectName} to ${destBucket}`);
            }
        }
    );

};
