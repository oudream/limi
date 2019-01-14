/**
 * Created by liuchaoyu on 2017-03-10.
 */

'use strict';
let gSession = {};

class DatabaseSessionManager {
    constructor() {
        this.sessions = {};
    }

    requestSession(prefix) {
        let sessions = gSession[prefix];
        if (!sessions) {
            gSession[prefix] = [];
        }

        let _index = null;

        let _i = 0;
        while (_i >= 0) {
            if (gSession[prefix].indexOf(_i) === -1 || gSession[prefix].length === 0) {
                _index = _i;
                break;
            }

            _i++;
        }

        if (_index == null) {
            _index = 0;
        }

        gSession[prefix].push(_index);

        return prefix + '_' + _index.toString();
    }

    releaseSession(sessionId) {
        let _session = sessionId.split('_');
        let _prefix = _session[0];
        let _index = parseInt(_session[1], 10);

        let sessions = gSession[_prefix];

        let index = sessions.indexOf(_index);
        if (index != -1) {
            gSession[_prefix].splice(index, 1);

            if (sessions.length == 0) {
                gSession[_prefix] = null;
            }

            return 1;
        } else {
            console.log('Error: sessionId(\"' + sessionId + '\") is not exist!');
            return -1;
        }
    }
}


let requestPool = {};
let dbSessionMgr = null;

/**
 * 数据访问类
 * dbParams :
 * {
 *      host:,
 *      dsn:,
 * }
 */
class CjDatabaseAccess {
    constructor(dbParams) {
        this.id = dbParams.dsn;
        this.error = null;
        // this.requestPool = {};

        this.type = dbParams.type;

        if (dbParams.host) {
            this.id = dbParams.host + ':' + dbParams.dsn;
        }

        let terminalSessionId = cjLocalStorage.load('session-id');

        if (terminalSessionId) {
            this.terminalSessionId = terminalSessionId;
        }

        this.dbSessionManager = new DatabaseSessionManager(dbParams);
    }

    /**
     * 获取数据库数据（select语句）
     *
     * @param {any} sql : String SQL语句
     * @param {any} fn_callback : Function 运行完成后的返回函数
     * @param {any} params : Object 请求IP和端口
     *
     * @memberof CjDatabaseAccess
     */
    load(sql, fn_callback, params) {
        dbSessionMgr = this.dbSessionManager;
        let curSessionId = this.dbSessionManager.requestSession(this.id);
        if (this.terminalSessionId) {
            curSessionId = this.terminalSessionId + '_' + curSessionId;
        }

        requestPool[curSessionId] = fn_callback;
        // requestPool = this.requestPool;
        let reqParam = {
            sql: sql,
            fncode: 'req.sql.load',
            type: this.type,
            sessionId: curSessionId,
            callback: requestReturn,
        };

        if (params && params.reqHost) {
            reqParam.reqHost = params.reqHost;
            reqParam.reqPort = params.reqPort ? params.reqPort : 9001;
        }

        httpRequest(reqParam);
    }
    loadT(sql, fn_callback, params) {
        dbSessionMgr = this.dbSessionManager;
        let curSessionId = this.dbSessionManager.requestSession(this.id);
        if (this.terminalSessionId) {
            curSessionId = this.terminalSessionId + '_' + curSessionId;
        }

        this.requestPool[curSessionId] = fn_callback;
        requestPool = this.requestPool;
        let s = 'begin;' + sql + 'commit;';
        let reqParam = {
            ctx: _this,
            sql: s,
            fncode: 'req.sql.transaction',
            type: this.type,
            sessionId: curSessionId,
            callback: requestReturn,
        };

        if (params && params.reqHost) {
            reqParam.reqHost = params.reqHost;
            reqParam.reqPort = params.reqPort ? params.reqPort : 9001;
        }

        httpRequest(reqParam);
    }

    exec(sql, fn_callback, params) {
        dbSessionMgr = this.dbSessionManager;
        let curSessionId = this.dbSessionManager.requestSession(this.id);
        if (this.terminalSessionId) {
            curSessionId = this.terminalSessionId + '_' + curSessionId;
        }

        this.requestPool[curSessionId] = fn_callback;
        requestPool = this.requestPool;
        let reqParam = {
            sql: sql,
            fncode: 'req.sql.exec',
            type: this.type,
            sessionId: curSessionId,
            callback: requestReturn,
        };

        if (params && params.reqHost) {
            reqParam.reqHost = params.reqHost;
            reqParam.reqPort = params.reqPort ? params.reqPort : 9001;
        }

        httpRequest(reqParam);
    }

    execM(sql, values, fn_callback, params) {
        dbSessionMgr = this.dbSessionManager;
        let curSessionId = this.dbSessionManager.requestSession(this.id);
        if (this.terminalSessionId) {
            curSessionId = this.terminalSessionId + '_' + curSessionId;
        }

        this.requestPool[curSessionId] = fn_callback;
        requestPool = this.requestPool;
        let reqParam = {
            sql: sql,
            values: values,
            fncode: 'req.sql.exec.multi',
            type: this.type,
            sessionId: curSessionId,
            callback: requestReturn,
        };

        if (params && params.reqHost) {
            reqParam.reqHost = params.reqHost;
            reqParam.reqPort = params.reqPort ? params.reqPort : 9001;
        }

        httpRequest(reqParam);
    }
}

function runCallBack(sessionId, err) {
    let shareData = remote.getGlobal('shareData').mysqlShareData;

    let dbRecords = shareData.get(sessionId);
    shareData.remove(sessionId);

    let _fn = this.requestPool[sessionId];
    if (_fn) {
        _fn(err, dbRecords);

        this.dbSessionManager.releaseSession(sessionId);

        this.requestPool[sessionId] = null;
        delete this.requestPool[sessionId];
    }
}

/**
 * HTTP请求
 * @param param : object
 * {
 *      sql : xxxx,
 *      fncode : req.sql.,
 *      sessionId : xxxx,
 *      callback : xxxx,
 * }
 */
function httpRequest(param) {
    let _sendData = {
        'sql': param.sql,
        'fncode': param.fncode,
        'sessionId': param.sessionId,
        'type': param.type,
    };

    if (param.values && param.values.length) {
        _sendData['values'] = param.values;
    }

    let url = '';
    if (window.nodeRequire) {
        url = 'http://' + param.reqHost + ':' + param.reqPort + '/ics.sql';
        _sendData['terminalType'] = 'app';
    } else {
        url = 'ics.sql';
        _sendData['terminalType'] = 'browser';
    }

    let ajaxParams = cjAjax.createAjaxParams();
    ajaxParams.sendData = JSON.stringify(_sendData);
    ajaxParams.url = url;
    ajaxParams.urlParams = {
        fncode: param.fncode,
        session: param.sessionId,
    };
    ajaxParams.callback = param.callback;

    cjAjax.request(ajaxParams);
}

/**
 *
 *
 * @param {any} returnData
 */
function requestReturn(returnData) {
    let dataObj = JSON.parse(returnData);
    let sessionId = dataObj['sessionId'];
    let data = dataObj['data'];
    let err = dataObj['error'];
    let fn = requestPool[sessionId];

    if (fn) {
        fn(err, data);
    } else {
        console.log('callback function is not found');
    }

    let sessionStrs = sessionId.split('_');
    let count = sessionStrs.length;
    let sessionIdPart = '';
    if (count == 5) {
        sessionIdPart = sessionStrs[count - 2] + '_' + sessionStrs[count - 1];
    } else {
        sessionIdPart = sessionId;
    }

    dbSessionMgr.releaseSession(sessionIdPart);
    // dbSessionMgr.releaseSession.call(_this, sessionIdPart);
    requestPool[sessionId] = null;
    delete requestPool[sessionId];
}
