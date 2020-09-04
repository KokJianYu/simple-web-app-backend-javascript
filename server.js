'use strict';

const express = require('express');
var bodyParser = require('body-parser')

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

//Idea: Message in the cloud
// Post their message online, wait till a random guy pulls it.

var messageArray = [];

// App
const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/random-message', (req, res) => {
    // Get Random message
    
    var randomIndex = Math.floor(Math.random()*messageArray.length);
    res.status(200).json({"index": randomIndex, "message": messageArray[randomIndex]});
});

app.get('/message', (req, res) => {
    // Get all messages 
    res.status(200).json({"messages": messageArray});
})

app.post('/message', (req, res) => {
    // Add message
    if (req.body.message == null)
    {
        res.status(400).json({"info": "variable message not included in json "});
        return;
    }
    messageArray.push(req.body.message);
    res.status(200).json({"info": `message ${req.body.message} added`});
    
});

app.put('/message/:index', (req, res) => {
    // Edit posted message if you have index.
    var index = req.params.index;
    if (req.body.message == null)
    {
        res.status(400).json({"info": "variable message not included in json "});
        return;
    }
    if (index < 0 || index > (messageArray.length-1)) {
        res.status(400).json({"info": "invalid index provided"});
        return;
    }
    var prevMessage = messageArray[index];
    messageArray[index] = req.body.message;
    res.status(200).json({"info": `message ${index} is changed from ${prevMessage} to ${req.body.message}`});
});

app.delete('/message/:index', (req, res) => {
    // Delete message if you have index
    var index = req.params.index;
    if (index < 0 || index > (messageArray.length-1)) {
        res.status(400).json({"info": "invalid index provided"});
        return;
    }
    var prevMessage = messageArray[index];
    messageArray.splice(index,1);
    res.status(200).json({"info": `message ${index}, ${prevMessage} has been removed`});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

process.on('SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    // some other closing procedures go here
    process.exit(1);
});