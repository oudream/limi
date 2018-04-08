
var obj1 = {}
var ary1 = []

function testMeta1() {
    console.log(typeof ary1)
    console.log(typeof obj1)
    var str = Object.prototype.toString.call(ary1);
    console.log(str);
    var str1 = new String('xasdf');
    var str2 = String(str1);
    console.log(typeof str1);
    console.log(typeof str2);
}
testMeta1();