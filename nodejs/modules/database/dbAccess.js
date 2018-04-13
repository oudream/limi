'use strict';

const events = require('events');
const log = require('./../../common/log.js');
const utils = require('./../../common/utils.js').utils;
const ShareCache = require('./../../common/share-cache.js').ShareCache;
let DbManager = require('./../../../assets/common/cjs/nodejs/cj-database.js').DbManager;

let event = global.globalEvent;

function init() {
    let dbMgr = createDbManager();

    cjs.log('连接数据库完成...');
  // log.writeLog('连接数据库完成...');

    sqlRequestListener(dbMgr);
}

/**
 * SQL请求监听器
 * @param dbMgr : Object 数据库管理对象
 */
function sqlRequestListener(dbMgr) {
    event.on('sql-request', function(data) {
        let dataObj = JSON.parse(data);
        let sql = dataObj.sql;
        let sessionId = dataObj.sessionId;
        let fncode = dataObj.fncode;
        let terminalType = dataObj.terminalType;
        let values = (dataObj.values) ? dataObj.values : null;
        let logText = 'Session ID : ' + sessionId + '; ' + 'SQL : ' + sql + '; ';
        if (values) {
            logText += 'values : ' + JSON.stringify(values) + ';';
        }
        cjs.log(logText);
    // log.writeLog(logText);
        let dbInfo = utils.net.getInfoFromSession(sessionId);
        let db = dbMgr.findDb(dbInfo.host, dbInfo.dsn);
        if (fncode.indexOf('.sql.exec.multi') !== -1) {
            if (values && values.length > 0) {
                db.execM(sql, values, function(err, vals, fields, _sessionId) {
                    let returnData = {
                        sessionId: _sessionId,
                    };
                    if (err) {
                        console.log(err);
                        returnData['data'] = null;
                        returnData['error'] = err;
                    } else {
                        returnData['data'] = [];
                        returnData['error'] = null;
                    }
                    let msg = JSON.stringify(returnData);
                    event.emit('sql-response', msg);
                }, sessionId);
            } else {
                let returnData = {
                    sessionId: sessionId,
                    error: '\'values\' param is error!',
                    data: null,
                };

                let msg = JSON.stringify(returnData);

                event.emit('sql-response', msg);
            }
        } else if (fncode.indexOf('.sql.exec') !== -1) {
            db.exec(sql, function(err, vals, fields, _sessionId) {
                let returnData = {
                    sessionId: _sessionId,
                };

                if (err) {
                    console.log(err);
                    returnData['data'] = null;
                    returnData['error'] = err;
                } else {
                    returnData['data'] = [];
                    returnData['error'] = null;
                }
                let msg = JSON.stringify(returnData);
                event.emit('sql-response', msg);
            }, sessionId);
        } else if (fncode.indexOf('.sql.load') !== -1) {
            db.load(sql, function(err, vals, fields, _sessionId) {
                let returnData = {
                    sessionId: _sessionId,
                };

                if (err) {
                    console.log(err);
                    returnData['data'] = null;
                    returnData['error'] = err;
                } else {
                    returnData['data'] = vals;
                    returnData['error'] = null;
                }

                let msg = JSON.stringify(returnData);

                event.emit('sql-response', msg);
            }, sessionId);
        } else if (fncode.indexOf('.sql.transaction') !== -1) {
            db.loadT(sql, function(err, vals, fields, _sessionId) {
                let returnData = {
                    sessionId: _sessionId,
                };

                if (err) {
                    console.log(err);
                    returnData['data'] = null;
                    returnData['error'] = err;
                } else {
                    returnData['data'] = vals;
                    returnData['error'] = null;
                }

                let msg = JSON.stringify(returnData);

                event.emit('sql-response', msg);
            }, sessionId);
        }
    });

    event.on('sql-inter-request', function(dataObj) {
        let sql = dataObj.sql;
        let fncode = dataObj.fncode;
        let db = dbMgr.defaultDb;
        if (db === null) {
            console.log('sql-inter error. DbManager.databases.length <= 0.');
        }
        if (fncode.indexOf('.sql.exec') !== -1) {
            db.exec(sql, function(err, vals, fields, _sessionId) {
                let returnData = {
                    sessionId: _sessionId,
                };
                if (err) {
                    console.log(err);
                    returnData['data'] = null;
                    returnData['error'] = err;
                } else {
                    returnData['data'] = [];
                    returnData['error'] = null;
                }
                let msg = JSON.stringify(returnData);
                event.emit('sql-inter-response', msg);
            }, null);
        } else if (fncode.indexOf('.sql.load') !== -1) {
            db.load(sql, function(err, vals, fields, _sessionId) {
                let returnData = {
                    sessionId: _sessionId,
                };
                if (err) {
                    console.log(err);
                    returnData['data'] = null;
                    returnData['error'] = err;
                } else {
                    returnData['data'] = vals;
                    returnData['error'] = null;
                }
                let msg = JSON.stringify(returnData);
                event.emit('sql-inter-response', msg);
            }, null);
        }
    });
}

/**
 * 创建数据库管理器
 * @returns {DbManager} : Object 数据库管理器对象
 */
function createDbManager() {
    let dbsConfig = ShareCache.get('server-config', 'database');
    return new DbManager(dbsConfig);
}

init();
