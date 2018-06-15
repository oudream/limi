'use strict';

const path = require('path');
const glob = require('glob');
const fs = require('fs');
const async = require('async');

const CjLog = require('./../../common/cjs/cjlog.js');
const ci = cjs.daemon ? cjs.daemon : cjs;
const CjFs = require('./../../common/cjs/cjfs.js');

const ShareCache = require('./../../common/share-cache.js').ShareCache;
const configOpt = require('./../../common/cjs/cj-json-config.js');
const Database = require('./../../common/cjs/cj-database.js').CjDatabase;
// const projDir = ShareCache.get('local-info', 'current_work_dir')
const DbManager = require('./../../common/cjs/cj-database.js').DbManager;

const ProtocolCc4000 = require('./../../common/csm/protocol_cc4000.js');
const BasProtocol = ProtocolCc4000;
const BasDefine = ProtocolCc4000.BasDefine;
const BasPacket = ProtocolCc4000.BasPacket;

const ProtocolPsm = require('./../../common/csm/protocol_psm.js');
const PsmProtocol = ProtocolPsm;
const PsmDefine = ProtocolPsm.PsmDefine;
const PsmRealtimeDataStruct = ProtocolPsm.PsmRealtimeDataStruct;

const rtdb = require('./../../../assets/common/cc4k/rtdb.js');

let _omcProtocol = new BasProtocol();
let _psmProtocol = new PsmProtocol();
let _rtbusProtocol = new BasProtocol(false);
let _event = global.globalEvent;
let _alarmRecPlayLog = {};
_alarmRecPlayLog.data = [];
// 数据库连接
let dbMgr = null;
let dbsConfig = null;


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
    dbMgr = createDbManager();

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

    const omcServerHost = serverConfig.host;
    const omcServerPort = serverConfig.port;

    _omcProtocol.onAllPacket(function(command, msgObj) {
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

    _omcProtocol.start({
        RemotePort: omcServerPort,
        RemoteIpAddress: omcServerHost,
    });

    /**
     * fn deal rtdata
     * @param {Object}msgObj
     int nIdx = 0;
     memcpy_byte(tData.m_nMeasureID, &(pBuf[nIdx]), ICS_MAX_ITEM_LEN);
     nIdx += ICS_MAX_ITEM_LEN;
     memcpy_byte(tData.m_nValue, &(pBuf[nIdx]), ICS_MAX_ITEM_LEN);
     nIdx += ICS_MAX_ITEM_LEN;
     memcpy_byte(tData.m_nRefreshTime, &(pBuf[nIdx]), ICS_MAX_ITEM_LEN);
     nIdx += ICS_MAX_ITEM_LEN;
     memcpy_byte(tData.m_nRes, &(pBuf[nIdx]), ICS_MAX_ITEM_LEN);
     nIdx += ICS_MAX_ITEM_LEN;
     */
    function fnDealRt(msgObj) {
        console.log(msgObj.TableName);
        console.log(msgObj.Count);
        let iOffset = msgObj.offset;
        let buf = msgObj.buffer;
        if (msgObj.TableName.indexOf('T_RT_YX') !== -1) {
            let iCount = msgObj.Count;
            if (!buf || iOffset + iCount * 32 > buf.length) {
                console.log('fnDealRt : buf length no enough, ');
                return;
            }
            let inMeasures = [];
            for (let i = 0; i < msgObj.Count; i++) {
                let measure = {};
                measure.id = buf.readIntLE(iOffset, 6, true); iOffset += 8;
                measure.value = (buf.readIntLE(iOffset, 6, true)).toFixed(2); iOffset += 8;
                measure.refreshTime =utc2Locale(buf.readIntLE(iOffset, 6, true)); iOffset += 8;
                measure.res = buf.readIntLE(iOffset, 6, true); iOffset += 8;
                inMeasures.push(measure);
            }
            rtdb.receivedMeasures(inMeasures);
        } else if (msgObj.TableName.indexOf('T_RT_YC') !== -1) {
            let iCount = msgObj.Count;
            if (!buf || iOffset + iCount * 152 > buf.length) {
                console.log('fnDealRt : buf length no enough, ');
                return;
            }
            let inMeasures = [];
            for (let i = 0; i < msgObj.Count; i++) {
                let measure = {};
                measure.id = buf.readIntLE(iOffset, 6, true); iOffset += 8;
                measure.value = (buf.readDoubleLE(iOffset, true)).toFixed(2); iOffset += 8;
                measure.refreshTime = utc2Locale(buf.readIntLE(iOffset, 6, true)); iOffset += 8;
                measure.res = buf.readIntLE(iOffset, 6, true); iOffset += 8;
                inMeasures.push(measure);
            }
            rtdb.receivedMeasures(inMeasures);
        } else if (msgObj.TableName.indexOf('T_RT_YW') !== -1) {
            let iCount = msgObj.Count;
            if (!buf || iOffset + iCount * 152 > buf.length) {
                console.log('fnDealRt : buf length no enough, ');
                return;
            }
            let inMeasures = [];
            for (let i = 0; i < msgObj.Count; i++) {
                let measure = {};
                measure.id = buf.readIntLE(iOffset, 6, true); iOffset += 8;
                measure.value = buf.toString('utf8', iOffset, iOffset+128); iOffset += 128;
                measure.refreshTime = utc2Locale(buf.readIntLE(iOffset, 6, true)); iOffset += 8;
                measure.res = buf.readIntLE(iOffset, 6, true); iOffset += 8;
                inMeasures.push(measure);
            }
            rtdb.receivedMeasures(inMeasures);
        }
    }

    _rtbusProtocol.on(BasPacket.rtAnsFirstPacket.commandCode, fnDealRt);
    _rtbusProtocol.on(BasPacket.rtAnsNextPacket.commandCode, fnDealRt);
    _rtbusProtocol.on(BasPacket.rtReqUpdrcdPacket.commandCode, fnDealRt);
    _rtbusProtocol.onAllPacket(function(command, msgObj) {
        console.log(command, msgObj);
        // switch (command) {
        // case BasPacket.rtAnsFirstPacket.command:
        // case BasPacket.rtAnsNextPacket.command:
        // case BasPacket.rtReqUpdrcdPacket.command:
        //     {
        //         break;
        //     }
        // default:
        // }
    });

    _rtbusProtocol.start({
        LocalIpAddress: '127.0.0.1',
        LocalPort: 6716,
        RemotePort: 6696,
        RemoteIpAddress: omcServerHost,
    });


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

    let loginRtbusTimeout = setTimeout(function() {
        clearTimeout(loginRtbusTimeout);

        let packet = BasPacket.rtLoginPacket.toPacket(262149);
        _rtbusProtocol.sendPacket(packet);

        console.log(packet);
    }, 1000);
};

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
            let iResult = _omcProtocol.sendPacket(packet);
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
  //   let dbConfigs = ShareCache.get('server-config', 'database');
  //   let mysqlConfig = dbConfigs['db1'];
  //
  //   let defaultDb = new Database(mysqlConfig.type, mysqlConfig, function(err, res) {
  //       if (err) {
  //           console.log(err);
  //           throw err;
  //       }
  //   });

  // let defaultDb = server.dbManager.findDb(_host,_dsn);


    let mysqlConfig = dbsConfig['db1'];
    let defaultDb = dbMgr.createDbConnect(mysqlConfig);

    let sql1 = 'select * from omc_omcconfig where itemno = 3';
    let sql2 = 'select * from omc_omcconfig where itemno = 1';
    let sql3 = 'SELECT NeNo, SignalUrl, SignalNo FROM omc_signalurl;';

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
        querySignalurl: function(callback) {
            defaultDb.load(sql3, function(err, vals) {
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
        let omcServerPort = results['queryPort'][0]['ItemValue'];

        let omcServer = {
            'host': serverIp,
            'port': omcServerPort,
        };

        let rows = results['querySignalurl'];
        let inMeasures = [];
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            inMeasures.push({
                id: row['SignalNo'],
                neno: row['NeNo'],
                code: row['SignalUrl'],
            });
        }
        rtdb.receivedMeasures(inMeasures);

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
    let mysqlConfig = dbsConfig['db1'];
    let defaultDb = dbMgr.createDbConnect(mysqlConfig);

    // let dbConfigs = ShareCache.get('server-config', 'database');
    // let mysqlConfig = dbConfigs['db1'];
    //
    // let defaultDb = new Database(mysqlConfig.type, mysqlConfig, function(err, res) {
    //     if (err) {
    //         console.log(err);
    //         throw err;
    //     }
    // });

    let sql1 = 'select omc_alarmrec.AlarmNo, omc_alarmrec.RepaireMark, omc_neconfig.NeAlias , ' +
        'omc_alarminfo.AlarmName , omc_alarminfo.AlarmClass FROM omc_alarmrec, omc_alarminfo, ' +
        'omc_neconfig WHERE omc_alarmrec.AlarmType = omc_alarminfo.AlarmType and omc_alarmrec.NeID ' +
        '= omc_neconfig.NeNo and omc_alarmrec.Status <> 1 and omc_alarmrec.Confirm <> 1 ' +
        'GROUP BY omc_neconfig.NeAlias , omc_alarmrec.RepaireMark;';

    defaultDb.load(sql1, function(err, vals) {
        fnCallback(err, vals);
        defaultDb.close();
        defaultDb = null;
    });
}

function utc2Locale (utcStr) {
    let date = new Date(utcStr);

    let _month = date.getMonth() + 1;
    let month = _month > 9 ? _month : ('0' + _month.toString());
    let day = date.getDate() > 9 ? date.getDate() : ('0' + date.getDate().toString());

    let _hour = date.getHours() > 9 ? date.getHours() : ('0' + date.getHours().toString());
    let _min = date.getMinutes() > 9 ? date.getMinutes() : ('0' + date.getMinutes().toString());
    let _sec = date.getSeconds() > 9 ? date.getSeconds() : ('0' + date.getSeconds().toString());

    let localeString = date.getFullYear() + '/' + month + '/' + day + ' ' +
        _hour + ':' + _min + ':' + _sec;
    return localeString;
}

/**
 * 创建数据库管理器
 * @returns {DbManager} : Object 数据库管理器对象
 */
function createDbManager () {
    dbsConfig = ShareCache.get('server-config', 'database')
    return new DbManager(dbsConfig)
}

init();
