
const util = require('util');
const crypto = require('crypto');
const AWS = require('aws-sdk');
const axios = require('axios');

const dynamodb = new AWS.DynamoDB();
const sns = new AWS.SNS();

const Promise = require('bluebird');
AWS.config.setPromisesDependency(require('bluebird'));

const calculateHash = (str) => crypto.createHash('md5').update(str).digest('hex');


exports.handler = (event, context, callback) => {

    const url = "https://news.ycombinator.com/newest";
    const key = 'hackernews';

    const sitesTable = process.env.SITES_TABLE;
    const notificationQueue = process.env.NOTIFICATION_QUEUE;

    const fetchSiteContent = (url) => {
        console.log(`Downloading url... ${url}`);
        return axios
                .get(url)
                .then(response => calculateHash(response.data))
    };

    const compareSiteContent = (siteContentHash) => {
        console.log(`Comparing hashes... New: ${siteContentHash}`);

        const params = {
            Key: {
                "Site": {
                    S: key
                }
            },
            ReturnConsumedCapacity: "TOTAL",
            TableName: sitesTable
        };

        return dynamodb
                .getItem(params)
                .promise()
                .then(data => {
                    // console.log("data:\n", util.inspect(data, {depth: 5}));

                    const prevContentHash = data.Item ? data.Item.Content.S : 'site never visited';
                    const siteUpdated = prevContentHash != siteContentHash;

                    console.log(`Old: ${prevContentHash}, New: ${siteContentHash}, Site updated? ${siteUpdated}`);

                    return {content: siteContentHash, updated: siteUpdated}
                })
    };

    const updateSiteContentHash = (site) => {
        console.log(`Updating hash... Key: ${key}`);

        const params = {
            Item: {
                "Site": {
                    S: key
                },
                "Content": {
                    S: site.content
                }
            },
            TableName: sitesTable
        };

        if (!site.updated) {
            console.log(`updateSiteContentHash NOOP, site content not changed`);
            return new Promise(resolve => resolve(false));
        }

        return dynamodb
            .putItem(params)
            .promise()
            .then(() => site.updated)
    };

    const notifyUpdates = (siteUpdated) => {
        
        if (!siteUpdated) {
            console.log(`notifyUpdated NOOP, site content not changed`);
            return new Promise(resolve => resolve(false));
        }

        console.log(`Notifying updates... Key: ${key}`);

        return sns
                .publish({
                    Message: `Visit: ${url}`,
                    Subject: `Site ${key} updated!`,
                    TopicArn: notificationQueue
                })
                .promise()
                .then(() => siteUpdated);
    };


    fetchSiteContent(url)
        .then(compareSiteContent)
        .then(updateSiteContentHash)
        .then(notifyUpdates)
        .then(siteUpdated => callback(null, `Site ${url} updated? ${siteUpdated}`))
        .catch(err => callback('' + err));

};