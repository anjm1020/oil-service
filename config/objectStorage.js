require("dotenv").config();
const AWS = require("aws-sdk");

AWS.config.update({
    region: process.env.S3_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET
});

const S3 = new AWS.S3();

module.exports = S3;
