var assert = require('assert');
var path = require('path');
var http = require('http');

require('./../cjs/cjinterinfo');
require('./../cjs/cjstring');

var Route = require('./../cjs/nodejs/cjhttp_route');
var FileServer = require('./../cjs/nodejs/cjhttp_file_server');

var route = new Route();
var fileServer = new FileServer();
fileServer.config.assetsPath = path.normalize(path.join(process.cwd(), '..'));

var server = http.createServer( function(req, res) {
    if (! route.handle(req, res, function( ) {
        console.log(arguments)
    })) {
        fileServer.dispatch(req, res);
    }
});

route.get(/\/(.){0,}.cgi/, function (req, res) {
    res.end('Hello World!');
});

route.get(/\/(.){0,}.sql/, function (req, res) {


    var mysql = require('mysql');
    var pool  = mysql.createPool({
        connectionLimit : 10,
        //host            : '10.31.16.253',
        host            : '127.0.0.1',
        user            : 'ygct',
        password        : 'ygct',
        database        : 'db1'
    });

    pool.query('select * from table1', function(err, rows, fields) {
        if (err) throw err;

        console.log(JSON.stringify(rows));
    });

    res.end('Hello World!');
});

//server.on('request', function(req, res) {
//
//    var msg = "step request " + Date();
//    console.log(msg);
//    res.end(msg);
//});

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
cjs.debug('http server listen 9901');