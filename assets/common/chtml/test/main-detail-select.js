/**
 * Created by oudream on 2016/3/23.
 */

(function() {
    window.cjMd = {}

    var cjCommon = window.cjCommon;
    var cjSql570 = window.cjSql570;
    var cjDescript570 = window.cjDescript570;
    var cjMd = window.cjMd;

    var sUrl = cjCommon.getUrlParam('url');
    console.log("url=" + sUrl);

    cjMd.req_resp_main = function( sUrl ) {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }
        else if (window.ActiveXObject)  {
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("post", "ics.cgi?fncode=req.sql.select.&filetype=json", true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                cjMd.dealRespMain(xmlhttp.responseText)
            }
        }
        xmlhttp.send(cjSql570.getSqlJson( sUrl ));
    }

    cjMd.dealRespMain =  function (response) {
        var resp = JSON.parse(response);
        var rows = resp.data;
        if (!rows || rows.length<1)
        {
            document.getElementById("mainPn").innerHTML = "<br><lable>没有数据</lable>";
            return;
        }
        var row, item;
        var i, j;
        var sOut = "<table>";
        var keys = Object.keys(rows[0]);
        var descripts = cjDescript570[sUrl];
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
            sOut += "<tr onclick='cjMd.trClick(this);'>"
            for(j = 0; j < keys.length; j++)
            {
                sOut += "<td>";
                sOut += row[keys[j]];
                sOut += "</td>";
            }
            sOut += "</tr>"
        }
        sOut += "</table>"

        document.getElementById("mainPn").innerHTML = sOut;
    }

    cjMd.trClick = function( obj ) {
        var str = obj.cells[0].innerText;
        cjMd.req_resp_detail(sUrl, str);
    }

    cjMd.req_resp_detail = function( sUrl , mainId ) {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }
        else if (window.ActiveXObject)  {
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("post", "ics.cgi?fncode=req.sql.select.&filetype=json", true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                cjMd.dealRespDetail(xmlhttp.responseText)
            }
        }
        var reqText = cjSql570.getSqlDetailJson( sUrl, mainId );
        xmlhttp.send(reqText);
    }

    cjMd.dealRespDetail =  function (response) {
        var resp = JSON.parse(response);
        var rows = resp.data;
        if (!rows || rows.length<1) return;
        var row, item;
        var i, j;
        var sOut = "<table>";
        var keys = Object.keys(rows[0]);
        var descripts2 = cjDescript570[sUrl];
        var descripts = descripts2.detail;
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
                sOut += row[keys[j]];
                sOut += "</td>";
            }
            sOut += "</tr>"
        }
        sOut += "</table>"

        document.getElementById("detailPn").innerHTML = sOut;
    }

    cjMd.req_resp_main( sUrl );

})()
