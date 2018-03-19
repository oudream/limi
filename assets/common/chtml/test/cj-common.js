/**
 * Created by oudream on 2016/3/24.
 * Updated by liuchaoyu on 2016/10/28
 */
(function() {
    window.cjCommon = {};

    var cjCommon = window.cjCommon;

    //获取url中的参数
    cjCommon.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return decodeURI(r[2]);
        return null; //返回参数值
    }

    //获取本地时间
    //只要到分钟就可以了，new Date().toLocaleString().replace(/:\d{1,2}$/,' ');
    cjCommon.getLocalTime = function () {
        if( arguments.length == 0 )
            return new Date().toLocaleString();
        var iDt = parseInt(arguments[0]);
        if (iDt < 0x7FFFFFFF) iDt = iDt * 1000;
        return new Date(iDt).toLocaleString();
    }

    cjCommon.getServerInfo = function () {
        var protocol = window.location.protocol;
        var host = window.location.host;
        var port = window.location.port;

        return{
            'protocol': protocol,
            'host' : host,
            'port' : port
        }
    };

    String.format = function() {
        if( arguments.length == 0 )
            return null;
        var sSource = arguments[0];
        var args = arguments;
        var i = 0;
        var r = sSource.replace(/\{\d+\}/g,
            function(m){
                i++;
                return args[i];
            });
        return r;
    }

    cjCommon.findInArray = function(array,elem) {
        if( array == null || array == undefined) {
            return -2;
        }
        else if (array.length == 0) {
            return -1;
        }
        for( var i = 0; i < array.length; i++ ){
            if( elem == array[i] ){
                return i;
            }
        }

        return -1;
    };

    /**
     * 对象和数组复制
     * @param elem：对象或数组
     * @returns {*}
     */
    cjCommon.clone = function (elem) {
        if (elem && typeof elem === 'object') {
            if (elem.length) {

                var _elem = [];
                for (var i = 0; i < elem.length; i++) {
                    _elem[i] = elem[i];
                }

                return _elem;
            }
            else {

                var _elem = {};
                for (var attr in elem) {
                    _elem[attr] = elem[attr];
                }

                return _elem;
            }
        }

        return null;
    };

    /**
     * 判断对象是否有属性（或者指定属性）
     * @param obj：待判断对象
     * @param propertyName：特定属性，如不传入，将判断是否空对象
     * @returns {boolean}
     */
    cjCommon.hasProperty = function (obj,propertyName) {

        for (var attr in obj) {
            if (propertyName != undefined) {
                if (attr == propertyName) {
                    return true;
                }
            }
            else {
                return true;
            }
        }
        return false;
    };

    /**
     * 新建标签元素
     * @param tagName：标签名，input,button...
     * @param attrs：属性对象,{'id':'xx','className':'xxx'...}
     * @param parent：父标签对象
     * @returns {Element}：元素对象
     */
    cjCommon.createElement = function (tagName,attrs,parent) {
        var elem = document.createElement(tagName);
        var ret;

        for (var attr in attrs) {
            if (typeof(attrs[attr]) != "function") {
                elem[attr] = attrs[attr];
            }
        }

        /** 针对父对象是Dom对象 */
        if(parent && ((typeof HTMLElement==="object" && parent instanceof HTMLElement) || (parent.nodeType && parent.nodeType===1))){
            parent.appendChild(elem);
            ret = elem;
        }
        /** 针对父对象是jQuery对象 */
        else if (parent && parent.length && (typeof jQuery==="function" || typeof jQuery==="object") && parent instanceof jQuery){
            ret = $(elem);
            parent.append(ret);
        }
        else if (parent == undefined || parent == null) {
            ret = elem;
        }

        return ret;
    }

    /**
     * 获取元素所有属性
     * @param elem: 元素
     * @returns {{}}: 属性对象
     */
    cjCommon.getAllAttrOfElem = function (elem) {

        var attrs = elem.attributes;
        var attrObj = {};
        var i;
        for (i = 0; i < attrs.length; i++) {
            var attr = attrs[i];
            attrObj[attr.nodeName] = attr.value;
        }

        return attrObj;
    }

    /**
     * 检测对象是否为空
     * @param obj: 对象
     * @returns {boolean}
     */
    cjCommon.isEmptyObject = function (obj) {
        var t;
        for (t in obj)
            return !1;
        return !0
    }

    /**
     * 由相对路径转换成绝对路径
     * @param url : 相对路径
     * @returns {*}
     */
    cjCommon.getAbsoluteUrl = function (url) {
        var a = document.createElement('a');
        a.href = url;  // 设置相对路径给Image, 此时会发送出请求
        url = a.href;  // 此时相对路径已经变成绝对路径
        a = null;

        return url;
    }

})()