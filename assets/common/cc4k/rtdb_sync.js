/* !
// ICS实时数据请求的 json格式：支持散列请求：rtdata_v101；数组请求是：rtdata_v102；返回时都统一用：rtdata_v001
// url 是全局统一资源名（可以通用在容器对象或实体对象中）
// mid 是实时库的实时点全局唯一id
// url和mid可以只有一个，两个同时都有时以mid为准
// ics.json 散列请求
http://10.31.0.15:8821/ics.cgi?fncode=req.rtdata_v101&filetype=json

fncode = req.rtdata_v101
filetype = json

{
  "session":"sbid=0001;xxx=adfadsf",
  "structtype": "rtdata_v101",
  "params":
  [
    {
    "url": "/fp/zyj/fgj01/rfid",
    "mid": 33556644
    },
    {
    "url": "/fp/zyj/fgj01/ypmm",
    "mid": 33556645
    }
  ]
}


// ics.json 数组请求
// 数组请求中是以url为索引时，如果url可以对应到mid就以mid为开始索引；如果url是容器时就返回容器对应数量内个数
fncode = req.rtdata_v102
filetype = json

{
  "session":"sbid=0001;xxx=adfadsf",
  "structtype": "rtdata_v102",
  "params":
  [
    {
    "url": "/fp/zyj/fgj01/rfid",
    "mid": 33556644,
    "count": 100
    },
    {
    "url": "/fp/zyj/fgj01/ypmm",
    "mid": 33556645,
    "count": 100
    }
  ]
}


// ics.json返回时都统一用：rtdata_v001
// "v": 数值
// "q": 值的质量
// "t": 值的时间,unix时间戳（1970到目前的毫秒数，服务器的当地时间）
// 可选属性"srcid": 实时数据信息来源的源ID,
// 可选属性"srcurl": 实时数据信息来源的源url,
// 可选属性"state":状态码，无或0时表示成功，其它值看具体数据字典
{
  "session":"sbid=0001;xxx=adfadsf",
  "structtype":"rtdata_v001",
  "data":[
    {
    "url":"/fp/zyj/fgj01/rfid",
    "mid":33556644,
    "v":"ABC12345678D",
    "q":1,
    "t":1892321321,
    "srcid":1231231,
    "srcurl":"/fp/zyj/fgjapp",
    "state":0
    },
    {
    "url":"/fp/zyj/fgj01/ypmm",
    "mid":33556645,
    "v":"20160100001",
    "q":1,
    "t":1892321521
    "srcid":1231231,
    "srcurl":"/fp/zyj/fgjapp",
    "state":0
    }
  ]

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
    let rtdb = cc4k.rtdb || {};
    cc4k.rtdb = rtdb;
    if (typeof exports === 'object' && typeof global === 'object') {
        exports = module.exports = rtdb;
    }

    let myDebug = function(...args) {
        console.log.apply(null, args);
    };

    let reqMeasures = [];

    let findByNenoCode = function findByNenoCode(neno = 0, code = '') {
        let measures = reqMeasures;
        for (let i = 0; i < measures.length; i++) {
            let measure = measures[i];
            if (measure.neno === neno && measure.code === code) {
                return measure;
            }
        }
        return null;
    };

    /**
     * appendMeasureByNenoUrl
     * @param {Number}neno
     * @param {string}code
     */
    let appendMeasureByNenoUrl = function(neno, code) {
        if (findByNenoCode(neno, code) === null) {
            reqMeasures.push({
                neno: neno,
                code: code,
            });
        }
    };
    rtdb.appendMeasureByNenoUrl = appendMeasureByNenoUrl;

    let retReqMeasuresJson = '';

    let dealRespMeasures = function dealRespMeasures(response) {
        let arr = JSON.parse(response);
        let measures = arr.data;
        for (let i = 0; i < measures.length; i++) {
            let measure = measures[i];
            let iId = measure.mid;
            let myMeasure = rtdb.findMeasureById(iId);
            if (myMeasure !== null) {
                myMeasure.setVQT(measure.v, measure.q, measure.t);
            }
        }
    };

    // # rtdb's sync data
    let getReqMeasuresJson = function getReqMeasuresJson() {
        return JSON.stringify({
            session: '',
            structtype: 'rtdata_v101',
            params: (
                ((monsbManager.getReqMeasures()).concat(ycaddManager.getReqMeasures()))
                    .concat(strawManager.getReqMeasures())
            ),
        });
    };

    let startSyncMeasures = function startSyncMeasures() {
        retReqMeasuresJson = getReqMeasuresJson();
        let reqRespRtdatas = function() {
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
            retReqMeasuresJson = getReqMeasuresJson();
            let r = xmlhttp.send(retReqMeasuresJson);
            myDebug('发送：ReqMeasures - ' + new Date() + ' ' + r);
        };

        if (retReqMeasuresJson.length > 0) {
            setInterval(reqRespRtdatas, 1000);
            return true;
        } else {
            console.log('!!! warnning: retReqMeasuresJson is empty!!!');
            return false;
        }
    };
    rtdb.startSyncMeasures = startSyncMeasures;
})(typeof window !== 'undefined' ? window : this);
