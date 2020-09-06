'use strict';

const express = require('express');
var bodyParser = require('body-parser')

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const LOCAL = true;

//Idea: Spanish Flash cards


var flashCardArray = [];

// App
const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/random-flashCard', (req, res) => {
    // Get Random flashCard
    
    var randomIndex = Math.floor(Math.random()*flashCardArray.length);
    var msg = flashCardArray.splice(randomIndex, 1);
    res.status(200).json({"index": randomIndex, "flashCard": msg});
});

app.get('/flashCard', (req, res) => {
    // Get all flashCards 
    res.status(200).json({"flashcards": flashCardArray});
})

app.post('/flashCard', (req, res) => {
    // Add flashCard
    if (req.body.spanish == null && req.body.english == null)
    {
        res.status(400).json({"info": "variable `spanish` or `english` not included in json "});
        return;
    }
    var flashCard = [req.body.spanish, req.body.english];
    flashCardArray.push(flashCard);
    res.status(200).json({"info": `flashCard ${flashCard} added`});
    
});

app.put('/flashCard/:index', (req, res) => {
    // Edit posted flashCard if you have index.
    var index = req.params.index;
    if (req.body.spanish == null && req.body.english == null)
    {
        res.status(400).json({"info": "variable `spanish` or `english` not included in json "});
        return;
    }
    if (index < 0 || index > (flashCardArray.length-1)) {
        res.status(400).json({"info": "invalid index provided"});
        return;
    }
    var prevFlashCard = flashCardArray[index];
    flashCardArray[index][0] = req.body.spanish;
    flashCardArray[index][1] = req.body.english;
    res.status(200).json({"info": `flashCard ${index} is changed to ${flashCardArray[index]}`});
});

app.delete('/flashCard/:index', (req, res) => {
    // Delete flashCard if you have index
    var index = req.params.index;
    if (index < 0 || index > (flashCardArray.length-1)) {
        res.status(400).json({"info": "invalid index provided"});
        return;
    }
    var prevFlashCard = flashCardArray[index];
    flashCardArray.splice(index,1);
    res.status(200).json({"info": `flashCard ${index} has been removed`});
});

// // if (LOCAL) {
// app.listen(PORT, HOST);
// console.log(`Running on http://${HOST}:${PORT}`);
// // }
// // else {
// //     module.exports.handler = serverless(app)
// // }

module.exports = app;

// process.on('SIGINT', function() {
//     console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
//     // some other closing procedures go here
//     process.exit(1);
// });