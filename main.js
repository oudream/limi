'use strict';

const path = require('path');
const glob = require('glob');
const fs = require('fs');
const events = require('events');
const url = require('url');
const os = require('os');

require('./assets/common/cjs/cjinterinfo.js');
require('./assets/common/cjs/cjstring.js');
require('./assets/common/cjs/cjnumber.js');
require('./assets/common/cjs/cjmeta.js');
require('./assets/common/cjs/cjbuffer.js');
require('./nodejs/common/cjs/cjlog.js');
require('./nodejs/common/cjs/cjfs.js');
let HttpServer = require('./nodejs/common/csm/http_server.js');
const ShareCache = require('./nodejs/common/share-cache.js').ShareCache;
const configOpt = require('./nodejs/common/cjs/cj-json-config.js');
const utils = require('./nodejs/common/utils.js').utils;
const log = require('./nodejs/common/log.js');
const login = require('./nodejs/common/login.js').login;

let resMap = {};

function init() {
    console.log('process.cwd: ', process.cwd());

  /** 获取本地目录信息 */
    getLocalInfo();

  /** 加载配置文件 */
    loadConfigFile();

  /** 获取本地IP地址 */
    getLocalIp();

  /** 创建全局事件 */
    createGlobalEvent();

  /** 加载各个模块 */
    loadModules();

  /** 异常监听 */
    errorListener();

  /** SQL语句响应返回监听 */
    sqlResponseListener();

    let staticFilesPath = path.join(__dirname, './assets/');

    console.log('static files path : ' + staticFilesPath);

    let svr = new HttpServer({
        port: 9001,
        staticAssetsPath: staticFilesPath,
    });
    global.httpServer = svr;

    console.log('启动HTTP服务器完成');
  // log.writeLog('启动HTTP服务器完成...');

    let currentReq = null;
    let currentRes = null;
    let currentTimeout = null;


    svr.route.all(/\/(.){0,}.icsdata/, function fn(req, res) {
        let remoteIp = utils.net.getRemoteIpAddress(req);
        let paramsObj = url.parse(req.url, true).query;
        let sessionId = paramsObj.sessionId;
        let fncode = paramsObj.fncode;
        // reqAsync(req, res);
        //
        // if (currentReq!== null || currentRes !== null) {
        //     // 由于临时的服务器维护或者过载，服务器当前无法处理请求。这个状况是暂时的，并且将在一段时间以后恢复。
        //     res.writeHead(503);
        //     res.end();
        //     return;
        // }
        if (fncode === 'user.login') {
            let data = '';
            req.on('data', function(chunk) {
                data += chunk;
            });

            req.on('end', function() {
                console.log(data);
                login.verification(data, function(err, result) {
                    if (err) {
                        res.write(err);
                        res.end();
                    } else {
                        res.setHeader('Set-Cookie', result);
                        res.write(result[0]);
                        res.end();
                    }
                });
            });
        } else {
            let returnData = {
                sessionId: sessionId,
            };

            if (fncode.indexOf('.data.svrstatus') !== -1) {
                returnData['data'] = {
                    status: 200,
                };
                returnData['error'] = null;
            } else {
                returnData['data'] = null;
                returnData['error'] = 'fncode error';
            }

            let sReturnData = JSON.stringify(returnData);
            res.writeHead(200, {
                'Content-Type': 'text/json',
                'Access-Control-Allow-Origin': '*', /* ,'Content-Length' : dataLength */
            });
            res.write(sReturnData, 'utf-8');
            res.end();
        }
    });

  /**
   * 运行SQL语句的路由响应
   */
    svr.route.all(/\/(.){0,}.sql/, function fn(req, res) {
    // 定义了一个data变量，用于暂存请求体的信息
        let data = '';

        let paramsObj = url.parse(req.url, true).query;

    // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到data变量中
        req.on('data', function(chunk) {
            data += chunk;
        });

    // 在end事件触发后，解释请求体，取出sql语句运行，然后向客户端返回结果。
        req.on('end', function() {
      // data = querystring.parse(data);
            if (data !== '') {
                let dataObj = JSON.parse(data);
                console.log(data);

                let remoteIp = utils.net.getRemoteIpAddress(req);

                let newResId = dataObj.sessionId;
                resMap[newResId] = res;

                cjs.log('收到来自' + remoteIp + '终端的SQL请求');
        // log.writeLog('收到来自' + remoteIp + '终端的SQL请求');

        /** 把请求转到数据库处理服务 */
                global.globalEvent.emit('sql-request', data);
            }
        });

        req.on('error', function(e) {
            console.log(`problem with request: ${e.message}`);
            throw e;
        });
    });

  /** 加载特定模块 */
    // load=ics/omc,ics/daemon
    let sLoad = cjs.CjString.findValueInArray(process.argv, 'load=');
    cjs.log('加载模块: ' + sLoad);
    sLoad = sLoad || 'ics/common';
    if (sLoad.length > 0) {
        let sLoads = sLoad.split(/,|;/);
        for (let i = 0; i < sLoads.length; i++) {
            loadSpecialModules(path.join(__dirname, './nodejs/' + sLoads[i]));
        }
    }
}
