
var str = 'http://expressjs.com/zh-cn/4x/api.html?eq=1&ee=2';

var simplePathRegExp = /^(\/\/?(?!\/)[^\?#\s]*)(\?[^#\s]*)?$/

var simplePath = typeof str === 'string' && simplePathRegExp.exec(str);

(function () {
// Construct simple URL
    if (simplePath) {
        var pathname = simplePath[1]
        var search = simplePath[2] || null

        var ss = search.substr(1);

        console.log(pathname);
        console.log(search);
        console.log(ss);
    }
})();
