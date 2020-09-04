'use strict';

const express = require('express');
var bodyParser = require('body-parser')

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

var userArray = [];

// App
const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/random-user', (req, res) => {
    // Get Random User
    
    var randomUserIndex = Math.floor(Math.random()*userArray.length);
    res.status(200).json({"index": randomUserIndex, "user": userArray[randomUserIndex]});
});

app.get('/user', (req, res) => {
    // Get all user 
    res.status(200).json({"users": userArray});
})

app.post('/user', (req, res) => {
    // Add User
    if (req.body.name == null)
    {
        res.status(400).json({"message": "variable name not included in json "});
        return;
    }
    userArray.push(req.body.name);
    res.status(200).json({"message": `user ${req.body.name} added`});
    
});

app.put('/user/:index', (req, res) => {
    // Edit User
    var index = req.params.index;
    if (req.body.name == null)
    {
        res.status(400).json({"message": "variable name not included in json "});
        return;
    }
    if (index < 0 || index > (userArray.length-1)) {
        res.status(400).json({"message": "invalid index provided"});
        return;
    }
    var prevName = userArray[index];
    userArray[index] = req.body.name;
    res.status(200).json({"message": `user ${index} name is changed from ${prevName} to ${req.body.name}`});
});

app.delete('/user/:index', (req, res) => {
    // Delete User
    var index = req.params.index;
    if (index < 0 || index > (userArray.length-1)) {
        res.status(400).json({"message": "invalid index provided"});
        return;
    }
    var prevName = userArray[index];
    userArray.splice(index,1);
    res.status(200).json({"message": `user ${index}, ${prevName} has been removed`});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

process.on('SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    // some other closing procedures go here
    process.exit(1);
});