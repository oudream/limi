'use strict';

var myFirstPromise = new Promise(function(resolve, reject){
  //当异步代码执行成功时，我们才会调用resolve(...), 当异步代码失败时就会调用reject(...)
  //在本例中，我们使用setTimeout(...)来模拟异步代码，实际编码时可能是XHR请求或是HTML5的一些API方法.
  // setTimeout(function(){
  //   resolve("成功!"); //代码正常执行！
  // }, 250);
  setTimeout(function(){
    reject("失败!"); //代码正常执行！
  }, 250);
});

myFirstPromise.then(function(successMessage){
  //successMessage的值是上面调用resolve(...)方法传入的值.
  //successMessage参数不一定非要是字符串类型，这里只是举个例子
  console.log("Yay! " + successMessage);
},function(successMessage){
  //successMessage的值是上面调用resolve(...)方法传入的值.
  //successMessage参数不一定非要是字符串类型，这里只是举个例子
  console.log("Oh! " + successMessage);
});

var p1 = Promise.resolve(3);
var p2 = 1337;
var p3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 1000, "foo");
});

Promise.all([p1, p2, p3]).then(values => {
  console.log('success:'+values); // [3, 1337, "foo"]
},values => {
  console.log('error:'+values); // [3, 1337, "foo"]
});