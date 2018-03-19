/**
 * Created by oudream on 2016/4/11.
 */

(function() {
    window.cjSimpleMeasures = {}

    var cjCommon = window.cjCommon;
    var cjSql570 = window.cjSql570;
    var cjDescript570 = window.cjDescript570;
    var cjSimpleMeasures = window.cjSimpleMeasures;

    var sTid = cjCommon.getUrlParam('tid');
    console.log("tid=" + sTid);

    cjSimpleMeasures.req_resp$sql$tid_mid = function( ) {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }
        else if (window.ActiveXObject)  {
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("post", "ics.cgi?fncode=req.sql.select.&filetype=json", true);
        xmlhttp.setRequestHeader('Content-Type', 'application/json');
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                cjSimpleMeasures.dealRespMeasures(xmlhttp.responseText)
            }
        }
        var sSql = cjSql570.getSqlJson( "rt_tid_mid", sTid);
        xmlhttp.send(sSql);
    }

    /*
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
     */
    cjSimpleMeasures.dealRespMeasures =  function (response) {
        var resp = JSON.parse(response);
        var rows = resp.data;
        if (!rows || rows.length<1)
        {
            document.getElementById("measuresPn").innerHTML = "<br><lable>没有tid["+sTid+"]对应的实时数据</lable>";
            return;
        }
        var row;
        var i;
        var oReqMeasures = {
            "session":"rt_session",
            "structtype": "rtdata_v102",
            "params":
                [
                    {
                        "mid": 33556644,
                        "count": 100
                    },
                    {
                        "mid": 33556645,
                        "count": 100
                    }
                ]
        };
        var oReqMeasureCount = 0;
        for(i = 0; i < rows.length; i++)
        {
            row = rows[i];
            var iMid = row["mid"];
            var iCount = row["count"];
            if (iMid>=0x01000000 && iMid<0x04000000 && iCount > 0)
            {
                var param = {
                    "mid" : iMid,
                    "count" : iCount
                }
                oReqMeasures.params[oReqMeasureCount] = param;
                oReqMeasureCount++;
            }
            else
            {
                console.log("table[T_RT_TID_MID] setting invalid!");
            }
        }
        if (oReqMeasures.params.length>0)
        {
            cjSimpleMeasures.req_resp_rt(oReqMeasures);
        }
        else
        {
            document.getElementById("measuresPn").innerHTML = "<br><lable>没有tid["+sTid+"]对应的合适实时数据</lable>";
            return;
        }
    }

    cjSimpleMeasures.req_resp_rt = function( oReq ) {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }
        else if (window.ActiveXObject)  {
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("post", "ics.cgi?fncode=req.rtdata_v102&filetype=json", true);
        xmlhttp.setRequestHeader('Content-Type', 'application/json');
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                cjSimpleMeasures.dealRespRt(xmlhttp.responseText)
            }
        }
        xmlhttp.send(JSON.stringify(oReq));
    }

    /*
     // ics.json返回时都统一用：rtdata_v001
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
     */
    cjSimpleMeasures.dealRespRt =  function (response) {
        var resp = JSON.parse(response);
        var rows = resp.data;
        if (!rows || rows.length<1)
        {
            document.getElementById("measuresPn").innerHTML = "<br><lable>没有数据</lable>";
            return;
        }
        var row;
        var i, j;
        var sOut = "<table>";
        var keys = Object.keys(rows[0]);
        var key;
        var value;
        var descripts = cjDescript570["rt_measure"];
        for(i = keys.length; i >= 0; i--)
        {
            if (! descripts.hasOwnProperty(keys[i]))
            {
                keys.splice(i, 1);
            }
        }
        sOut += "<tr>"
        for(i = 0; i < keys.length; i++)
        {
            sOut += "<th>";
            sOut += descripts[keys[i]];
            sOut += "</th>";
        }
        sOut += "</tr>"
        sOut += "<tr>"
        for(i = 0; i < keys.length; i++)
        {
            sOut += "<td>";
            sOut += keys[i];
            sOut += "</td>";
        }
        sOut += "</tr>"

        for(i = 0; i < rows.length; i++)
        {
            row = rows[i];
            sOut += "<tr>"
            for(j = 0; j < keys.length; j++)
            {
                sOut += "<td>";
                key = keys[j];
                value = row[key];
                if (key === "t")
                {
                    sOut += cjCommon.getLocalTime(value);
                }
                else
                {
                    sOut += value;
                }
                sOut += "</td>";
            }
            sOut += "</tr>"
        }
        sOut += "</table>"

        document.getElementById("measuresPn").innerHTML = sOut;
    }

    cjSimpleMeasures.req_resp$sql$tid_mid( sTid );

})()