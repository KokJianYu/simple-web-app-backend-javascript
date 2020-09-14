var app = require("./app.js");
var AWS = require("aws-sdk");
const serverless = require('serverless-http');

var docClient = new AWS.DynamoDB.DocumentClient();
app.set_dynamo_db(docClient);

var backend_api = app.backend_api;
module.exports.handler = serverless(backend_api)