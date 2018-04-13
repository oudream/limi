'use strict';

const path = require('path');
const glob = require('glob');
const fs = require('fs');
const async = require('async');

const CjLog = require('../../../assets/common/cjs/nodejs/cjlog.js');
const ci = cjs.daemon ? cjs.daemon : cjs;
const CjFs = require('../../../assets/common/cjs/nodejs/cjfs.js');

const ShareCache = require('./../../common/share-cache.js').ShareCache;
const configOpt = require('../../../assets/common/cjs/nodejs/cj-json-config.js');
const Database = require('../../../assets/common/cjs/nodejs/cj-database.js').CjDatabase;
// const projDir = ShareCache.get('local-info', 'current_work_dir')

const ProtocolCc4000 = require('../../../assets/common/csm/protocol_cc4000.js');
const BasProtocol = ProtocolCc4000;
const BasDefine = ProtocolCc4000.BasDefine;
const BasPacket = ProtocolCc4000.BasPacket;

const ProtocolPsm = require('../../../assets/common/csm/protocol_psm.js');
const PsmProtocol = ProtocolPsm;
const PsmDefine = ProtocolPsm.PsmDefine;
const PsmRealtimeDataStruct = ProtocolPsm.PsmRealtimeDataStruct;

let _basProtocol = new BasProtocol();
let _psmProtocol = new PsmProtocol();
let _event = global.globalEvent;
let _alarmRecPlayLog = {};
_alarmRecPlayLog.data = [];

_alarmRecPlayLog.load = function() {
    let salarmRecPlayLogFilePath = path.join(path.join(process.cwd(), 'temp'), 'alarmrec_playlog.json');
    if (CjFs.isExistSync(salarmRecPlayLogFilePath)) {
        _alarmRecPlayLog.data = CjFs.load2ObjectSync(salarmRecPlayLogFilePath);
        ci.info('_alarmRecPlayLog load result: ' + _alarmRecPlayLog.data.length);
    }
};

_alarmRecPlayLog.save = function() {
    let salarmRecPlayLogFilePath = path.join(path.join(process.cwd(), 'temp'), 'alarmrec_playlog.json');
    fs.writeFileSync(salarmRecPlayLogFilePath, JSON.stringify(_alarmRecPlayLog.data));
};

_alarmRecPlayLog.find = function(alarmNo) {
    let data = this.data;
    for (let i = 0; i < data.length; i++) {
        let alarmRecPlayLog = data[i];
        if (alarmRecPlayLog.AlarmNo === alarmNo) {
            return alarmRecPlayLog;
        }
    }
    return null;
};

_alarmRecPlayLog.needPlay = function(alarmNo, alarmClass) {
    let alarmRecPlayLog = this.find(alarmNo);
    if (alarmRecPlayLog !== null) {
        return alarmRecPlayLog.AlarmClass < alarmClass;
    } else {
        return true;
    }
};

_alarmRecPlayLog.addPlay = function(alarmNo) {
    let alarmRecPlayLog = this.find(alarmNo);
    if (alarmRecPlayLog !== null) {
        alarmRecPlayLog.AlarmClass = alarmRecPlayLog.AlarmClass + 1;
    } else {
        _alarmRecPlayLog.data.push({
            AlarmNo: alarmNo,
            AlarmClass: 1,
        });
    }
};

function init() {
    loadConfigFile();

    _alarmRecPlayLog.load();

    getOmcServerInfo();

    _event.on('omc-listener-start', function listener() {
        protocolListenerInit();
    });

    _event.on('send-to-omc-server', function listener(msg) {
        let msgObj = JSON.parse(msg);

        if (msgObj && !msgObj.err && msgObj.data.length > 0) {
            sendToOmcServer(msgObj);
        }
    });
}

function protocolListenerInit() {
    let serverConfig = ShareCache.get('omc-server-config', 'omc_server');
    if (!serverConfig) {
        return false;
    }

    const serverHost = serverConfig.host;
    const serverPort = serverConfig.port;

  // * _basProtocol
    _basProtocol.onAllPacket(function(command, msgObj) {
    // console.log('msgObj: ' + msgObj['password']);
        console.log(command, msgObj);

        let _channel = null;
        let _command = null;
        switch (command) {
        case BasPacket.userLoginPacket.command: {
            _channel = 'protocol-user-login';
            _command = 'user-login';

            break;
        }
        case BasPacket.updateInfo.command: {
            _command = 'update-info';

            break;
        }
        case BasPacket.alarmReqPacket.command: {
            _channel = 'protocol-notify';
            _command = 'alarm-notify';

            break;
        }
        case BasPacket.alarmAnsPacket.command: {
            _channel = 'protocol-answer';
            _command = 'alarm-answer';

            break;
        }

        default:
        }

        console.log('user : ' + msgObj.user);

    // mainWindow.flashFrame(true);

        let msg = {
            command: _command,
            err: null,
            data: msgObj,
        };

        if (_channel) {
            let packetName = '';
            if (_channel === 'protocol-notify') {
                packetName = '推送包';
            } else if (_channel === 'protocol-answer') {
                packetName = '回应包';
            }

            let hasError = false;
            let alarmNo = msgObj['AlarmNo'];
            let alarmAction = msgObj['Action'];
            let alarmType = msgObj['AlarmType'];
            if (alarmNo === 0 || alarmNo === '') {
                let logText = '告警' + packetName + '错误: AlarmNo = ' + alarmNo + '; data = ' + JSON.stringify(msgObj);
                ci.log(logText);
        // log.writeLog(logText)
                hasError = true;
            }
            if (alarmAction === 0 || alarmAction === '') {
                let logText = '告警' + packetName + '推送包错误: Action = ' + alarmAction + '; data = ' + JSON.stringify(msgObj);
                ci.log(logText);
        // log.writeLog(logText)
                hasError = true;
            }
            if (alarmType === 0 || alarmType === '') {
                let logText = '告警' + packetName + '错误: AlarmType = ' + alarmType + '; data = ' + JSON.stringify(msgObj);
                ci.log(logText);
        // log.writeLog(logText)
                hasError = true;
            }

            if (!hasError) {
                _event.emit('push-message', JSON.stringify(msg));
            }
        }
    });

    _basProtocol.start({
        RemotePort: serverPort,
        RemoteIpAddress: serverHost,
    });

  // * _psmProtocol
    _psmProtocol.start({
        LocalIpAddress: '127.0.0.1',
        LocalPort: 9105,
        RemoteIpAddress: '127.0.0.1',
        RemotePort: 9005,
        FileSavePath: 'd:/temp',
    });

  // all in
    _psmProtocol.onReceivedMessage = function(sCommand, sParam, attach) {
        console.log(sCommand, sParam);
    };

    setInterval(function() {
        function doDealAlarmRec(err, vals) {
            if (err) {
                ci.info('db:default,fn:getAlarmRec,err:', err);
            }
            if (vals instanceof Array) {
                let iPlayCount = 0;
                for (let i = 0; i < vals.length; i++) {
                    let val = vals[i];
                    let alarmNo = val.AlarmNo;
                    let alarmClass = val.AlarmClass;
                    let neAlias = val.NeAlias;
                    let repaireMark = val.RepaireMark;
                    let alarmName = val.AlarmName;
                    let alarmText = neAlias + ' ';
                    alarmText = repaireMark.length > 0 ? alarmText + repaireMark : alarmText + alarmName;
                    if (_alarmRecPlayLog.needPlay(alarmNo, alarmClass)) {
                        let iResult = _psmProtocol.postMessageCommand('post.tts.1', 'txt=' + alarmText);
                        let sLog = 'psmProtocol.postMessageCommand iResult=' + iResult.toString();
                        _alarmRecPlayLog.addPlay(alarmNo);
                        ci.info(sLog);
                        ++iPlayCount;
                    } else {
                        ci.info('Alarm Play Skip : ' + alarmText);
                        break;
                    }
                }
                if (iPlayCount > 0) {
                    _alarmRecPlayLog.save();
                    ci.info('Alarm Play Save');
                }
            }
        }

        getAlarmRec(doDealAlarmRec);
    }, 10000);

  /** 测试用 */
    let testAction = 2;
    setInterval(function() {
        if (testAction === 1) {
            testAction = 2;
        } else {
            testAction = 1;
        }

        _event.emit('push-message', JSON.stringify({
            err: null,
            data: {
                'AlarmNo': 169935,
                'Action': testAction,
                'User': '',
                'NeID': 5308417,
                'AlarmType': 5308417,
                'ModuleNo': 0,
                'CardNo': 0,
                'PortNo': '',
            },
            command: 'alarm-answer',
        }));
    }, 20000);

  // only command
  //     basProtocol.on(BasPacket.userLoginPacket.command, function (msgObj) {
  //         console.log(msgObj); // msgObj = {user: 'user1', password: 'password1'}
  //     });
}

function sendToOmcServer(msg) {
    if (msg) {
        let data = msg.data;
        let command = msg.command;
        let action = null;
    // let confirmData = null
        let sSql = null;
        let sSql1 = null;

        console.log(data);

        switch (command) {
        case 'alarm-confirm': {
            action = BasDefine.OMC_CONFIRM_ALARM;
            sSql1 = 'UPDATE omc_alarmrec SET Confirm=1,ConfirmTime=\'' + Date.now().toString() + '\', ConfirmUser=\'client\' WHERE AlarmNo=';
            break;
        }

        case 'alarm-cancel-confirm': {
            action = BasDefine.OMC_INVOKE_CONFIRM_ALARM;
            sSql1 = 'UPDATE omc_alarmrec SET Confirm=0,ResumeTime=\'' + Date.now().toString() + '\', ConfirmUser=\'client\' WHERE AlarmNo=';
            break;
        }

        case 'alarm-eliminate': {
            action = BasDefine.OMC_ERASE_ALARM;
            sSql1 = 'UPDATE omc_alarmrec SET Eliminate=1,EliminateTime=\'' + Date.now().toString() + '\', EliminateUser=\'client\' WHERE AlarmNo=';
        }
        }

        for (let i = 0; i < data.length; i++) {
            let alarm = data[i];
            let packet = BasPacket.alarmReqPacket.toPacket(alarm['alarmNo'], action, alarm['user'], alarm['neID'], alarm['alarmType'], alarm['moduleNo'], alarm['cardNo'], alarm['portNo']);
            let iResult = _basProtocol.sendPacket(packet);
            console.log('BasProtocol.sendPacket, command: ', command, ', sendResult:', iResult);
            sSql = sSql1 + alarm['alarmNo'] + ';';
            let dataObj = {
                sql: sSql,
                fncode: '.sql.exec',
            };
            _event.emit('sql-inter-request', dataObj);
        }
    }
}

function loadConfigFile() {
    const projDir = ShareCache.get('local-info', 'current_work_dir');

    let files = glob.sync(path.join(projDir, '/config/omc/*.json'));
    files.forEach(function(file) {
        let fileName = path.basename(file);

        let _config = configOpt.load(file);

    // if (fileName === 'template_config.json') {
    //     ShareCache.createShareCache('client-template_config',_config);
    // }
        let _k = fileName.split('.')[0];

        ShareCache.createShareCache(_k, _config);
    });

    let configPath = path.join(projDir, '/config');
    if (!fs.existsSync(configPath)) {
        fs.mkdir('./config', 0o777, function(err) {
            if (err) {
                throw err;
            }
        });
    }

    let configFilePath = path.join(projDir, '/config/omc_config.json');
    let _config = configOpt.load(configFilePath);

    if (typeof _config === 'object') {
        ShareCache.createShareCache('omc-server-config', _config);
    }
}

function getOmcServerInfo() {
    const projDir = ShareCache.get('local-info', 'current_work_dir');
    let dbConfigs = ShareCache.get('server-config', 'database');
    let mysqlConfig = dbConfigs['db1'];
  // let _host = mysqlConfig.host;
  // let _dsn = mysqlConfig.dsn;

    let defaultDb = new Database(mysqlConfig.type, mysqlConfig, function(err, res) {
        if (err) {
            console.log(err);
            throw err;
        }
    });

  // let defaultDb = server.dbManager.findDb(_host,_dsn);

    let sql1 = 'select * from omc_omcconfig where itemno = 3';
    let sql2 = 'select * from omc_omcconfig where itemno = 1';

    async.parallel({
        queryIp: function(callback) {
            defaultDb.load(sql1, function(err, vals) {
                callback(err, vals);
            });
        },
        queryPort: function(callback) {
            defaultDb.load(sql2, function(err, vals) {
                callback(err, vals);
            });
        },
    }, function(err, results) {
        if (err) {
            console.log(err);

            throw err;
        }

        console.log(results);

        let serverIp = results['queryIp'][0]['ItemValue'];
        let serverPort = results['queryPort'][0]['ItemValue'];

        let omcServer = {
            'host': serverIp,
            'port': serverPort,
        };

        defaultDb.close();
        defaultDb = null;

        ShareCache.set('omc-server-config', 'omc_server', omcServer);
        let configObj = ShareCache.get('omc-server-config');

        let configFilePath = path.join(projDir, '/config/omc_config.json');
        configOpt.save(configFilePath, configObj);

        _event.emit('omc-listener-start');
    });
}

function getAlarmRec(fnCallback) {
    let dbConfigs = ShareCache.get('server-config', 'database');
    let mysqlConfig = dbConfigs['db1'];

    let defaultDb = new Database(mysqlConfig.type, mysqlConfig, function(err, res) {
        if (err) {
            console.log(err);
            throw err;
        }
    });

    let sql1 = 'select omc_alarmrec.AlarmNo, omc_alarmrec.RepaireMark, omc_neconfig.NeAlias , omc_alarminfo.AlarmName , omc_alarminfo.AlarmClass, omc_alarminfo.AlarmTimes FROM omc_alarmrec, omc_alarminfo, omc_neconfig WHERE omc_alarmrec.AlarmType = omc_alarminfo.AlarmType and omc_alarmrec.NeID = omc_neconfig.NeNo and omc_alarmrec.Status <> 1 and omc_alarmrec.Confirm <> 1 GROUP BY omc_neconfig.NeAlias , omc_alarmrec.RepaireMark;';

    defaultDb.load(sql1, function(err, vals) {
        fnCallback(err, vals);
        defaultDb.close();
        defaultDb = null;
    });
}

init();
