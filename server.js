var backend_api = require("./app.js");
const serverless = require('serverless-http');

module.exports.handler = serverless(backend_api)