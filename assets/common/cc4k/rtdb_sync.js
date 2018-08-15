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
}




// ICS 遥控请求的 json格式：yk_v101；返回时用：yk_r_v001
// url 是全局统一资源名（可以通用在容器对象或实体对象中）
// mid 是实时库的实时点全局唯一id
// v: 遥控的目标数值（如果是遥信量：1 分、2 合、0 无）（如果是遥测量、文字量就是直接数值量）
// index 遥控序号，可选预留项
// strategy 遥控策略，可选预留项
// method 遥控方法，可选预留项
// ext 遥控操作附加数据对象（kv对）（pos : 仓位号、柜号）
// url和mid可以只有一个，两个同时都有时以mid为准
// ics.json 散列请求
http://10.31.0.15:8821/ics.cgi?fncode=req.yk_v101&filetype=json

fncode = req.yk_v101
filetype = json

{
  "session":"sbid=0001;xxx=adfadsf",
  "structtype": "yk_v101",
  "params":
  [
    {
      "url": "/fp/qyg/qyg01/yk01",
      "mid": 33556644,
      "v": 1,
      "strategy": 1,
      "method": 0,
      "ext": {
        "pos": 11
      }
    },
    {
      "url": "/fp/qyg/qyg01/yk02",
      "mid": 33556645,
      "v": 2,
      "strategy": 1,
      "method": 0,
      "ext": {
        "pos": 12
    }
  ]
}

// ICS 遥控返回用：yk_r_v001
// 可选属性"state":状态码，无或0时表示接收并转发成功（如果有转发），其它值看具体数据字典
// 可选属性"t": 值的时间,unix时间戳（1970到目前的毫秒数，服务器的当地时间）
{
  "session":"sbid=0001;xxx=adfadsf",
  "structtype":"yk_r_v001",
  "data":[
    {
      "url": "/fp/qyg/qyg01/yk01",
      "mid": 33556644,
      "state": 0,
      "t": 1892321521
    },
    {
      "url": "/fp/qyg/qyg01/yk02",
      "mid": 33556645,
      "state": 0,
      "t": 1892321521
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
    let appendMeasureByNenoCode = function(neno, code) {
        if (findByNenoCode(neno, code) === null) {
            reqMeasures.push({
                neno: neno,
                code: code,
            });
        }
    };
    rtdb.appendMeasureByNenoCode = appendMeasureByNenoCode;

    let dealRespSyncMeasures = function dealRespSyncMeasures(response) {
        let arr = JSON.parse(response);
        let resMeasures = arr.data;
        rtdb.receivedMeasures(resMeasures);
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
            xmlhttp.open('post', '001.rtdata.cgi', true);
            xmlhttp.setRequestHeader('POWERED-BY-AID', 'Approve');
            xmlhttp.setRequestHeader('Content-Type', 'json');
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    myDebug('接收：RespMeasures - ' + new Date() + ' ' + xmlhttp.response.length);
                    dealRespSyncMeasures(xmlhttp.responseText);
                }
            };
            let r = xmlhttp.send(retReqMeasuresJson);
            myDebug('发送：ReqMeasures - ' + new Date() + ' ' + r);
        };

        setInterval(reqRespRtdatas, 1000);
    };
    rtdb.startSyncMeasures = startSyncMeasures;


    let registerRespSetMeasureCallback = function registerRespSetMeasureCallback(fnDataChangedCallback) {
        rtdb.respSetMeasureCallback = fnDataChangedCallback;
    };
    rtdb.registerRespSetMeasureCallback = registerRespSetMeasureCallback;

    let dealRespSetMeasureByNenoCode = function dealRespSetMeasureByNenoCode(response) {
        let arr = JSON.parse(response);
        let resSession = arr.session;
        let resMeasures = arr.data;
        if (rtdb.respSetMeasureCallback) {
            rtdb.respSetMeasureCallback(resSession, resMeasures);
        }
    };

    let reqSetMeasure = function reqSetMeasure(retReqMeasuresJson) {
        if (! retReqMeasuresJson) {
            console.log('!!! warnning: setMeasure is empty!!!');
            return;
        }
        let xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
        }
        xmlhttp.open('post', 'ics.cgi?fncode=req.yk_v101&filetype=json', true);
        xmlhttp.setRequestHeader('POWERED-BY-AID', 'Approve');
        xmlhttp.setRequestHeader('Content-Type', 'json');
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                myDebug('接收：RespMeasures - ' + new Date() + ' ' + xmlhttp.response.length);
                dealRespSetMeasureByNenoCode(xmlhttp.responseText);
            }
        };
        let r = xmlhttp.send(retReqMeasuresJson);
        myDebug('发送：ReqMeasures - ' + new Date() + ' ' + r);
    };

    let reqSetMeasureByNenoCode = function reqSetMeasureByNenoCode(neno, code, v) {
        let retReqMeasuresJson = JSON.stringify({
            session: Date.now().toString(),
            structtype: 'yk_v101',
            params: [
                {
                    neno: neno,
                    code: code,
                    v: v
                }
            ],
        });
        reqSetMeasure(retReqMeasuresJson);
    };
    rtdb.reqSetMeasureByNenoCode = reqSetMeasureByNenoCode;

    let reqSetMeasureByMid = function reqSetMeasureByMid(mid, v) {
        let retReqMeasuresJson = JSON.stringify({
            session: Date.now().toString(),
            structtype: 'yk_v101',
            params: [
                {
                    mid: mid,
                    v: v
                }
            ],
        });
        reqSetMeasure(retReqMeasuresJson);
    };
    rtdb.reqSetMeasureByMid = reqSetMeasureByMid;
})(typeof window !== 'undefined' ? window : this);
