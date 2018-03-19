/**
 * Created by oudream on 2017/1/6.
 */

"use strict";

var url = require("url");
var fs = require("fs");
var path = require("path");
var zlib = require("zlib");


exports = module.exports = Sql;

function Sql() {
    this.config =  {
        expires : {
            fileMatch: /^(gif|png|jpg|js|css)$/ig,
            maxAge: 60*60*24*365
        },

        compress : {
            match: /css|html/ig
        },

        assetsPath : process.cwd(),

        homePage : 'index.html',

        notFoundPage : 'error.html'

    };
};

Sql.mime = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
};

Sql.parseRange = function (str, size) {
    if (str.indexOf(",") != -1) {
        return;
    }

    var range = str.split("-"),
        start = parseInt(range[0], 10),
        end = parseInt(range[1], 10);

    // Case: -100
    if (isNaN(start)) {
        start = size - end;
        end = size - 1;
        // Case: 100-
    } else if (isNaN(end)) {
        end = size - 1;
    }

    // Invalid
    if (isNaN(start) || isNaN(end) || start > end || end > size) {
        return;
    }

    return {start: start, end: end};
}

Sql.prototype.dispatch = function (request, response) {
    var config = this.config;

    response.setHeader("Server", "HttpSql-Node");
    var pathname = url.parse(request.url).pathname;
    if (pathname.slice(-1) === "/") {
        pathname = pathname + config.homePage;
    }
    var realPath = path.join(config.assetsPath, path.normalize(pathname.replace(/\.\./g, "")));

    var pathHandle = function (realPath) {
        fs.stat(realPath, function (err, stats) {
            if (err) {
                response.writeHead(404, "Not Found", {'Content-Type': 'text/plain'});
                response.write("This request URL " + pathname + " was not found on this server.");
                response.end();
            } else {
                if (stats.isDirectory()) {
                    realPath = path.join(realPath, "/", config.homePage);
                    pathHandle(realPath);
                } else {
                    var ext = path.extname(realPath);
                    ext = ext ? ext.slice(1) : 'unknown';
                    var contentType = Sql.mime[ext] || "text/plain";
                    response.setHeader("Content-Type", contentType);
                    //response.setHeader('Content-Length', stats.size);

                    var lastModified = stats.mtime.toUTCString();
                    var ifModifiedSince = "If-Modified-Since".toLowerCase();
                    response.setHeader("Last-Modified", lastModified);

                    if (ext.match(config.expires.fileMatch)) {
                        var expires = new Date();
                        expires.setTime(expires.getTime() + config.expires.maxAge * 1000);
                        response.setHeader("Expires", expires.toUTCString());
                        response.setHeader("Cache-Control", "max-age=" + config.expires.maxAge);
                    }

                    if (request.headers[ifModifiedSince] && lastModified == request.headers[ifModifiedSince]) {
                        response.writeHead(304, "Not Modified");
                        response.end();
                    } else {
                        var compressHandle = function (raw, statusCode, reasonPhrase) {
                            var stream = raw;
                            var acceptEncoding = request.headers['accept-encoding'] || "";
                            var matched = ext.match(config.compress.match);

                            if (matched && acceptEncoding.match(/\bgzip\b/)) {
                                response.setHeader("Content-Encoding", "gzip");
                                stream = raw.pipe(zlib.createGzip());
                            } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
                                response.setHeader("Content-Encoding", "deflate");
                                stream = raw.pipe(zlib.createDeflate());
                            }
                            response.writeHead(statusCode, reasonPhrase);
                            stream.pipe(response);
                        };

                        if (request.headers["range"]) {
                            var range = Sql.parseRange(request.headers["range"], stats.size);
                            if (range) {
                                response.setHeader("Content-Range", "bytes " + range.start + "-" + range.end + "/" + stats.size);
                                response.setHeader("Content-Length", (range.end - range.start + 1));
                                var raw = fs.createReadStream(realPath, {"start": range.start, "end": range.end});
                                compressHandle(raw, 206);
                            } else {
                                response.removeHeader("Content-Length");
                                response.writeHead(416);
                                response.end();
                            }
                        } else {
                            var raw = fs.createReadStream(realPath);
                            compressHandle(raw, 200);
                        }
                    }
                }
            }
        });
    };

    pathHandle(realPath);
};
