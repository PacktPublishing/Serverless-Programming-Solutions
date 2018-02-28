
exports.handler = function(event, context, callback) {
    var me = process.env.AWS_LAMBDA_FUNCTION_NAME;
    callback(null, "Deployed with AWS SAM: " + me);
}
