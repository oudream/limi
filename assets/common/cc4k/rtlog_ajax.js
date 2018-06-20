/*!

// 实时点的历史实时数据请求的 json格式：支持时间段请求：rtlog_v102；同一时间点各点的值请求：rtlog_v103；返回时都统一用：rtlog_v001
// url 是全局统一资源名（可以通用在容器对象或实体对象中）
// mid 是实时库的实时点全局唯一id
// urls 是 URL 的数组
// mids 是 mid 的数组
// url和mid可以只有一个，两个同时都有时以mid为准
// dtday 2018-06-19 2018年6月19日这一天
// dtdate 2018-06-19 12:11:10 2018年6月19日12点11分10秒，从这 dtday + dtdate开始的时长 dtlong （如果 dtlong 没有就一小时）
// dtlong 时长（秒数）
// interval 历史点间的间隔时长
// i mid
// v 数值
// q 值的质量
// t 值的时间,unix时间戳（1970到目前的毫秒数，服务器的当地时间）
// s 实时数据信息来源的源ID,ChangedSourceId
// u 实时数据信息来源的源url,ChangedSourceId
// r ChangedReasonId

// rtlog_v102
fncode = req.rtlog_v102
filetype = json
// http://10.31.0.15:8821/ics.cgi?fncode=req.rtlog_v102&filetype=json

{
  "session":"sbid=0001;xxx=adfadsf",
  "structtype": "rtlog_v102",
  "params":
  [
    {
    "mids": [33556644, 33556645, 33556646],
    "dtbegin": 31343242341,
    "dtend": 23413241234,
    "interval": 1000
    }
  ]
}


// ics.json返回时都统一用：rtlog_v001
// logtype 指 log 的结构类型
// logtype 为 1 时log为[[t, v, q, s, r],...]
// logtype 为 2 时log为[v,v,v...]
// log 日志内容
// 可选属性"state":状态码，无或0时表示成功，其它值看具体数据字典
{
  "session":"sbid=0001;xxx=adfadsf",
  "structtype":"rtdata_v001",
  "data":[
    {
    "mid":33556644,
    "logtype": 2,
    "log": "#logfile.text",
    "state":0
    },
    {
    "url":"/fp/zyj/fgj01/ypmm",
    "mid":33556645,
    "log": "#logfile.text",
    "state":0
    }
  ]
}

 */

(function() {
    'use strict';

    if (typeof exports === 'object' && typeof global === 'object') {
        global.cc4k = global.cc4k || {};
    } else if (typeof window === 'object') {
        window.cc4k = window.cc4k || {};
    } else {
        throw Error('cjs only run at node.js or web browser');
    }
    let rtlog = cc4k.rtlog || {};
    cc4k.rtlog = rtlog;
    if (typeof exports === 'object' && typeof global === 'object') {
        exports = module.exports = rtlog;
    }

    let myDebug = function(...args) {
        console.log.apply(null, args);
    };

    /**
     * reqRtlogByPeriod 时间段方式的请求
     * @param {[]} mids
     * @param {Date} dtBegin
     * @param {Date} dtEnd
     * @param {Number} iInterval
     * @param {function} fnCallback(data, err)
     */
    let setRespCallback = function(mids, dtBegin, dtEnd, iInterval, fnCallback) {
    };
    rtlog.reqRtlogByPeriod = reqRtlogByPeriod;

    let reqRtlogByPeriod = function(mids, dtBegin, dtEnd, iInterval, fnCallback) {
    rtlog.reqRtlogByPeriod = reqRtlogByPeriod;

    let dealRespMeasures = function dealRespMeasures(response) {
        let arr = JSON.parse(response);
        let resMeasures = arr.data;
        rtlog.receivedMeasures(resMeasures);
    };

    let startSyncMeasures = function startSyncMeasures() {
        let reqRespRtdatas = function() {
            let retReqMeasuresJson = JSON.stringify({
                session: Date.now().toString(),
                structtype: 'rtdata_v101',
                params: reqMeasures,
            });
            if (! retReqMeasuresJson) {
                console.log('!!! warnning: retReqMeasuresJson is empty!!!');
                return;
            }
            let xmlhttp;
            if (window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
            }
            xmlhttp.open('post', 'xxx.rtdata', true);
            xmlhttp.setRequestHeader('POWERED-BY-AID', 'Approve');
            xmlhttp.setRequestHeader('Content-Type', 'json');
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    myDebug('接收：RespMeasures - ' + new Date() + ' ' + xmlhttp.response.length);
                    dealRespMeasures(xmlhttp.responseText);
                }
            };
            let r = xmlhttp.send(retReqMeasuresJson);
            myDebug('发送：ReqMeasures - ' + new Date() + ' ' + r);
        };

        setInterval(reqRespRtdatas, 1000);
    };
    rtlog.startSyncMeasures = startSyncMeasures;
})(typeof window !== 'undefined' ? window : this);