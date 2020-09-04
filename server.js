'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/user/random', (req, res) => {
    // Get Random User
    res.send('Get');
});

app.post('/user', (req, res) => {
    // Add User
    res.send('Post');
});

app.put('/user', (req, res) => {
    // Update User
    res.send('Put');
});

app.delete('/user', (req, res) => {
    // Delete User
    res.send('Delete');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

process.on('SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    // some other closing procedures go here
    process.exit(1);
});