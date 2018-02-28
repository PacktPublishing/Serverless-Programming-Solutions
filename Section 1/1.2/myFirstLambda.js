

exports.myHandler = function(event, context, callback) {    // <-- handler: Entry point

    // Input Params:
    //
    // - event: Event input data, eg. {"key1": "value1", "key2": "value2"}

    console.log('value1 =', event.key1);
    console.log('value2 =', event.key2);


    // - context: runtime information about current execution and env

    console.log('remaining time =', context.getRemainingTimeInMillis());
    console.log('functionName =', context.functionName);
    console.log('AWSrequestID =', context.awsRequestId);
    console.log('logGroupName =', context.logGroupName);
    console.log('logStreamName =', context.logStreamName);
    console.log('clientContext =', context.clientContext);
    if (typeof context.identity !== 'undefined') {
        console.log('Cognito identity ID =', context.identity.cognitoIdentityId);
    }


    // - callback: (optional) return information to caller

    callback(null, "Successful invocation");

    // or, in case of error
    //
    // callback("Error message");
}