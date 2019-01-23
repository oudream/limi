'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');
const os = require('os');

let CjAppEnv = require('./../../common/cjs/cjappenv.js');

const CjDbMysql = require('./../../common/cjs/cjdb_mysql.js');

let HttpServer = require('./../../common/csm/http_server.js');

let rtdb = require('./../../../assets/common/cc4k/rtdb.js');

let Cc4kDaService = require('./cc4k_da_service.js');
let Cc4kRtService = require('./cc4k_rt_service.js');

let webServerPort = 9111;
let staticFilesPath = path.join(__dirname, './../../../assets/');

exports = module.exports = WebServer;

function getServerID() {
    let sCfgData = fs.readFileSync(path.resolve(__dirname, './../../../config/config.json'), {encoding: 'utf-8'});
    let oData = JSON.parse(sCfgData);
    let sSvrGlobal = fs.readFileSync(path.resolve(oData.cc4000.deployPath, './config/SvrGlobal.json'), {encoding: 'utf-8'});
    let oSvrGlobal = JSON.parse(sSvrGlobal);
    return oSvrGlobal.tables[0].rows[0].ServerId;
}

function WebServer() {
}

WebServer.init = function () {
    WebServer.cc4kConfig = {};
    WebServer.cc4kConfig.serverId = getServerID();
    cjs.info('WebServer.init: getServerID(): ', WebServer.cc4kConfig.serverId);

    CjAppEnv.init();

    cjs.info('WebServer.init: open mysql by: ', JSON.stringify(CjAppEnv.config.database.db1));
    WebServer._mysql = new CjDbMysql(
        {
            host: CjAppEnv.config.database.db1.host,
            user: CjAppEnv.config.database.db1.user,
            password: CjAppEnv.config.database.db1.pwd,
            database: CjAppEnv.config.database.db1.dsn,
        }
    );
};

WebServer.run = async function ( ) {

    // load cc4k's config
    async function loadCc4kConfig() {
        try {
            let values = await WebServer._mysql.queryPromise(`select EthernetIP from omc_neconfig where NeNo = '${WebServer.cc4kConfig.serverId}'`);
            WebServer.cc4kConfig.EthernetIP = values && values.length > 0 ? values[0].EthernetIP : CjAppEnv.networkIp;
        }
        catch (e) {
            WebServer.cc4kConfig.EthernetIP = CjAppEnv.networkIp;
        }
        cjs.info('WebServer.init: loadEthernetIP(): ', WebServer.cc4kConfig.EthernetIP);

        try {
            let values = await WebServer._mysql.queryPromise(`select ItemValue from omc_omcconfig where ItemNo = '266'`);
            WebServer.cc4kConfig.RtBusPort = values && values.length > 0 ? values[0].ItemValue : 6687;
        }
        catch (e) {
            WebServer.cc4kConfig.RtBusPort = 0;
        }
        cjs.info('WebServer.init: loadRtBusPort(): ', WebServer.cc4kConfig.RtBusPort);

        try {
            let values = await WebServer._mysql.queryPromise(`select AppID from ha_appconfig where NodeID = '${WebServer.cc4kConfig.serverId}' and AppName = 'node.exe'`);
            WebServer.cc4kConfig.AppID = values && values.length > 0 ? values[0].AppID : 0;
        }
        catch (e) {
            cjs.info('WebServer.init: loadAppid(): error!');
            process.exit();
        }
        cjs.info('WebServer.init: loadAppid(): ', WebServer.cc4kConfig.AppID);

        try {
            let values = await WebServer._mysql.queryPromise(`select ip, port from omc_rtsubscribe where AppID = '${WebServer.cc4kConfig.AppID}'`);
            WebServer.cc4kConfig.RtBusNodeIp = values && values.length > 0 ? values[0].ip : '127.0.0.1';
            WebServer.cc4kConfig.RtBusNodePort = values && values.length > 0 ? values[0].port : 0;
        }
        catch (e) {
            cjs.info('WebServer.init: Locad RtBusApi IP and Port Error!');
            process.exit();
        }
        cjs.info(`WebServer.init: loadRtBusNodeIpPort(): RtBusNodeIp=${WebServer.cc4kConfig.RtBusNodeIp}, RtBusNodePort=${WebServer.cc4kConfig.RtBusNodePort}`);

        try {
            let values = await WebServer._mysql.queryPromise(`SELECT NeNo, SignalUrl, SignalNo FROM omc_signalurl;`);
            let inMeasures = [];
            for (let i = 0; i < values.length; i++) {
                let row = values[i];
                let time = new Date().getTime();
                inMeasures.push({
                    id: row['SignalNo'],
                    neno: row['NeNo'],
                    code: row['SignalUrl'],
                    refreshTime: time,
                });
            }
            rtdb.receivedMeasures(inMeasures);
            cjs.info(`WebServer.init: omc_signalurl: size=${inMeasures.length}`);
        }
        catch (e) {
            WebServer.cc4kConfig.AppID = 0;
            cjs.info(`WebServer.init: omc_signalurl: error!`);
        }

        startCc4kComunications();
    }

    loadCc4kConfig();

    function startCc4kComunications() {

        let httpServer = new HttpServer({
            port: webServerPort,
            staticAssetsPath: staticFilesPath,
        });

        httpServer.route.all(/\/(.){0,}\.app\.heartjump/, WebServer.dealRequestHeartJump);

        httpServer.route.all(/\/(.){0,}.icsdata/, WebServer.dealRequestIcsData);

        httpServer.route.all(/\/(.){0,}\.test/, WebServer.dealRequestTest);

        // Cc4kDaService.init(httpServer,{
        //     LocalIpAddress: WebServer.cc4kConfig.EthernetIP,
        //     LocalPort: 6717,
        //     RemotePort: 6697,
        //     RemoteIpAddress: WebServer.cc4kConfig.EthernetIP,
        // });

        Cc4kRtService.init(httpServer,{
            LocalIpAddress: WebServer.cc4kConfig.EthernetIP,
            LocalPort: WebServer.cc4kConfig.RtBusNodeIp,
            RemotePort: WebServer.cc4kConfig.RtBusPort,
            RemoteIpAddress: WebServer.cc4kConfig.EthernetIP,
            RtWebSocketPort: 9211
        });

        cjs.info('WebServer.init: end.');
    };

};

WebServer.dealRequestHeartJump = function (req, res) {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', function (chunk) {
            body += chunk;
        });
        req.on('end', function () {
            CjLog.log('app.heartjump:', JSON.stringify(body));
            let reqSession = null;
            let reqStructtype = null;
            let reqParams = null;
            if (body) {
                try {
                    let reqBody = JSON.parse(body);
                    reqSession = reqBody.session;
                    reqStructtype = reqBody.structtype;
                    reqParams = reqBody.params;
                }
                catch (e) {
                    r = null;
                    console.log('error: JSON.parse(body)');
                }
            }
            if (reqSession && reqStructtype && reqParams) {
                let resContent = {
                    session: reqSession,
                    structtype: reqStructtype,
                    data: {
                        state: 0,
                        serverInfo: {
                            respTime: Date.now(),
                        },
                    },
                };
                res.writeHead(200);
                res.end(JSON.stringify(resContent));
            }
            else {
                res.writeHead(404);
                res.end();
            }
        });
    }
    else {
        res.writeHead(404);
        res.end();
    }
};

WebServer.dealRequestIcsData = function fn(req, res) {
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
        req.on('data', function (chunk) {
            data += chunk;
        });

        req.on('end', function () {
            console.log(data);
            login.verification(data, function (err, result) {
                if (err) {
                    res.write(err);
                    res.end();
                }
                else {
                    res.setHeader('Set-Cookie', result);
                    res.write(result[0]);
                    res.end();
                }
            });
        });
    }
    else {
        let returnData = {
            sessionId: sessionId,
        };

        if (fncode.indexOf('.data.svrstatus') !== -1) {
            returnData['data'] = {
                status: 200,
            };
            returnData['error'] = null;
        }
        else {
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
};

WebServer.dealRequestTest = function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/json',
        'Access-Control-Allow-Origin': '*', /* ,'Content-Length' : dataLength */
    });
    res.write('test', 'utf-8');
    res.end();
};
