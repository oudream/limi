'use strict';

let CjChannelTcpclient = require('./../cjs/cjchannel_tcpclient');
let CjChannelUdp = require('./../cjs/cjchannel_udp');
let fs = require('fs');

exports = module.exports = BasProtocol;

/**
 * BasDefine
 * @constructor
 */
function BasDefine() {
}

BasDefine.PACKAGE_OK = 0;
BasDefine.PACKAGE_ERROR = 300;
BasDefine.PACKAGE_REQ_START = 0xE9;
BasDefine.PACKAGE_REQ_END = 0xEA;
BasDefine.PACKAGE_REQ_TRANS = 0xE8;
BasDefine.PACKAGE_REQ_CRC = 0x7A;
BasDefine.PACKAGE_ITEM_REQ_LEN = 4;

BasDefine.OMC_OK = 0;
// 一般的响应内存长度
BasDefine.PACKAGE_SIMPLE_REQ_LEN = 512;
BasDefine.PACKAGE_MAX_REQ_LEN = 2048;
// 接收缓冲池打消
BasDefine.PACKAGE_MAX_BUF_SIZE = 30000;

// 无基本信息
BasDefine.OMC_OK_WITHINFO = 100;
BasDefine.OMC_ERROR = 300;
BasDefine.OMC_NE_NO_EXIST = 301;
BasDefine.OMC_PARAM_ERROR = 302;
BasDefine.OMC_ALARM_NO_LEN = 4;
BasDefine.OMC_ADDR_LEN = 32;
BasDefine.OMC_NE_LEN = 32;
BasDefine.OMC_NORMAL_INFO_LEN = 32;
BasDefine.OMC_PHYSICAL_NO_LEN = 48;
// 检查过期数据 1小时检测一次 6秒的60倍
BasDefine.OMC_CHECK_OVER_TM = 60;
// package type=
// BasDefine.OMC_REQ_HEARTBEAT              =   0x11
BasDefine.OMC_REQ_LOGIN = 0x12;
BasDefine.OMC_REQ_UPD_DATA = 0x13;
BasDefine.OMC_REQ_MOD_ALARM = 0x14;
BasDefine.OMC_REQ_ALARM_INFO_BY_ADDR = 0x15;
BasDefine.OMC_REQ_ALARM_INFO_BY_IDX = 0x16;
BasDefine.OMC_REQ_EXIT = 0x17;

BasDefine.OMC_ANS_LOGIN = 0x22;
BasDefine.OMC_ANS_UPD_DATA = 0x23;
BasDefine.OMC_ANS_MOD_ALARM = 0x24;
BasDefine.OMC_ANS_ALARM_INFO_BY_ADDR = 0x25;
BasDefine.OMC_ANS_ALARM_INFO_BY_IDX = 0x26;
BasDefine.OMC_ANS_EXIT = 0x27;

// modify action for alarm
BasDefine.OMC_CONFIRM_ALARM = 1;  // 告警确认
BasDefine.OMC_INVOKE_CONFIRM_ALARM = 2;  // 取消确认
BasDefine.OMC_ERASE_ALARM = 3;  // 告警清除
BasDefine.OMC_SET_ALARM = 4;  // 告警同步
BasDefine.OMC_CLEAR_ALARM = 5;  // 告警恢复

// rt 命令
BasDefine.RTDB_REQ_HEARTBEAT = 23;
BasDefine.RTDB_REQ_OPEN_TABLE = 1;
BasDefine.RTDB_REQ_SAVE_TABLE = 17;
BasDefine.RTDB_REQ_CLOSE_TABLE = 18;
BasDefine.RTDB_REQ_RCDCNT = 2;
BasDefine.RTDB_REQ_RCDLEN = 3;
BasDefine.RTDB_REQ_ADDRCD = 4;
BasDefine.RTDB_REQ_DELRCD_BY_KEY = 5;
BasDefine.RTDB_REQ_DELRCD_BY_IDX = 6;
BasDefine.RTDB_REQ_DELALL = 7;
BasDefine.RTDB_REQ_UPDRCD_BY_KEY = 8;
BasDefine.RTDB_REQ_UPDRCD_BY_IDX = 9;
BasDefine.RTDB_REQ_GETRCD_BY_KEY = 10;
BasDefine.RTDB_REQ_GETRCD_BY_IDX = 11;
BasDefine.RTDB_REQ_GET_RCD_SEG = 12;
BasDefine.RTDB_REQ_GET_ALL_RCD = 13;
BasDefine.RTDB_REQ_GET_RCD_LIST = 26;
BasDefine.RTDB_REQ_SUBSCRIBE = 14;
// BasDefine.RTDB_REQ_RAW_SUBSCRIBE         = 23;
BasDefine.RTDB_REQ_SYNC = 16;
BasDefine.RTDB_REQ_GET_COLUMN_INFO = 19;
BasDefine.RTDB_REQ_GETRCD_BY_COND = 20;
BasDefine.RTDB_REQ_UPDRCD_BY_COND = 21;
BasDefine.RTDB_REQ_DELRCD_BY_COND = 22;
BasDefine.RTDB_REQ_UPD_RCD_LIST = 27;
BasDefine.RTDB_REQ_LOGIN = 25;
BasDefine.RTDB_REQ_UPD_CFG = 28;

// rt 命令回复
BasDefine.RTDB_ANS_HEARTBEAT = 43;
BasDefine.RTDB_ANS_OPEN_TABLE = 21;
BasDefine.RTDB_ANS_SAVE_TABLE = 37;
BasDefine.RTDB_ANS_CLOSE_TABLE = 38;
BasDefine.RTDB_ANS_RCDCNT = 22;
BasDefine.RTDB_ANS_RCDLEN = 23;
BasDefine.RTDB_ANS_ADDRCD = 24;
BasDefine.RTDB_ANS_DELRCD_BY_KEY = 25;
BasDefine.RTDB_ANS_DELRCD_BY_IDX = 26;
BasDefine.RTDB_ANS_DELALL = 27;
BasDefine.RTDB_ANS_UPDRCD_BY_KEY = 28;
BasDefine.RTDB_ANS_UPDRCD_BY_IDX = 29;
BasDefine.RTDB_ANS_GETRCD_BY_KEY = 30;
BasDefine.RTDB_ANS_GETRCD_BY_IDX = 31;
BasDefine.RTDB_ANS_GET_RCD_SEG = 32;
BasDefine.RTDB_ANS_GET_RCD_LIST = 46;
BasDefine.RTDB_ANS_FIRST_RCD_SEG = 33;
BasDefine.RTDB_ANS_NEXT_RCD_SEG = 34;
BasDefine.RTDB_ANS_SUBSCRIBE = 35;
// BasDefine.RTDB_ANS_RAW_SUBSCRIBE         = 43;
BasDefine.RTDB_ANS_SYNC = 36;
BasDefine.RTDB_ANS_GET_COLUMN_INFO = 39;
BasDefine.RTDB_ANS_GETRCD_BY_COND = 40;
BasDefine.RTDB_ANS_UPDRCD_BY_COND = 41;
BasDefine.RTDB_ANS_DELRCD_BY_COND = 42;
BasDefine.RTDB_ANS_UPD_RCD_LIST = 47;
BasDefine.RTDB_ANS_LOGIN = 45;
BasDefine.RTDB_ANS_UPD_CFG = 48;

// rt
BasDefine.RTDB_MAX_TABLE_NAME = 64;
BasDefine.RTDB_MAX_COLUMN_NAME = 64;

/**
 * UserException
 * @param {String}message
 * @constructor
 */
function UserException(message) {
    this.message = message;
    this.name = 'UserException';
}

/**
 * BasAttr
 * @param {String}name
 * @param {Number}size
 * @param {Number}type
 * @param {String}encoding
 * @constructor
 */
function BasAttr(name, size, type, encoding) {
    if (!name) {
        throw new UserException('invalid name');
    }
    this.name = name;
    this.size = size;
    this.type = type;
    this.encoding = encoding;
}

BasAttr.CI_Type_None = 0;
BasAttr.CI_Type_int = 1;
BasAttr.CI_Type_double = 2;
BasAttr.CI_Type_string = 3;

/**
 * BasPacket
 * @constructor
 */
function BasPacket() {
    this.commandAttrs = [];
    this.commandSeq = 0;
    this.commandCode = 0;
    this.request = 0;
}

BasPacket.packets = new Map();

BasPacket.prototype.toBuffer = function(...args) {
    let self = this;
    let commandAttrs = self.commandAttrs;
  // :todo.best : compatible : arguments.length != commandAttrs.length
    if (arguments.length !== commandAttrs.length) {
        return Buffer.alloc(0);
    }
    let iTotalSize = self.getTotalSize();
    if (iTotalSize <= 0) {
        return Buffer.alloc(0);
    }
    let rBuf = Buffer.alloc(self.getTotalSize());
    let attr;
    let value;
    let idx = 0;
    let iOffset = 0;
    while (idx < commandAttrs.length) {
        attr = commandAttrs[idx];
        value = args[idx];
        switch (attr.type) {
        case BasAttr.CI_Type_int:
            rBuf.writeIntLE(value, iOffset, attr.size, true);
            break;
        case BasAttr.CI_Type_string:
            if (value.length > attr.size) {
                throw new UserException('BasPacket: value.length > attr.size');
            }
            rBuf.write(value, iOffset, attr.size);// Default: 'utf8'
            rBuf[iOffset + value.length] = 0;
            break;
        default:

            break;
        }
        iOffset += attr.size;
        ++idx;
    }
    return rBuf;
};

BasPacket.prototype.fromBuffer = function(buf, iStart) {
    let self = this;
    let commandAttrs = self.commandAttrs;
    let r = {};
    let iTotalSize = self.getTotalSize();
    if (!buf || iStart + iTotalSize > buf.length - 2) {
        console.log('BasPacket.prototype.fromBuffer : buf length no enough, ', iStart + iTotalSize, buf.length);
        return r;
    }
    let attr;
    let value;
    let idx = 0;
    let iOffset = iStart;
    let iZeroIndex = 0;
    while (idx < commandAttrs.length) {
        attr = commandAttrs[idx];
        switch (attr.type) {
        case BasAttr.CI_Type_int:
            value = buf.readIntLE(iOffset, attr.size, true);
            break;
        case BasAttr.CI_Type_string:
            value = buf.toString('utf8', iOffset, iOffset + attr.size);
            iZeroIndex = value.indexOf('\0');
            if (iZeroIndex >= 0) {
                value = value.substring(0, iZeroIndex);
            }
            break;
        default:
        //
            break;
        }
        Object.defineProperty(r, attr.name, {
            configurable: true,
            enumerable: true,
            value: value,
        });
        iOffset += attr.size;
        ++idx;
    }
    r.buffer = buf;
    r.offset = iOffset;
    return r;
};

BasPacket.prototype.add = function(...args) {
    if (arguments.length < 1) {
        throw new UserException('BasPacket.prototype.add arguments length<1!');
    }
    let name = args[0];
    let size = 4;
    if (arguments.length > 1) {
        size = args[1];
    }
    let type;
    if (arguments.length > 2) {
        type = args[2];
    } else {
        if (size === 4) {
            type = BasAttr.CI_Type_int;
        } else if (size > 8) {
            type = BasAttr.CI_Type_string;
        } else {
            throw new UserException('BasPacket.prototype.add arguments length<3!');
        }
    }
    let encoding = 'ascii';
    if (arguments.length > 3) {
        encoding = args[3];
    }

    this.commandAttrs.push(new BasAttr(name, size, type, encoding));
};

BasPacket.prototype.getTotalSize = function() {
    let iSize = 0;
    let self = this;
    let commandAttrs = self.commandAttrs;
    let attr;
    let idx = 0;
    while (idx < commandAttrs.length) {
        attr = commandAttrs[idx++];
        iSize += attr.size;
    }
    return iSize;
};

BasPacket.prototype.preparePacket = function(buf) {
    if (!buf || buf.length === 0) {
        return Buffer.allocUnsafe(0);
    }
    let iOldSize = buf.length;
    let r = Buffer.allocUnsafe(iOldSize * 2);
    let i = 1;
    let j = 1;
    r[0] = buf[0];
    while (i < iOldSize - 1) {
        if (buf[i] >= BasDefine.PACKAGE_REQ_TRANS) {
            r[j] = BasDefine.PACKAGE_REQ_TRANS;
            j++;
            r[j] = buf[i] - BasDefine.PACKAGE_REQ_TRANS;
        } else {
            r[j] = buf[i];
        }
        i++;
        j++;
    }
    r[j] = buf[iOldSize - 1];
    let iNewSize = j + 1;
  // return r.slice(0, iNewSize);
    let iCrc = 0;
    for (let h = 1; h < iNewSize - 2; h++) {
        iCrc = (iCrc + r[h]) & 0xff;
    }
    r[iNewSize - 2] = BasDefine.PACKAGE_REQ_CRC - iCrc;
    return r.slice(0, iNewSize);
};

BasPacket.prototype.encodePacket = function(buf) {
    if (!buf || buf.length === 0) {
        return Buffer.allocUnsafe(0);
    }
    let iOldSize = buf.length;
  // total length : 1 + 3 + 3 + 3 + 1 + 1
    let r = Buffer.allocUnsafe(iOldSize + 1 + 4 + 4 + 4 + 1 + 1);

    let iOffset = 0;
    r[iOffset] = BasDefine.PACKAGE_REQ_START;
    iOffset += 1;

    r.writeIntLE(this.commandSeq, iOffset, BasDefine.PACKAGE_ITEM_REQ_LEN, true);
    iOffset += BasDefine.PACKAGE_ITEM_REQ_LEN;

    r.writeIntLE(this.commandCode, iOffset, BasDefine.PACKAGE_ITEM_REQ_LEN, true);
    iOffset += BasDefine.PACKAGE_ITEM_REQ_LEN;

    r.writeIntLE(this.request, iOffset, BasDefine.PACKAGE_ITEM_REQ_LEN, true);
    iOffset += BasDefine.PACKAGE_ITEM_REQ_LEN;

    buf.copy(r, iOffset);
    iOffset += buf.length;

    r[iOffset] = 0;// crc
    iOffset += 1;

    r[iOffset] = BasDefine.PACKAGE_REQ_END;
    iOffset += 1; // r.length

    return this.preparePacket(r);
};

BasPacket.prototype.setCommand = function(iCommandSeq, iCommand) {
    this.commandSeq = iCommandSeq;
    this.commandCode = iCommand;
    this.request = this.getTotalSize();
    BasPacket.packets.set(iCommand, this);
};

BasPacket.prototype.toPacket = function(...args) {
    return this.encodePacket(BasPacket.prototype.toBuffer.apply(this, args));
};

/**
 * BasParser
 * @constructor
 */
function BasParser() {
  // recvCache : recv data -> push to recvCache
    this.recvCache = Buffer.allocUnsafeSlow(BasDefine.PACKAGE_MAX_BUF_SIZE);
    this.recvOffset = 0;
    this.dealOffset = 0;
  // deal recvCache and take msg (one Complete Packet msgLength) to msgCache
    this.msgCache = Buffer.allocUnsafeSlow(BasDefine.PACKAGE_MAX_REQ_LEN);
    this.msgLength = 0;
    this.onReceivedMsg = 0;
}

BasParser.prototype.doReceived = function(data) {
    if (!data) {
        throw new UserException('BasParser.prototype.handleRecv(buf) : invalid buf!');
    }
    if (data.length > BasDefine.PACKAGE_MAX_BUF_SIZE - (BasDefine.PACKAGE_MAX_REQ_LEN * 2)) {
        console.log('BasParser.prototype.handleRecv(buf) : buf.length > BasDefine.PACKAGE_MAX_BUF_SIZE!');
        return;
    }
    if (data.length > (BasDefine.PACKAGE_MAX_BUF_SIZE - this.recvOffset)) {
        let iNoDeal = this.recvOffset - this.dealOffset;
        if (iNoDeal > BasDefine.PACKAGE_MAX_REQ_LEN) {
            this.recvOffset = 0;
        } else {
            this.recvCache.copy(this.recvCache, 0, this.dealOffset, this.recvOffset);
            this.recvOffset = iNoDeal;
        }
        this.dealOffset = 0;
    }
    data.copy(this.recvCache, this.recvOffset);
    this.recvOffset += data.length;
    this.dealCache();
};

BasParser.prototype.dealCache = function() {
    let index = this.dealOffset;
    let end = this.recvOffset;
    let buf = this.recvCache;
    while (index < end) {
        if (buf[index] === BasDefine.PACKAGE_REQ_START) {
            let iStartPos = index;
            let iEndPos = 0;
            let j = index + 1;
            while ((j < end) && (iEndPos === 0)) {
                if ((buf[j]) === BasDefine.PACKAGE_REQ_START) {
                    iStartPos = j;
                }
                if (buf[j] === BasDefine.PACKAGE_REQ_END) {
                    iEndPos = j;
                }
                j++;
            }

            if (iEndPos === 0) {
        // nothing to do, wait to receive all bytes
                return;
            } else {
                let iMsgLength = iEndPos - iStartPos + 1;
                if (iMsgLength <= BasDefine.PACKAGE_MAX_REQ_LEN) {
                    let iMsgEnd = this.repairMsg(iStartPos, iEndPos + 1);
                    if (this.onReceivedMsg) {
                        this.onReceivedMsg(this.msgCache, iMsgEnd);
                    }
          // BasPacket.dealPacket(this.msgCache, iMsgEnd);
                }
                index = iEndPos;
                if (iEndPos > 0) {
                    this.dealOffset = iEndPos + 1;
                }
            }
        }
        index++;
    }
};

BasParser.prototype.repairMsg = function(iStartPos, iEndPos) {
    let buf = this.recvCache;
    let msgBuf = this.msgCache;
    msgBuf[0] = buf[iStartPos];
    let i = iStartPos + 1;
    let j = 1;
    for (; i < iEndPos - 1; i++, j++) {
        if (buf[i] === BasDefine.PACKAGE_REQ_TRANS) {
            msgBuf[j] = buf[i] + buf[i + 1];
            i++;
        } else {
            msgBuf[j] = buf[i];
        }
    }
    msgBuf[j] = buf[i];
    j++;
    this.msgLength = j;
    let iCrc = 0;
    for (let h = 1; h < j - 2; h++) {
        iCrc = (iCrc + msgBuf[h]) & 0xff;
    }
    iCrc = BasDefine.PACKAGE_REQ_CRC - iCrc;
    if (iCrc !== msgBuf[j - 2]) {
    // 校验失败
        console.log('BasParser.prototype.repairMsg(iStartPos, iEndPos), crc invalid!');
    }
    return j;
};

/**
 *
 * @constructor
 */
function BasProtocol(bIsTcp = true) {
    let self = this;

    let channelBase;
    if (bIsTcp) {
        channelBase = new CjChannelTcpclient();
    } else {
        channelBase = new CjChannelUdp();
    }
    channelBase.isAutoOpen = true;
    channelBase.isAutoHeartbeat = false;

    let basParser = new BasParser();
    basParser.onReceivedMsg = function(buf, iEnd) {
        self.dealPacket(buf, iEnd);
    };

    channelBase.onReceived = function(data) {
        basParser.doReceived(data);
    };

    this.fns = new Map();
    this.fnAllPacket = null;
    this.channel = channelBase;
    this.parser = basParser;
}

/**
 * start
 * @param {Object}option = {RemoteIpAddress: '127.0.0,.1', RemotePort: 5556};
 */
BasProtocol.prototype.start = function(option) {
    this.channel.open(option);
    this.checkProtocol(1000 * 10);
};

BasProtocol.prototype.stop = function() {
    this.channel.close();
};

BasProtocol.prototype.dealPacket = function(buf, iEnd) {
    if (!buf || buf.length < iEnd || buf.length < 1 + 4 + 4 + 4 + 1 + 1) {
        console.log('BasProtocol.prototype.dealPacket buf:', buf ? buf.length : null);
        return;
    }

    let iOffset = 0;
  // let pkStart = buf[iOffset];// BasDefine.PACKAGE_REQ_START;
    iOffset += 1;

  // let pkCommandSeq = buf.readIntLE(iOffset, true);
    iOffset += BasDefine.PACKAGE_ITEM_REQ_LEN;

    let pkCommand = buf.readIntLE(iOffset, true);
    iOffset += BasDefine.PACKAGE_ITEM_REQ_LEN;

  // let pkRequest = buf.readIntLE(iOffset, true);
    iOffset += BasDefine.PACKAGE_ITEM_REQ_LEN;

    let packet = BasPacket.packets.get(pkCommand);
    if (packet) {
        let msgObj = packet.fromBuffer(buf, iOffset);
        this.dispatch(pkCommand, msgObj);
        console.log('BasPacket.dealPacket : pkCommand [', pkCommand, '] dispatch!');
    } else {
        console.log('BasPacket.dealPacket : pkCommand [', pkCommand, '] is undefined!');
    }

  // let pkCrc = buf[iEnd - 2];// crc

  // let pkEnd = buf[iEnd - 1];// = BasDefine.PACKAGE_REQ_END;
};

BasProtocol.prototype.onAllPacket = function(fn) {
    this.fnAllPacket = fn;
};

BasProtocol.prototype.on = function(commandCode, fn) {
    this.fns.set(commandCode, fn);
};

BasProtocol.prototype.dispatch = function(commandCode, msgObj) {
    let fn = this.fns.get(commandCode);
    if (fn) {
        fn(msgObj);
    } else if (this.fnAllPacket) {
        this.fnAllPacket(commandCode, msgObj);
    }
};

BasProtocol.prototype.sendPacket = function(packet) {
    return this.channel.sendData(packet);
};

BasProtocol.prototype.checkProtocol = function(interval) {
    let self = this;
    if (interval < 1000) {
        if (self.checkTimer) {
            clearTimeout(self.checkTimer);
            self.checkTimer = null;
        }
        return;
    }

    if (self.checkTimer) {
        clearTimeout(self.checkTimer);
    }

    let timeOut = function() {
    // *recycle heart jump
        if (self.channel.isOpen() && BasPacket.userLoginPacket) {
            let packet = BasPacket.userLoginPacket.toPacket('user1', 'password1', 'no1', 1001);
            let iResult = self.sendPacket(packet);
            console.log('BasProtocol timer auto heartbeat ! result : ', iResult);
        } else {
            console.log('BasProtocol timer auto heartbeat fail! channel.isOpen:', self.channel.isOpen());
        }
        self.checkTimer = setTimeout(timeOut, interval);
    };
    self.checkTimer = setTimeout(timeOut, interval);
};

BasProtocol.BasDefine = BasDefine;
BasProtocol.BasPacket = BasPacket;

// Init User Packet
if (true) {
    let userLoginPacket = new BasPacket();
    userLoginPacket.add('user', BasDefine.OMC_NORMAL_INFO_LEN);
    userLoginPacket.add('password', BasDefine.OMC_NORMAL_INFO_LEN);
    userLoginPacket.add('physicalNo', BasDefine.OMC_PHYSICAL_NO_LEN);
    userLoginPacket.add('kind');
    userLoginPacket.setCommand(1, BasDefine.OMC_REQ_LOGIN);
    BasPacket.userLoginPacket = userLoginPacket;

    let updateInfo = new BasPacket();
    updateInfo.add('user', BasDefine.OMC_NORMAL_INFO_LEN);
    updateInfo.add('kind');
    updateInfo.setCommand(1, BasDefine.OMC_REQ_UPD_DATA);
    BasPacket.updateInfo = updateInfo;

    let alarmReqPacket = new BasPacket();
    alarmReqPacket.add('AlarmNo');
    alarmReqPacket.add('Action');
    alarmReqPacket.add('User', BasDefine.OMC_NORMAL_INFO_LEN);
    alarmReqPacket.add('NeID');
    alarmReqPacket.add('AlarmType');
    alarmReqPacket.add('ModuleNo');
    alarmReqPacket.add('CardNo');
    alarmReqPacket.add('PortNo');
    alarmReqPacket.setCommand(1, BasDefine.OMC_REQ_MOD_ALARM);
    BasPacket.alarmReqPacket = alarmReqPacket;

    let alarmAnsPacket = new BasPacket();
    alarmAnsPacket.add('AlarmNo');
    alarmAnsPacket.add('Action');
    alarmAnsPacket.add('User', BasDefine.OMC_NORMAL_INFO_LEN);
    alarmAnsPacket.add('NeID');
    alarmAnsPacket.add('AlarmType');
    alarmAnsPacket.add('ModuleNo');
    alarmAnsPacket.add('CardNo');
    alarmAnsPacket.add('PortNo');
    alarmAnsPacket.setCommand(1, BasDefine.OMC_ANS_MOD_ALARM);
    BasPacket.alarmAnsPacket = alarmAnsPacket;

    let rtLoginPacket = new BasPacket();
    rtLoginPacket.add('AppId');
    rtLoginPacket.setCommand(1, BasDefine.RTDB_REQ_LOGIN);
    BasPacket.rtLoginPacket = rtLoginPacket;

    let rtUpdcfgPacket = new BasPacket();
    rtUpdcfgPacket.add('AppId');
    rtUpdcfgPacket.setCommand(1, BasDefine.RTDB_REQ_UPD_CFG);
    BasPacket.rtUpdcfgPacket = rtUpdcfgPacket;

    let rtAnsFirstPacket = new BasPacket();
    rtAnsFirstPacket.add('TableName', BasDefine.RTDB_MAX_TABLE_NAME);
    rtAnsFirstPacket.add('Count');
    rtAnsFirstPacket.setCommand(1, BasDefine.RTDB_ANS_FIRST_RCD_SEG);
    BasPacket.rtAnsFirstPacket = rtAnsFirstPacket;

    let rtAnsNextPacket = new BasPacket();
    rtAnsNextPacket.add('TableName', BasDefine.RTDB_MAX_TABLE_NAME);
    rtAnsNextPacket.add('Count');
    rtAnsNextPacket.setCommand(1, BasDefine.RTDB_ANS_NEXT_RCD_SEG);
    BasPacket.rtAnsNextPacket = rtAnsNextPacket;

    let rtReqUpdrcdPacket = new BasPacket();
    rtReqUpdrcdPacket.add('TableName', BasDefine.RTDB_MAX_TABLE_NAME);
    rtReqUpdrcdPacket.add('Count');
    rtReqUpdrcdPacket.setCommand(1, BasDefine.RTDB_REQ_UPDRCD_BY_KEY);
    BasPacket.rtReqUpdrcdPacket = rtReqUpdrcdPacket;
}

BasProtocol.test1 = function() {
    let basProtocol = new BasProtocol();
    basProtocol.start({port: 5556, host: '127.0.0.1'});
  // only commandCode
    basProtocol.on(BasPacket.userLoginPacket.commandCode, function(msgObj) {
        console.log(msgObj); // msgObj = {user: 'user1', password: 'password1'}
    });
  // all in
    basProtocol.onAllPacket(function(commandCode, msgObj) {
        console.log(commandCode, msgObj);
    });

    setTimeout(function() {
    // send packet
        let packet = BasPacket.userLoginPacket.toPacket('user1', 'password1', 'no1', 1001);
        basProtocol.sendPacket(packet);

        console.log(packet);
        fs.writeFile('f:/001.txt', packet, function(err) {
            if (err) {
                console.log(err);
            }
        });
    }, 3000);
};
