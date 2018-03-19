
'use strict'

require('./../cjs/cjinterinfo')
require('./../cjs/cjstring')

var Route = require('./../cjs/nodejs/cjhttp_route')
var FileServer = require('./../cjs/nodejs/cjhttp_file_server')
var path = require('path')
var http = require('http')

exports = module.exports = HttpServer

function HttpServer (confParams) {
  this.route = new Route()
  this.fileServer = new FileServer()
    // this.fileServer.config.assetsPath = path.normalize(path.join(process.cwd(), '..'));
    // this.fileServer.config.assetsPath = path.normalize(path.join(__dirname, './../..'));
  this.fileServer.config.assetsPath = path.normalize(confParams.staticAssetsPath)

  var _this = this
  this.server = http.createServer(function (req, res) {
    var ret = _this.route.handle(req, res, function () {
      console.log(arguments)
    })

    if (!ret) {
      _this.fileServer.dispatch(req, res)
    }
  })

    // this.route.all(/\/(.){0,}.cgi/, function (req, res) {
    //    res.end('Hello World!');
    // });

    // this.route.all(/^\/upload/, function (req, res) {
    //    var form = new formidable.IncomingForm(),
    //        files = [],
    //        fields = [];
    //
    //    form.uploadDir = os.tmpdir();
    //
    //    form
    //        .on('field', function(field, value) {
    //            console.log(field, value);
    //            fields.push([field, value]);
    //        })
    //        .on('file', function(field, file) {
    //            console.log(field, file);
    //            files.push([field, file]);
    //        })
    //        .on('end', function() {
    //            console.log('-> upload done');
    //            res.writeHead(200, {'content-type': 'text/plain'});
    //            res.write('received fields:\n\n '+util.inspect(fields));
    //            res.write('\n\n');
    //            res.end('received files:\n\n '+util.inspect(files));
    //        });
    //    form.parse(req);
    // });

    // this.route.all(/\/(.){0,}.sql/, function (req, res) {
    //
    //
    //     // 定义了一个data变量，用于暂存请求体的信息
    //     let data = '';
    //
    //     // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到data变量中
    //     req.on('data', function(chunk){
    //         data += chunk;
    //     });
    //
    //     // 在end事件触发后，解释请求体，取出sql语句，然后向客户端返回。
    //     req.on('end', function(){
    //         // data = querystring.parse(data);
    //         data = JSON.parse(data);
    //         console.log(data);
    //         res.writeHead(200, {'Content-Type': 'text/plain'});
    //         res.end();
    //     });
    //
    // });

  this.server.on('checkContinue', function (req, res) {
    var msg = 'step checkContinue' + Date()
    res.writeContinue()
    console.log(msg)
  })

  this.server.on('clientError', (err, socket) => {
    var msg = 'step clientError' + Date()
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
    console.log(msg)
  })

  this.server.on('close', function () {
    var msg = 'step close' + Date()
    console.log(msg)
  })

  this.server.on('connect', function (req, socket, firstBodyChunk) {
    var msg = 'step connect' + Date()
    console.log(msg)
  })

  this.server.on('connection', function (connection) {
    var msg = 'step connection' + Date()
    console.log(msg)
  })

  this.server.on('upgrade', function (req, socket, head) {
    var msg = 'step upgrade' + Date()
    console.log(msg)
  })

  this.server.listen(confParams.port)
  console.log('http this.server listen %s', confParams.port)
}
