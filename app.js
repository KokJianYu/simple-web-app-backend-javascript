'use strict';
const express = require('express');
var uuid = require('uuid')
var bodyParser = require('body-parser')
var cors = require('cors');
// Constants
const table = "FlashCards"
//Idea: Flash cards

var docClient; 
function set_dynamo_db(dclient) {
    docClient = dclient;
}

// App
const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: "*",
    allowedHeaders: "access-control-allow-origin"
}));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/flashCard', async (req, res) => {

    var flashCards = [];

    var params = {
        TableName: table,
        ProjectionExpression: "id, front, behind"
    }
    
    console.log("Scanning FlashCards table.");
    await docClient.scan(params, onScan).promise();
    
    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            // print all the movies
            console.log("Scan succeeded.");
            data.Items.forEach(function(flashcard) {
               console.log(
                flashcard.front + ": ",
                flashcard.behind);
                flashCards.push([flashcard.id, flashcard.front, flashcard.behind])
            });
    
            // continue scanning if we have more movies, because
            // scan can retrieve a maximum of 1MB of data
            if (typeof data.LastEvaluatedKey != "undefined") {
                console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            }
        }
    }


    // Get all flashCards 
    res.status(200).json({"flashcards": flashCards});
})

app.post('/flashCard', async (req, res) => {
    // Add flashCard
    if (req.body.front == null && req.body.behind == null)
    {
        res.status(400).json({"info": "variable `front` or `behind` not included in json "});
        return;
    }
    var flashCard = [req.body.front, req.body.behind];
    var params = {
        TableName: table,
        Item: {
            "id": uuid.v4(),
            "front": req.body.front,
            "behind": req.body.behind
        }
    }
    var itemAdded;
    await docClient.put(params, function(err, data) {
        if (err) {
            itemAdded = false;
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            itemAdded = true;
        }
    }).promise();

    console.log(itemAdded)
    if (itemAdded) {
        res.status(200).json({"info": `flashCard ${flashCard} added`});
    } else {
        res.status(500).json({"info": `Unable to add flashcard to db`});
    }
    
});

app.put('/flashCard', async (req, res) => {
    if (req.body.id == null, req.body.front == null && req.body.behind == null)
    {
        res.status(400).json({"info": "variable `id`, `front` or `behind` not included in json "});
        return;
    }

    var params = {
        TableName:table,
        Key:{
            "id": req.body.id,
        },
        UpdateExpression: "set front = :f, behind=:b",
        ExpressionAttributeValues:{
            ":f":req.body.front,
            ":b":req.body.behind
        },
        ReturnValues:"UPDATED_NEW"
    };
    
    var itemUpdated;
    console.log("Updating the item...");
    await docClient.update(params, function(err, data) {
        if (err) {
            itemUpdated = false;
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            itemUpdated = true;
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
        }
    }).promise();

    if (itemUpdated) {
        res.status(200).json({"info": `flashCard ${req.body.id} modified`});
    } else {
        res.status(500).json({"info": `Unable to update flashcard in DB.`});
    }
});

app.delete('/flashCard', async (req, res) => {
    // Delete flashCard if you have index
    if (req.body.id == null)
    {
        res.status(400).json({"info": "variable `id` not included in json "});
        return;
    }

    var params = {
        TableName:table,
        Key:{
            "id": req.body.id
        }
    };
    
    console.log("Attempting a conditional delete...");
    var isDeleted;
    await docClient.delete(params, function(err, data) {
        if (err) {
            isDeleted = false;
            console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            isDeleted = true;
            console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
        }
    }).promise();
    if (isDeleted) {
        res.status(200).json({"info": `flashCard ${req.body.id} has been removed`});
    } else {
        res.status(500).json({"info": `Unable to delete flashcard`});
    }
});

// // if (LOCAL) {
// app.listen(PORT, HOST);
// console.log(`Running on http://${HOST}:${PORT}`);
// // }
// // else {
// //     module.exports.handler = serverless(app)
// // }

module.exports.backend_api = app;
module.exports.set_dynamo_db = set_dynamo_db;

// process.on('SIGINT', function() {
//     console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
//     // some other closing procedures go here
//     process.exit(1);
// });