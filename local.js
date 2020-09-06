var backend_api = require("./app.js");
// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const LOCAL = true;

backend_api.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

process.on('SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    // some other closing procedures go here
    process.exit(1);
});