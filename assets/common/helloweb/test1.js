
require("./../cjs/cjmeta")

var assert = require("assert"),
    sprintfjs = require('./../3rd/sprintf-1.0.3'),
    sprintf = sprintfjs.sprintf,
    vsprintf = sprintfjs.vsprintf



"use strict";

var test1 = function () {
    var pi = 3.141592653589793;
    var a = sprintf("%.6g", pi);
    console.log(a);
};
//test1();

var test2 = function () {
    var objectTypeRegexp = /^\[object (.*)\]$/;

    function getType(obj) {
        var type = Object.prototype.toString.call(obj).match(objectTypeRegexp)[1].toLowerCase();
        // Let "new String('')" return 'object'
        if (typeof Promise === 'function' && obj instanceof Promise) return 'promise';
        // PhantomJS has type "DOMWindow" for null
        if (obj === null) return 'null';
        // PhantomJS has type "DOMWindow" for undefined
        if (obj === undefined) return 'undefined';
        return type;
    }

    var dt = new Date(Date.now);

    var Args = {};
    Args.prototype = new Array();

    console.log(getType(dt));

    function Graph() {
        this.vertexes = [];
        this.edges = [];
        this.show = function () {
            console.log('graph');
        };
    }

    Graph.prototype = {
        addVertex: function(v){
            this.vertexes.push(v);
        }
    };

    Graph.prototype.show2 = function () {
        console.log(this.vertexes.length);
    };

    var ga = new Graph();
    ga.show();
    ga.show2();

    console.log(getType(ga));

    function Graph2() {

    };

    Graph2.prototype = new Graph();

    var ga2 = new Graph2();
    ga2.show();
    ga2.show2();

    console.log(getType(ga2));

};
//test2();

var test3 = function test3() {
    var a = null;
    var b = undefined;
    var c = '';
    var d = false;
    var e = 0;
    console.log( a == b );
    console.log( a == c );
    console.log( a == d );
    console.log( a == e );
};
//test3();

var test4 = function test4() {

    var obj1 = JSON.parse('{"1": 1, "2": 2,"3": {"4": 41, "5": {"6": 6}}}', function (k, v) {
        console.log(v); // 输出当前的属性名，从而得知遍历顺序是从内向外的，
                        // 最后一个属性名会是个空字符串。
        return v;       // 返回原始属性值，相当于没有传递 reviver 参数。
    });
     var obj2 = JSON.parse('{"1": 1, "2": 2,"3": {"4": 4, "5": {"6": 61}}}', function (k, v) {
        console.log(v); // 输出当前的属性名，从而得知遍历顺序是从内向外的，
                        // 最后一个属性名会是个空字符串。
        return v;       // 返回原始属性值，相当于没有传递 reviver 参数。
    });

    cjs.CjMeta.merge(obj1, obj2);




};
//test4();

var test5 = function test5() {
    var getType = cjs.CjMeta.getType;
    var obj = {};
    var dtNow1 = Date.now();
    for (var i = 0; i < 1000 * 1000; i++) {
        var type = getType(obj);
    }
    var dtNow2 = Date.now();
    for (var i = 0; i < 1000 * 1000; i++) {
        var type = cjs.CjMeta.getType(obj);
    }
    var dtNow3 = Date.now();

    console.log("1st: ", dtNow2-dtNow1, "2nd: ", dtNow3-dtNow2)
};
test5();
