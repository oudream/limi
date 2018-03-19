
'use strict';

var http = require("http");
require('./../cjinterinfo');
require('./../cjstring');

exports = module.exports = Route;

var toString = Object.prototype.toString;

function Route( ) {
    this.stack = [];
}

//[ 'get', 'post', 'put', 'head', 'delete' ]
Route.methods = function () {
    return http.METHODS && http.METHODS.map(function lowerCaseMethod(method) {
            return method.toLowerCase();
        });
}();
Route.methods.push("all");

Route.methods.forEach(function(method) {
    Route.prototype[method] = function(path, handle) {
        cjs.debug('Route %s %s', method, this.path);
        var layer = new Layer(method, path, handle);
        cjs.debug('Layer.isValid=', layer.isValid);
        //this.methods[method] = true;
        this.stack.push(layer);
        return layer.isValid;
    };
});

Route.prototype.handle = function handle(req, res, out) {
    cjs.debug('Route %s %s', req.method, req.url);

    var self = this;
    var stack = self.stack;
    var layer;
    var path = req.url;
    var method = req.method;
    var match = false;
    var idx = 0;
    while (match !== true && idx < stack.length) {
        layer = stack[idx++];
        match = layer.match(method, path);
        if (match)
            layer.handle_request(req, res, out);
    }
    return match;
};

function Layer(method, path, handle) {
    var regexp = typeof path === "string" ? new RegExp(path) : null;
    if (regexp === null && path instanceof RegExp) regexp = path;
    var bIsValid = typeof method === "string" && (typeof path === "string" || path instanceof RegExp) && typeof handle === "function";
    var bMethodIsAll = cjs.CjString.equalCase(method, "all");
    var bPathIsAll = path === "/";
    var sErrorMsg = bIsValid ? "" : 'method:' + toString.call(method);
    this.method = method;
    this.path = path;
    this.handle = handle;
    this.regexp = regexp ? regexp : new RegExp('');
    this.methodIsAll = bMethodIsAll;
    this.pathIsAll = bPathIsAll;
    this.errorMsg = sErrorMsg;
    this.isValid = bIsValid;
}

Layer.prototype.handle_request = function handle(req, res, out) {
    var fn = this.handle;

    if (fn.length > 2) {
        if (typeof out === "function") out('handle_request fn.length>2');
        return;
    }

    try {
        fn(req, res);
    } catch (err) {
        if (typeof out === "function") out(err);
    }

};

Layer.prototype.match = function match(method, path) {
    var bMethod = this.isValid && (this.methodIsAll || (typeof method === "string" && method.toLowerCase() === this.method));
    return bMethod && (this.pathIsAll || this.regexp.test(path));
};
