/**
 * Created by oudream on 2016/3/23.
 */

(function() {
    window.cjSimple = {}

    var cjCommon = window.cjCommon;
    var cjSql570 = window.cjSql570;
    var cjDescript570 = window.cjDescript570;
    var cjSimple = window.cjSimple;

    var sUrl = cjCommon.getUrlParam('url');
    console.log("url=" + sUrl);


    function req_resp_measures(Request){
        var ret_data = Request;
        var jsonobj=eval('('+ret_data+')');
        var data = jsonobj.data;
        if(data.length==0)return;

        var cjDescript570 = window.cjDescript570;
        var descripts = cjDescript570["box_state"];
        var keys = Object.keys(data[0]);
        var dtGridColumns_2_1_1 = new Array();
        for(var i=0;i<keys.length;i++)
        {
            var row = {};
            var name = "";
            if (! descripts.hasOwnProperty(keys[i]))
            {
                name = keys[i];
            }else
            {
                name = descripts[keys[i]];
            }
            row.id = keys[i];
            row.title = name;
            row.type = 'string';
            row.columnClass = 'text-center';
            row.headerStyle = 'background:#00a2ca;color:white;';
            dtGridColumns_2_1_1.push(row);
        }
        var datas = new Array();
        for(var i=0; i<data.length; i++){
            var user = new Object();
            var newDate = new Date();

            for(var j=0;j<keys.length;j++)
            {
                var obj = data[i];
                var k = keys[j];
                user[k] = obj[k];
            }
            datas.push(user);
        }

        var dtGridOption_2_1_1 = {
            lang : 'zh-cn',
            ajaxLoad : false,
            exportFileName : '导出的数据文件名',
            datas : datas,
            columns : dtGridColumns_2_1_1,
            gridContainer : 'dtGridContainer_2_1_3',
            toolbarContainer : 'dtGridToolBarContainer_2_1_3',
            pageSize : 10,
            print:false,
            tools : 'advanceQuery',
            pageSize : 20,
            pageSizeLimit : [10, 20, 50]
        };
        var grid_2_1_1 = $.fn.dlshouwen.grid.init(dtGridOption_2_1_1);
        $(function(){
            grid_2_1_1.load();
        });
    }

    var re_urls = {
        sql:"SELECT * FROM T_570_RT_STATE"
    };
    //  re_urls.sql = window.cjSql570.cabinet_log;

    cjAjax.post(JSON.stringify(re_urls),req_resp_measures);


    cjSimple.req_resp_simple = function() {
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
                cjSimple.dealRespSimple(xmlhttp.responseText)
            }
        }
        xmlhttp.send(cjSql570.getSqlJson(sUrl));
    }

    cjSimple.dealRespSimple =  function (response) {
        //console.log(response.length);
        //console.log(response.length);
        //console.log(response.length);
        //console.log(response);
        var resp = JSON.parse(response);
        var rows = resp.data;
        if (!rows || rows.length<1)
        {
            document.getElementById("content").innerHTML = "<br><lable>没有数据</lable>";
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

        document.getElementById("content").innerHTML = sOut;
    }

    cjSimple.req_resp_simple();

})()


