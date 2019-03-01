'use strict';

let WebSocketServer = require('ws').Server;

const rtdb = require('./../../../assets/common/cc4k/rtdb.js');

const ProtocolCc4000 = require('./../../common/csm/protocol_cc4000.js');
const BasProtocol = ProtocolCc4000;
const BasDefine = ProtocolCc4000.BasDefine;
const BasPacket = ProtocolCc4000.BasPacket;

let _rtbusProtocol = new BasProtocol(false, BasDefine.PROTOCOL_MODEL_RT);


exports = module.exports = Cc4kRtService;

/**
 * Class Cc4kRtService
 * @constructor
 */
function Cc4kRtService() {
}

/**
 * Cc4kRtService.init
 * @param {HttpServer} httpServer
 * @param {Object} option = {
    LocalIpAddress: '127.0.0.1',
    LocalPort: 5687,
    RemotePort: 6687,
    RemoteIpAddress: '127.0.0.1',
    RtWebSocketPort: 9101,
}
 */
Cc4kRtService.init = function(httpServer, option) {
    _rtbusProtocol.on(BasPacket.rtAnsFirstPacket.commandCode, Cc4kRtService.dealRtbusData);
    _rtbusProtocol.on(BasPacket.rtAnsNextPacket.commandCode, Cc4kRtService.dealRtbusData);
    _rtbusProtocol.on(BasPacket.rtReqUpdlistPacket.commandCode, Cc4kRtService.dealRtbusData);
    _rtbusProtocol.on(BasPacket.rtReqUpdkeyPacket.commandCode, Cc4kRtService.dealRtbusData);
    _rtbusProtocol.onAllPacket(function(command, msgObj) {
        console.log(command, msgObj);
        // switch (command) {
        // case BasPacket.rtAnsFirstPacket.command:
        // case BasPacket.rtAnsNextPacket.command:
        // case BasPacket.rtReqUpdlistPacket.command:
        //     {
        //         break;
        //     }
        // default:
        // }
    });

    Cc4kRtService.option = option;
    Cc4kRtService.startTime = Date.now();
    _rtbusProtocol.start(option);

    let fnTimeOutRtLogin = function() {
        if (Cc4kRtService.option.RtbusAppId === 0) {
            console.log('warnning : _rtbus config[Cc4kRtService.option.RtbusAppId==0] invalid!!!');
            return;
        }

        let dtNow = Date.now();
        if (dtNow - Cc4kRtService.startTime < 6000 || dtNow - _rtbusProtocol.lastReceivedDataTime > 60000) {
            let packet = BasPacket.rtLoginPacket.toPacket(Cc4kRtService.option.RtbusAppId);
            _rtbusProtocol.sendPacket(packet);
            console.log(packet);
        }
    };
    setInterval(fnTimeOutRtLogin, 3000);

    Cc4kRtService.initRtWebSocket(option.RtWebSocketPort);

    httpServer.route.all(/\/(.){0,}\.rtdata\.cgi/, Cc4kRtService.dealRequestRtdata);

    httpServer.route.all(/\/(.){0,}ics\.cgi/, Cc4kRtService.dealRequestYk);
};

/**
 * utc2Locale
 * @param {string} utcStr
 * @return {string}
 */
Cc4kRtService.utc2Locale = function utc2Locale(utcStr) {
    let date = new Date(utcStr);

    let _month = date.getMonth() + 1;
    let month = _month > 9 ? _month : ('0' + _month.toString());
    let day = date.getDate() > 9 ? date.getDate() : ('0' + date.getDate().toString());

    let _hour = date.getHours() > 9 ? date.getHours() : ('0' + date.getHours().toString());
    let _min = date.getMinutes() > 9 ? date.getMinutes() : ('0' + date.getMinutes().toString());
    let _sec = date.getSeconds() > 9 ? date.getSeconds() : ('0' + date.getSeconds().toString());

    return date.getFullYear() + '/' + month + '/' + day + ' ' +
        _hour + ':' + _min + ':' + _sec;
    // console.log('aaaaa', localeString);
};

Cc4kRtService.getRtObjects = function(reqBody) {
    let reqSession = reqBody.session;
    let reqStructtype = reqBody.structtype;
    let reqMeasures = reqBody.params;
    if (reqSession && reqStructtype && reqMeasures) {
        return {
            session: reqSession,
            structtype: reqStructtype,
            data: function() {
                let data = [];
                for (let i = 0; i < reqMeasures.length; i++) {
                    let reqMeasure = reqMeasures[i];
                    if (reqMeasure.id > 0) {
                        let resMeasure = rtdb.findMeasureById(reqMeasure.id);
                        if (resMeasure) {
                            data.push(resMeasure);
                        }
                    } else if (reqMeasure.url.length > 0) {
                        let resMeasure = rtdb.findMeasureByUrl(reqMeasure.url);
                        if (resMeasure) {
                            data.push(resMeasure);
                        }
                    } else if (reqMeasure.neno.length > 0 && reqMeasure.code.length > 0) {
                        let resMeasure = rtdb.findMeasureByNenoCode(reqMeasure.neno, reqMeasure.code);
                        if (resMeasure) {
                            data.push(resMeasure);
                        }
                    }
                }
                return data;
            }(),
        };
    } else {
        return {};
    }
};

Cc4kRtService.dealRequestRtdata = function(req, res) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'POWERED-BY-AID,Content-Type,Content-Length,Authorization,Accept,X-Requested-With');
        res.setHeader('Access-Control-Max-Age', '30');
        res.writeHead(200);
        res.end();
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', function(chunk) {
            body += chunk;
        });
        req.on('end', function() {
            let rtObjects = null;
            if (body) {
                try {
                    let reqBody = JSON.parse(body);
                    rtObjects = Cc4kRtService.getRtObjects(reqBody);
                } catch (e) {
                    r = null;
                    console.log('error: JSON.parse(body)');
                }
            }
            if (rtObjects) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'POWERED-BY-AID,Content-Type,Content-Length,Authorization,Accept,X-Requested-With');
                res.setHeader('Access-Control-Max-Age', '30');
                res.writeHead(200);
                // res.write('HELLO');
                res.end(JSON.stringify(rtObjects));
            } else {
                res.writeHead(404);
                res.end();
            }
        });
    } else {
        res.writeHead(404);
        res.end();
    }
};

Cc4kRtService.dealRequestYk = function(req, res) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'POWERED-BY-AID,Content-Type,Content-Length,Authorization,Accept,X-Requested-With');
        res.setHeader('Access-Control-Max-Age', '30');
        res.writeHead(200);
        res.end();
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', function(chunk) {
            body += chunk;
        });
        req.on('end', function() {
            console.log(body);
            let reqSession = null;
            let reqStructtype = null;
            let reqMeasures = null;
            if (body) {
                try {
                    let reqBody = JSON.parse(body);
                    reqSession = reqBody.session;
                    reqStructtype = reqBody.structtype;
                    reqMeasures = reqBody.params;
                } catch (e) {
                    console.log('error: JSON.parse(body)');
                }
            }
            if (reqSession && reqStructtype && reqMeasures) {
                let resMeasures = {
                    session: reqSession,
                    structtype: reqStructtype,
                    data: function() {
                        for (let i = 0; i < reqMeasures.length; i++) {
                            let reqMeasure = reqMeasures[i];
                            let resMeasure = null;
                            if (reqMeasure.hasOwnProperty('neno')) {
                                let neno = reqMeasure.neno;
                                let code = reqMeasure.code;
                                resMeasure = rtdb.findMeasureByNenoCode(neno, code);
                            } else if (reqMeasure.hasOwnProperty('mid')) {
                                let mid = reqMeasure.mid;
                                resMeasure = rtdb.findMeasureById(mid);
                            }
                            let measureBuffer = Buffer.alloc(BasDefine.PACKAGE_SIMPLE_REQ_LEN - 128);
                            let iOffset = 0;
                            let reqValue = reqMeasure.v;
                            if (resMeasure !== null && reqValue) {
                                measureBuffer.writeIntLE(resMeasure.id, iOffset, 6, true);
                                iOffset += 8;
                                if (typeof(reqValue) === 'number') {
                                    if (Number.isInteger(reqValue)) {
                                        measureBuffer.writeIntLE(reqValue, iOffset, 6, true);
                                        iOffset += 8;
                                    } else {
                                        measureBuffer.writeDoubleLE(reqValue, iOffset, true);
                                        iOffset += 8;
                                    }
                                } else {
                                    let sValue = String(reqValue);
                                    let iLength = sValue.length > 127 ? 127 : sValue.length;
                                    measureBuffer.write(sValue, iOffset, iLength); // Default: 'utf8'
                                    measureBuffer[iOffset + iLength] = 0;
                                    iOffset += 128;
                                }
                                measureBuffer.writeIntLE(resMeasure.refreshTime, iOffset, 6, true);
                                iOffset += 8;
                                measureBuffer.writeIntLE(resMeasure.res, iOffset, 6, true);
                                iOffset += 8;
                                let tableName = rtdb.getMeasureTableNameById(resMeasure.id);
                                let packet = BasPacket.rtReqUpdkeyPacket.toPacket(tableName, resMeasure.id, '', measureBuffer);
                                let iSent = _rtbusProtocol.sendPacket(packet);
                                reqMeasure.state = iSent >= 0 ? 0 : -1;
                                console.log('_rtbusProtocol.sendPacket(rtReqUpdkeyPacket): ', iSent);
                            } else {
                                reqMeasure.state = -2;
                            }
                        }
                        return reqMeasures;
                    }(),
                };
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'POWERED-BY-AID,Content-Type,Content-Length,Authorization,Accept,X-Requested-With');
                res.setHeader('Access-Control-Max-Age', '30');
                res.writeHead(200);
                // res.write('HELLO');
                res.end(JSON.stringify(resMeasures));
            } else {
                res.writeHead(404);
                res.end();
            }
        });
    } else {
        res.writeHead(404);
        res.end();
    }
};

// ### rtbus protocol
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
Cc4kRtService.dealRtbusData = function fnDealRt(msgObj) {
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
            measure.id = buf.readIntLE(iOffset, 6, true);
            iOffset += 8;
            measure.value = buf.readIntLE(iOffset, 6, true);
            iOffset += 8;
            measure.refreshTime = Cc4kRtService.utc2Locale(buf.readIntLE(iOffset, 6, true));
            iOffset += 8;
            // measure.refreshTime =Cc4kRtService.utc2Locale(new Date().getTime()); iOffset += 8; // 测试
            measure.res = buf.readIntLE(iOffset, 6, true);
            iOffset += 8;
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
            measure.id = buf.readIntLE(iOffset, 6, true);
            iOffset += 8;
            measure.value = (buf.readDoubleLE(iOffset, true)).toFixed(2);
            iOffset += 8;
            measure.refreshTime = Cc4kRtService.utc2Locale(buf.readIntLE(iOffset, 6, true));
            iOffset += 8;
            // measure.refreshTime = Cc4kRtService.utc2Locale(new Date().getTime()); iOffset += 8; // 测试
            measure.res = buf.readIntLE(iOffset, 6, true);
            iOffset += 8;
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
            measure.id = buf.readIntLE(iOffset, 6, true);
            iOffset += 8;
            measure.value = buf.toString('utf8', iOffset, iOffset + 128);
            iOffset += 128;
            measure.refreshTime = Cc4kRtService.utc2Locale(buf.readIntLE(iOffset, 6, true));
            iOffset += 8;
            // measure.refreshTime = Cc4kRtService.utc2Locale(new Date().getTime()); iOffset += 8; // 测试
            measure.res = buf.readIntLE(iOffset, 6, true);
            iOffset += 8;
            inMeasures.push(measure);
        }
        rtdb.receivedMeasures(inMeasures);
    }
};

Cc4kRtService.initRtWebSocket = function(rtWebSocketPort) {
    let clientId = 0;
    let clientReceivedCount = 0;
    let serverSentBytes = 0;
    let wss = new WebSocketServer({port: rtWebSocketPort});

    let sendRtBody = function(ws, sendBody) {
        let data = sendBody.data;
        if (data.length > 0) {
            let iBegin = 0;
            while (iBegin < data.length) {
                sendBody.data = data.slice(iBegin, iBegin + 50);
                let sSendBody = JSON.stringify(sendBody);
                ws.send(sSendBody);
                serverSentBytes += sSendBody.length;
                iBegin += 50;
            }
        } else {
            let sSendBody = JSON.stringify(sendBody);
            ws.send(sSendBody);
            serverSentBytes += sSendBody.length;
        }
    };

    wss.on('connection', function(ws) {
        let thisId = ++clientId;
        console.log('Client #%d connected', thisId);
        serverSentBytes = 0;
        clientReceivedCount = 0;

        ws.on('message', function(data) {
            clientReceivedCount += data.length;
            try {
                let reqBody = JSON.parse(data);
                if (reqBody.structtype === 'rtlogin_v101') {
                    let sendBody = {
                        session: reqBody.session,
                        structtype: reqBody.structtype,
                        reason: '',
                        data: [],
                    };
                    sendBody.reason = 'begin';
                    sendRtBody(ws, sendBody);
                    sendBody.reason = 'data';
                    // monsb
                    sendBody.data = rtdb.monsbManager.measures.length > 512 ? rtdb.monsbManager.measures.slice(0, 512) : rtdb.monsbManager.measures;
                    sendRtBody(ws, sendBody);
                    // ycadd
                    sendBody.data = rtdb.ycaddManager.measures.length > 256 ? rtdb.ycaddManager.measures.slice(0, 256) : rtdb.ycaddManager.measures;
                    sendRtBody(ws, sendBody);
                    // straw
                    sendBody.data = rtdb.strawManager.measures.length > 128 ? rtdb.strawManager.measures.slice(0, 128) : rtdb.strawManager.measures;
                    sendRtBody(ws, sendBody);
                    sendBody.reason = 'end';
                    sendRtBody(ws, sendBody);
                } else {
                    sendRtBody(ws, Cc4kRtService.getRtObjects(reqBody));
                }
            } catch (e) {
                console.log('error: JSON.parse(data)');
            }
        });

        ws.on('close', function() {
            console.log('Client #%d disconnected', thisId);
        });

        ws.on('error', function(e) {
            console.log('Client #%d error: %s', thisId, e.message);
        });
    });
    console.log('WebSocketServer running at http://127.0.0.1:%d/', rtWebSocketPort);

    setInterval(function() {
        console.log('Client clientReceivedCount: #%d Mb - serverSentBytes: #%d Mb', clientReceivedCount / 1024 / 1024, serverSentBytes / 1024 / 1024);
    }, 3000);
};
