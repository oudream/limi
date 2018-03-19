var assert = require('assert')

var immediateThis, intervalThis, timeoutThis;
var immediateArgsThis, intervalArgsThis, timeoutArgsThis;

var iTimes = 0;

var immediateHandler = setImmediate(function() {
    console.log('setImmediate');
    immediateThis = this;
});

var immediateArgsHandler = setImmediate(function() {
    console.log('setImmediate args');
    immediateArgsThis = this;
}, 'args ...');

var intervalHandler = setInterval(function() {
    //clearInterval(intervalHandler);
    console.log('setInterval', iTimes++);
    intervalThis = this;
}, 1000);

var intervalArgsHandler = setInterval(function() {
    //clearInterval(intervalArgsHandler);
    console.log('setInterval args', iTimes++);
    intervalArgsThis = this;
}, 1000, 'args ...');

var timeoutHandler = setTimeout(function() {
    console.log('setTimeout');
    timeoutThis = this;
}, 1000);

var timeoutArgsHandler = setTimeout(function() {
    console.log('setTimeout args');
    timeoutArgsThis = this;
}, 1000, 'args ...');

process.once('exit', function() {
    assert.strictEqual(immediateThis, immediateHandler);
    assert.strictEqual(immediateArgsThis, immediateArgsHandler);

    assert.strictEqual(intervalThis, intervalHandler);
    assert.strictEqual(intervalArgsThis, intervalArgsHandler);

    assert.strictEqual(timeoutThis, timeoutHandler);
    assert.strictEqual(timeoutArgsThis, timeoutArgsHandler);
});