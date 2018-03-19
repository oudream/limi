
var EventEmitter = require('events').EventEmitter;

var testEvent11 = function () {
//event.js 文件
    var event = new EventEmitter();
    var index = 0;
    event.on('some_event0', function() {
        console.log('some_event 1 事件触发');
    });
    event.on('some_event1', function() {
        console.log('some_event 2 事件触发');
    });
    event.on('some_event2', function() {
        console.log('some_event 3 事件触发');
    });
    setInterval(function() {
        index++;
        event.emit('some_event'+(index % 3.).toString());
    }, 1000);
};
testEvent11();