const assert = require('assert');
const http = require('http');

const server = http.createServer();

var connections = {};

server.on('request', function(req, res) {
    var msg = "step request " + Date();
    console.log(msg);
    res.end(msg);
});

server.on('checkContinue', function(req, res) {
    var msg = "step checkContinue" + Date();
    res.writeContinue();
    console.log(msg);
});

server.on('clientError', (err, socket) => {
    var msg = "step clientError" + Date();
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    console.log(msg);
});

server.on('close', function() {
    var msg = "step close" + Date();
    console.log(msg);
});

server.on('connect', function(req, socket, firstBodyChunk) {
    var msg = "step connect" + Date();
    console.log(msg);
});

server.on('connection', function(connection) {
    var msg = "step connection" + Date();
    console.log(msg);
});

server.on('upgrade', function(req, socket, head) {
    var msg = "step upgrade" + Date();
    console.log(msg);
});

server.listen(9901);