/**
 * Created by liuchaoyu on 2016-11-15.
 *
 * cj-string.js
 *
 */

(function() {
    window.cjString = {};

    let cjString = window.cjString;

    cjString.format = function() {
        let argsCount = arguments.length;
        if (argsCount == 0) return null;

        let str = arguments[0];
        let argus = arguments;

        for (var i = 1; i < argsCount; i++) {
            str = str.replace(('%' + i).toString(),
                function() {
                    return argus[i];
                }
            );
        }

        return str;
    };

    cjString.isContain = function(str, subStr) {
        if (str == undefined || subStr == undefined || str == '' || subStr == '' || typeof str !== 'string') return null;

        if (typeof subStr === 'object' && subStr.length && subStr.length > 0) {
            for (let i = 0; i < subStr.length; i++) {
                let r = str.indexOf(subStr[i]);
                if (r > -1) {
                    return r;
                }
            }

            return -1;
        } else if (typeof subStr === 'object' && subStr.length && subStr.length == 0) {
            return null;
        }

        return str.indexOf(subStr);
    };
})();
