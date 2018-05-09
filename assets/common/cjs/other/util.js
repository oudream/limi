(function(define, $) {
    let fn = function($, MD5, $cookie) {
        let util = {
      // 防止某个函数在短时间内被密集调用
      // fn:要调用的函数,delay:时间限制
      // 例如:window.onresize = debounce(resizeFn, 500);
            debounce: function(fn, delay) {
                let timer = null; // 声明计时器
                return function() {
                    let context = this;
                    let args = arguments;
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        fn.apply(context, args);
                    }, delay);
                };
            },

            log: function(txt) {
        // window.console && console.log && console.log(window.location.pathname, txt)
            },

            md5: MD5,

            GetQueryString: function(name) {
                let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
                let r = window.location.search.substr(1).match(reg);
                if (r != null) {
                    return unescape(r[2]);
                }
                return;
            },

            cookie: $cookie,
            dateFormat: function(_date, format) {
                let o = {
                    'M+': _date.getMonth() + 1, // month
                    'd+': _date.getDate(), // day
                    'h+': _date.getHours(), // hour
                    'm+': _date.getMinutes(), // minute
                    's+': _date.getSeconds(), // second
                    'q+': Math.floor((_date.getMonth() + 3) / 3), // quarter
                    'S': _date.getMilliseconds(), // millisecond
                };

                if (/(y+)/.test(format)) {
                    format = format.replace(RegExp.$1, (_date.getFullYear() + '').substr(4 - RegExp.$1.length));
                }

                for (let k in o) {
                    if (new RegExp('(' + k + ')').test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
                    }
                }
                return format;
            },
        };
        return util;
    };

    define(['jquery', 'MD5', 'jquery.cookie'], fn);
})(define);
