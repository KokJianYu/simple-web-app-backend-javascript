var app = require("./app.js");
var AWS = require("aws-sdk");
// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// AWS.config.update({
//     endpoint: "http://dynamodb-local:8000"
// });

var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();
app.set_dynamo_db(docClient);

var params = {
    TableName : "FlashCards",
    KeySchema: [       
        { AttributeName: "id", KeyType: "HASH"}, //Partition key
    ],
    AttributeDefinitions: [       
        { AttributeName: "id", AttributeType: "S" },
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 5, 
        WriteCapacityUnits: 5
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});

app.backend_api.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

process.on('SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    // some other closing procedures go here
    process.exit(1);
});