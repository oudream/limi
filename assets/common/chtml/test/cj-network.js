/**
 * Created by liuchaoyu on 2016-11-15.
 *
 * cj-network.js
 *
 */
// todo 需要优化代码，更加抽象类

$(function() {
    window.cjNetwork = {};

    let cjNetwork = window.cjNetwork;

    cjNetwork.sql = {};

    cjNetwork.file = {};

    let sessionIdCallFnMap = {};
    let sessionIdPrefixMap = {};

    /**
     *
     * @param prefix
     * @returns {string}
     */
    function getSessionId(prefix) {
        let idNum = 1;
        let maxIdNum = sessionIdPrefixMap[prefix];
        if (!maxIdNum) {
            sessionIdPrefixMap[prefix] = idNum;
        } else {
            idNum = maxIdNum + 1;
            sessionIdPrefixMap[prefix] = idNum;
        }

        return prefix + '_' + idNum.toString();
    }

    /**
     *
     * @param reqParams
     * {
     *      type,
     *      data,
     *      url,
     *      fncode,
     *      fn_callback
     * }
     */
    function request(reqParams) {
        let _sendData;
        let type = reqParams.type;
        let sessionId = getSessionId(type);

        if (type == 'sql') {
            let sql = reqParams.data.replace(/\"/g, '\\"');

            let sqlJson = {
                'sql': sql,
            };

            _sendData = JSON.stringify(sqlJson);
        } else if (type == 'file') {
            // var data = reqParams.data.replace(/\"/g,"\\\"");
            _sendData = reqParams.data;
        }

        let _urlParams = {};
        $.extend(_urlParams, reqParams.urlParams, {'sessionid': sessionId});

        sessionIdCallFnMap[sessionId] = reqParams.fn_receive;

        // cjAjax.request({sendData: _sendData, url:"ics.cgi", urlParams:{fncode:"req.sql."}, callback: fn_callback});
        cjAjax.request({'sendData': _sendData, 'url': reqParams.url, 'urlParams': _urlParams, 'callback': reqParams.fn_callback});
    }

    /**
     * 返回数据处理函数
     * @param retData : 返回数据
     * @returns {*}
     */
    function retDataProcess(retData) {
        retData = retData.replace(/\\'/g, '\'');

        let obj = JSON.parse(retData);
        return obj;
    }


    /**
     * 获取数据库数据
     * @param sqlParams : sql参数
     * {
     *      'sql':'',
     *      'url':'',
     * }
     * @param fn_receive : 返回数据接收函数
     */
    cjNetwork.sql.downloadData = function(sqlParams, fn_receive) {
        let reqParams = {
            'type': 'sql',
            'data': sqlParams.sql,
            'url': sqlParams.url,
            'urlParams': {
                'fncode': 'req.sql.',
            },
            'fn_callback': cjNetwork.sql.dataReturn,
            'fn_receive': fn_receive,
        };

        $.extend(reqParams.urlParams, sqlParams.urlParams);

        request.apply(this, [reqParams]);
    };

    /**
     * 上传数据库数据
     * @param sqlParams : sql参数
     * {
     *      'sql':'',
     *      'url':'',
     * }
     * @param fn_receive : 返回数据接收函数
     */
    cjNetwork.sql.uploadData = function(sqlParams, fn_receive) {
        let reqParams = {
            'type': 'sql',
            'data': sqlParams.sql,
            'url': sqlParams.url,
            'urlParams': {
                'fncode': 'req.sql.exec.onlyresult.',
            },
            'fn_callback': cjNetwork.sql.dataReturn,
            'fn_receive': fn_receive,
        };

        $.extend(reqParams.urlParams, sqlParams.urlParams);

        request.apply(this, [reqParams]);
    };

    /**
     * 数据返回
     * @param retData
     */
    cjNetwork.sql.dataReturn = function(retData) {
        let _data = retDataProcess(retData);

        let sessionId = _data.sessionid;
        let fn = sessionIdCallFnMap[sessionId];

        if (fn) {
            fn(_data.data);
        } else {
            console.log('sessionId:' + sessionId + ',fn 没有定义');
        }
    };

    /**
     * 上传文件数据
     * @param fileParams : 文件参数
     * {
     *      'filetype':'',
     *      'table':'',
     *      'id':'',
     *      'field':'',
     *      'fieldpath':'',
     *      'filepath':'',
     *      'data':''
     * }
     * @param fn_receive
     */
    cjNetwork.file.uploadData = function(fileParams, fn_receive) {
        let _urlParams = {
            'fncode': 'req.savefile.',
        };

        for (let t in fileParams) {
            if (t != 'data') {
                _urlParams[t] = fileParams[t];
            }
        }

        let reqParams = {
            'type': 'file',
            'data': fileParams.data,
            'url': 'ics.cgi',
            'urlParams': _urlParams,
            'fn_callback': cjNetwork.file.dataReturn,
            'fn_receive': fn_receive,
        };

        request.apply(this, [reqParams]);
    };

    cjNetwork.file.downloadData = function(fileParams, fn_receive) {
        let _urlParams = {
            'fncode': 'req.savefile.',
        };

        for (let t in fileParams) {
            if (t != 'data') {
                _urlParams[t] = fileParams[t];
            }
        }

        let reqParams = {
            'type': 'file',
            'data': fileParams.data,
            'url': 'ics.cgi',
            'urlParams': _urlParams,
            'fn_callback': cjNetwork.file.dataReturn,
            'fn_receive': fn_receive,
        };

        request.apply(this, [reqParams]);
    };

    cjNetwork.file.dataReturn = function(retData) {
        let _data = retDataProcess(retData);

        let sessionId = _data.sessionid;
        let fn = sessionIdCallFnMap[sessionId];

        if (fn) {
            fn(_data.data);
        } else {
            console.log('sessionId:' + sessionId + ',fn 没有定义');
        }
    };

    cjNetwork.downFile = function(params) {
        let url = params.url;
        let isCache = params.isCache;
        let fn_callback = params.fn_callback;
        let type = params.type;

        $.ajax({
            url: url,
            cache: isCache,
            success: fn_callback,
            dataType: type,
        });
    };

    cjNetwork.upFile = function(params) {
        let url = params.url;
        let fn_callback = params.fn_callback;
        let type = params.type;
        let formData = params.form_data;

        $.ajax({
            type: 'POST',
            url: url,
            success: fn_callback,
            dataType: type,
            processData: false,  // 注意：让jQuery不要处理数据
            contentType: false,  // 注意：让jQuery不要设置contentType
            data: formData,
        });
    };
});
