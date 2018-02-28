

exports.handler = (event, context, callback) => {

    const sourceBucket = event.Records[0].s3.bucket.name;
    const objectName = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    
    console.log(`Received event from ${sourceBucket}/${objectName} ...`);

    callback(null,'Done!')
}