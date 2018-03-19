/**
 * Created by liuchaoyu on 2017-05-08.
 */

"use strict";

let utils = {
    net : {
        getInfoFromSession : getInfoFromSession,
        getRemoteIpAddress : getRemoteIpAddress,
    },
    date : {
        getDateTime : getDateTime,
    }
};


/** net */

/**
 * 从sessionId获取信息
 * @param sessionId : String
 * @returns {{host: *, dsn: *}} : Object
 */
function getInfoFromSession(sessionId) {
    let sessionStrs = sessionId.split('_');
    let count = sessionStrs.length;
    let hostAndDsn = '';
    if (count == 5) {
        hostAndDsn = sessionStrs[count - 2];
    }
    else {
        hostAndDsn = sessionStrs[0];
    }

    let host,dsn;
    if (hostAndDsn.indexOf(':') != -1) {
        let info = hostAndDsn.split(':');

        host = info[0];
        dsn = info[1];
    }
    else {
        host = '';
        dsn = hostAndDsn;
    }

    return {
        host : host,
        dsn : dsn,
    }

}

/**
 * 从req中获取远端IP地址
 * @param req : Object HTTP请求
 * @returns {*} : String IP地址
 */
function getRemoteIpAddress(req) {
    let ipAddress;
    // let forwardedIpsStr = req.header('x-forwarded-for');
    //
    // if (forwardedIpsStr) {
    //     let forwardedIps = forwardedIpsStr.split(',');
    //     ipAddress = forwardedIps[0];
    // }

    // if (!ipAddress) {
    let _ipAddressStr;

    let _ipAddress = (req.connection) ? req.connection.remoteAddress : req.upgradeReq.connection.remoteAddress;

    if (_ipAddress.indexOf(':') != -1) {
        _ipAddressStr = _ipAddress.split(":");
    }

    ipAddress = _ipAddressStr[_ipAddressStr.length - 1];

    // }

    return ipAddress;
}

/** net end */




/** date */
/**
 * 获取当前日期时间
 * @param type : String 类型，有date,time
 * @param separator : String 日期分隔符，例如：'/','-'
 * @returns {*} : String 日期时间字符串
 */
function getDateTime(type,separator) {
    let date = new Date();

    let result = null;
    let _sep = '/';
    let year,month,day,hour,min,sec;

    let _year = date.getFullYear();
    year = _year;

    let _month = date.getMonth() + 1;
    month = _month > 9 ? _month : ('0' + _month.toString());

    let _day = date.getDate();
    day = _day > 9 ? _day : ('0' + _day.toString());

    let _hour = date.getHours();
    hour = _hour > 9 ? _hour : ('0' + _hour.toString());

    let _min = date.getMinutes();
    min = _min > 9 ? _min : ('0' + _min.toString());

    let _sec = date.getSeconds();
    sec = _sec > 9 ? _sec : ('0' + _sec.toString());

    if (separator && typeof separator === 'string') {
        _sep = separator;
    }

    if (type == 'date') {
        result = year + _sep + month + _sep + day;
    }
    else if (type == 'time') {
        result = hour + ':' + min + ':' + sec;
    }
    else {
        result = year + _sep + month + _sep + day + ' ' + hour + ':' + min + ':' + sec;
    }

    return result;
}
/** date end */





module.exports = {
    'utils': utils,
};