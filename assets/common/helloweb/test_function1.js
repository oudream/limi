/**
 * Created by oudream on 2017/3/21.
 */

var testFunction1 = function () {

    var fun1 = function () {
        console.log(arguments.length);
    };

    var fun2 = function () {
        var args = Array.from(arguments);
        fun1(args);
        fun1(arguments);
        fun1.apply(this, arguments);
        // fun1.apply(this, args);
    };

    fun2(1, 2, 3, 4);

};
testFunction1();

let testFunction12 = function () {
    var fun1 = function () {
        console.log(arguments);
        console.log(a, b, c);
    };

    var fun2 = function () {
        fun1.apply(this, arguments);
    };

    fun2(1, 2, 3, 4);
};
// testFunction12()