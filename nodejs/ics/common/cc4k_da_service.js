'use strict';

const rtdb = require('./../../../assets/common/cc4k/rtdb.js');

const ProtocolCc4000 = require('./../../common/csm/protocol_cc4000.js');
const BasProtocol = ProtocolCc4000;
const BasDefine = ProtocolCc4000.BasDefine;
const BasPacket = ProtocolCc4000.BasPacket;

let _daProtocol = new BasProtocol();

exports = module.exports = Cc4kDaService;

function Cc4kDaService() {

}

Cc4kDaService.init = function(httpServer, option={
    LocalIpAddress: '127.0.0.1',
    LocalPort: 5697,
    RemotePort: 6697,
    RemoteIpAddress: '127.0.0.1',
}) {
    _daProtocol.on(BasPacket.rtAnsDaDetailPacket.commandCode, fnDealAnsDaDetail);
    _daProtocol.on(BasPacket.rtDataDaDetailPacket.commandCode, fnDealDataDaDetail);
    _daProtocol.onAllPacket(function(command, msgObj) {
        console.log(command, msgObj);
    });

    _daProtocol.start(option);
    httpServer.route.all(/\/(.){0,}\.rtlog\.cgi/, Cc4kDaService.dealRequestDa);
};


// ### deal http rtlog request
let currentReqRtlog = null;
let currentResRtlog = null;
let currentTimeout = null;

/**
 * reqAsyncRtlog
 * @param {req} req
 * @param {res} res
 */
function reqAsyncRtlog(req, res) {
    currentReqRtlog = req;
    currentResRtlog = res;
    currentTimeout = setTimeout(function() {
        if (currentResRtlog !== null) {
            // 504 : 作为网关或者代理工作的服务器尝试执行请求时，未能及时从上游服务器
            let resMeasures = {
                session: 'sbid=0001;xxx=adfadsf',
                structtype: 'rtlog_v001',
                state: 504,
                logcount: 0,
                data: [],
            };
            currentResRtlog.writeHead(200);
            // res.write('HELLO');
            currentResRtlog.end(JSON.stringify(resMeasures));
            currentResRtlog = null;
            currentReqRtlog = null;
        }
    }, 10000);
}

// ### da protocol
/**
 * fnDealDaDetail
 * @param {object} msgObj
 */
function fnDealAnsDaDetail(msgObj) {
    console.log('_daProtocol.fnDealAnsDaDetail.begin: ');
    let iStateCode = msgObj.StateCode;
    // let iCount = msgObj.Count;
    if (iStateCode !== 0) {
        if (currentTimeout !== null) {
            clearTimeout(currentTimeout);
            currentTimeout = null;
        }
        if (currentResRtlog !== null) {
            let resMeasures = {
                session: 'sbid=0001;xxx=adfadsf',
                structtype: 'rtlog_v001',
                state: iStateCode,
                logcount: 0,
                data: [],
            };
            currentResRtlog.writeHead(200);
            // res.write('HELLO');
            currentResRtlog.end(JSON.stringify(resMeasures));
            currentResRtlog = null;
            currentReqRtlog = null;
        }
        console.log('_daProtocol.fnDealAnsDaDetail - StateCode: ', iStateCode);
    }
    console.log('_daProtocol.fnDealDaDetail.begin: ');
}

/**
 * fnDealDaDetail
 * @param {object} msgObj
 */
function fnDealDataDaDetail(msgObj) {
    if (currentTimeout !== null) {
        clearTimeout(currentTimeout);
        currentTimeout = null;
    }
    console.log('_daProtocol.fnDealDataDaDetail.begin: ');
    let iOffset = msgObj.offset;
    let iEnd = msgObj.end;
    let buf = msgObj.buffer;
    let iStateCode = msgObj.StateCode;
    if (iStateCode !== 0) {
        if (currentTimeout !== null) {
            clearTimeout(currentTimeout);
            currentTimeout = null;
        }
        if (currentResRtlog !== null) {
            let resMeasures = {
                session: 'sbid=0001;xxx=adfadsf',
                structtype: 'rtlog_v001',
                state: iStateCode,
                logcount: 0,
                data: [],
            };
            currentResRtlog.writeHead(200);
            // res.write('HELLO');
            currentResRtlog.end(JSON.stringify(resMeasures));
            currentResRtlog = null;
            currentReqRtlog = null;
        }
        console.log('_daProtocol.fnDealDataDaDetail - StateCode: ', iStateCode);
        return;
    }
    let iCount = msgObj.Count;
    let iLength = iEnd > buf.length ? buf.length : iEnd;
    let iIndex = 0;
    let data = [];
    while (iOffset + 8 < iLength) {
        let iMid = buf.readIntLE(iOffset, 6, true);
        iOffset += 8;
        let measure = rtdb.findMeasureById(iMid);
        let measure2 = {id: iMid};
        if (measure !== null) {
            measure2['neno'] = measure.neno;
            measure2['code'] = measure.code;
        }
        let iType = rtdb.getMeasureTypeById(iMid);
        let measureLog = {
            measure: measure2,
            logtype: 2,
            log: [],
            state: 0,
        };
        switch (iType) {
        case rtdb.EnumMeasureType.monsb:
            if (iOffset + iCount * 8 < iLength) {
                iIndex = 0;
                while (iIndex < iCount) {
                    let value = buf.readIntLE(iOffset, 6, true);
                    iOffset += 8;
                    measureLog.log.push(value);
                    iIndex += 1;
                }
            } else {
                console.log(iMid, ' iOffset + iCount * 8 < iLength : fail. ');
            }
            break;
        case rtdb.EnumMeasureType.ycadd:
            if (iOffset + iCount * 8 < iLength) {
                iIndex = 0;
                while (iIndex < iCount) {
                    let value = (buf.readDoubleLE(iOffset, true)).toFixed(2);
                    iOffset += 8;
                    measureLog.log.push(value);
                    iIndex += 1;
                }
            } else {
                console.log(iMid, ' iOffset + iCount * 8 < iLength : fail. ');
            }
            break;
        case rtdb.EnumMeasureType.straw:
            if (iOffset + iCount * 128 < iLength) {
                iIndex = 0;
                while (iIndex < iCount) {
                    let value = buf.toString('utf8', iOffset, iOffset + 128);
                    iOffset += 128;
                    measureLog.log.push(value);
                    iIndex += 1;
                }
            } else {
                console.log(iMid, ' iOffset + iCount * 8 < iLength : fail. ');
            }
            break;
        default:
            break;
        }
        data.push(measureLog);
    }
    if (currentResRtlog !== null) {
        let resMeasures = {
            session: 'sbid=0001;xxx=adfadsf',
            structtype: 'rtlog_v001',
            state: 0,
            logcount: iCount,
            data: data,
        };
        currentResRtlog.writeHead(200);
        // res.write('HELLO');
        currentResRtlog.end(JSON.stringify(resMeasures));
        currentResRtlog = null;
        currentReqRtlog = null;
    }
    console.log('_daProtocol.fnDealDataDaDetail.end.');
}


// ### deal http log

Cc4kDaService.dealRequestDa = function(req, res) {
    if (currentReqRtlog !== null || currentResRtlog !== null) {
        // 由于临时的服务器维护或者过载，服务器当前无法处理请求。这个状况是暂时的，并且将在一段时间以后恢复。
        res.writeHead(503);
        res.end();
        return;
    }
    if (!_daProtocol.channel.isOpen()) {
        // 通用错误消息，服务器遇到了一个未曾预料的状况
        res.writeHead(500);
        res.end();
        return;
    }
    if (req.method === 'POST') {
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
                if (reqMeasures.length > 0) {
                    let reqMeasure = reqMeasures[0];
                    let measures = reqMeasure.measures;
                    let mids = [];
                    for (let i = 0; i < measures.length; i++) {
                        let measure = measures[i];
                        let measure2 = rtdb.findMeasureByNenoCode(measure.neno, measure.code);
                        if (measure2 !== null) {
                            mids.push(measure2.id);
                        }
                    }
                    if (mids.length > 0) {
                        let dtbegin = reqMeasure.dtbegin;
                        let dtend = reqMeasure.dtend;
                        let iInterval = reqMeasure.interval;
                        let keyListBuffer = Buffer.alloc(mids.length * 8);
                        let iOffset = 0;
                        for (let i = 0; i < mids.length; i++) {
                            keyListBuffer.writeIntLE(mids[i], iOffset, 6, true);
                            iOffset += 8;
                        }
                        let packet = BasPacket.rtReqDaDetailPacket.toPacket(dtbegin, dtend, iInterval, mids.length, 8, keyListBuffer);
                        let iSent = _daProtocol.sendPacket(packet);
                        console.log('_daProtocol.sendPacket(rtReqDaDetailPacket): ', iSent);
                        reqAsyncRtlog(req, res);
                    } else {
                        // 在请求头Expect中指定的预期内容无法被服务器满足
                        res.writeHead(417);
                        res.end();
                    }
                } else {
                    // 客户端已经要求文件的一部分（Byte serving），但服务器不能提供该部分
                    res.writeHead(416);
                    res.end();
                }
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
