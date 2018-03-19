
var test1 = function () {

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

    server.listen(9000);
};
test1();

var test2 = function () {

    function Results() {
        return function(req, res, next) {
            [
                'ok',
                'created',
                'noContent',
                'movedPermanently',
                'moveTemporarily',
                'badRequest',
                'forbidden',
                'unauthorized',
                'notFound',
                'internalServerError',
            ].forEach(function(name) {
                Object.defineProperty(res, name, {
                    configurable: true,
                    enumerable: false,
                    writable: true,
                    value : _result(name)
                });
            })
            next();
        }
    }

    function _result(name) {
        return function(content) {
            let statusCode;
            switch(name) {
                case 'ok' : statusCode = 200;
                    break;
                case 'created' : statusCode = 201;
                    break;
                case 'noContent' : statusCode = 204;
                    break;
                case 'badRequest' : statusCode = 400;
                    break;
                case 'unauthorized' : statusCode = 401;
                    break;
                case 'forbidden' : statusCode = 403;
                    break;
                case 'notFound' : statusCode = 404;
                    break;
                case 'internalServerError' : statusCode = 500;
                    break;
                default : statusCode = 200;
            }

            if (name == 'movedPermanently') {
                this.redirect(301, content);
            } else if (name == 'moveTemporarily') {
                this.redirect(content);
            } else {
                this.status(statusCode);
                this.send(_body.call(this, content));
            }
        }
    }


    function _body(content) {
        if (content == null && this.statusCode == 204) {
            this.removeHeader('Content-Type');
            this.removeHeader('Content-Length');
            this.removeHeader('Transfer-Encoding');
        }
        return content;
    }

    module.exports = Results;
}

var test3 = function () {
    var assert = require('assert');
    var fs = require('fs');
    var path = require('path');
    var http = require('http');

    var server = http.createServer( function(req, res) {
        var realFilePath = path.normalize(path.join(process.cwd(), '../index.html'));
        fs.stat(realFilePath, function (err, stats) {
            var raw = fs.createReadStream(realFilePath);
            raw.pipe(res);
        });
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
    console.log('http server listen 9901');
};

var test4 = function () {
    "use strict";

    var assert = require('assert');
    var fs = require('fs');
    var path = require('path');
    var http = require('http');
    require('./../cjhttp')

    var runServer = function () {
        var server = http.createServer( function(req, res) {
            console.log(`urlToObject: ${JSON.stringify(cjs.CjHttp.urlToObject(req.url))}`);
            var realFilePath = path.normalize(path.join(process.cwd(), '../index.html'));
            fs.stat(realFilePath, function (err, stats) {
                var raw = fs.createReadStream(realFilePath);
                raw.pipe(res);
            });
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
        console.log('http server listen 9901');
    };

    var runClient = function () {
        var postData = JSON.stringify({
            'msg' : 'Hello World!'
        });

        var options = {
            hostname: '127.0.0.1',
            port: 9901,
            path: '/course/introduction/1002916005.htm?utm_source=163.com&utm_medium=web_studycolumn&utm_campai',
            //path: '/index.html?page=12',
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        var req = http.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        });

        req.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
        });

        req.write(postData);
        req.end();
    }

    runServer();

    setTimeout(runClient, 1000, 1000);
};
//test4();

var test5 = function () {
    "use strict";

    var http = require('http');
    var fs = require('fs');

    var postData = JSON.stringify({
        'msg' : 'Hello World!'
    });

    var options = {
        //hostname: '127.0.0.1',
        hostname: 'news.163.com',
        port: 80,
        path: '17/0106/22/CA4N89GV000189FH.html',
        method: 'get',
        //headers: {
        //    'Content-Type': 'application/x-www-form-urlencoded',
        //    'Content-Length': Buffer.byteLength(postData)
        //}
    };

    var req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            fs.writeFile('f:\\message.txt', `BODY: ${chunk}`, (err) => {
                if (err) throw err;
                console.log('It\'s saved!');
            });
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });

    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });

// write data to request body
    req.write(postData);
    req.end();
};
//test5();