

exports.handler = (event, context, callback) => {

    event.Records.forEach((record) => {        
        if (record.eventName === 'INSERT') {
            var what = JSON.stringify(record.dynamodb.NewImage.Message.S);
            console.log(`New message: ${what}`);
        }
    });
    
};
