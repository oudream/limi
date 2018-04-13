/**
 * Created by oudream on 2016/3/23.
 */

(function() {
    window.cjSimple = {};

    let cjCommon = window.cjCommon;
    let cjSql570 = window.cjSql570;
    let cjDescript570 = window.cjDescript570;
    let cjSimple = window.cjSimple;

    let sUrl = cjCommon.getUrlParam('url');
    console.log('url=' + sUrl);


    function req_resp_measures(Request) {
        let ret_data = Request;
        let jsonobj=eval('('+ret_data+')');
        let data = jsonobj.data;
        if (data.length==0) return;

        let cjDescript570 = window.cjDescript570;
        let descripts = cjDescript570['box_state'];
        let keys = Object.keys(data[0]);
        let dtGridColumns_2_1_1 = new Array();
        for (var i=0; i<keys.length; i++) {
            let row = {};
            let name = '';
            if (! descripts.hasOwnProperty(keys[i])) {
                name = keys[i];
            } else {
                name = descripts[keys[i]];
            }
            row.id = keys[i];
            row.title = name;
            row.type = 'string';
            row.columnClass = 'text-center';
            row.headerStyle = 'background:#00a2ca;color:white;';
            dtGridColumns_2_1_1.push(row);
        }
        let datas = new Array();
        for (var i=0; i<data.length; i++) {
            let user = new Object();
            let newDate = new Date();

            for (let j=0; j<keys.length; j++) {
                let obj = data[i];
                let k = keys[j];
                user[k] = obj[k];
            }
            datas.push(user);
        }

        let dtGridOption_2_1_1 = {
            lang: 'zh-cn',
            ajaxLoad: false,
            exportFileName: '导出的数据文件名',
            datas: datas,
            columns: dtGridColumns_2_1_1,
            gridContainer: 'dtGridContainer_2_1_3',
            toolbarContainer: 'dtGridToolBarContainer_2_1_3',
            pageSize: 10,
            print: false,
            tools: 'advanceQuery',
            pageSize: 20,
            pageSizeLimit: [10, 20, 50],
        };
        let grid_2_1_1 = $.fn.dlshouwen.grid.init(dtGridOption_2_1_1);
        $(function() {
            grid_2_1_1.load();
        });
    }

    let re_urls = {
        sql: 'SELECT * FROM T_570_RT_STATE',
    };
    //  re_urls.sql = window.cjSql570.cabinet_log;

    cjAjax.post(JSON.stringify(re_urls), req_resp_measures);


    cjSimple.req_resp_simple = function() {
        let xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
        }
        xmlhttp.open('post', 'ics.cgi?fncode=req.sql.select.&filetype=json', true);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                cjSimple.dealRespSimple(xmlhttp.responseText);
            }
        };
        xmlhttp.send(cjSql570.getSqlJson(sUrl));
    };

    cjSimple.dealRespSimple = function(response) {
        // console.log(response.length);
        // console.log(response.length);
        // console.log(response.length);
        // console.log(response);
        let resp = JSON.parse(response);
        let rows = resp.data;
        if (!rows || rows.length<1) {
            document.getElementById('content').innerHTML = '<br><lable>没有数据</lable>';
            return;
        }
        let row, item;
        let i, j;
        let sOut = '<table>';
        let keys = Object.keys(rows[0]);
        let descripts = cjDescript570[sUrl];
        for (i = keys.length; i >= 0; i--) {
            if (! descripts.hasOwnProperty(keys[i])) {
                keys.splice(i, 1);
            }
        }
        sOut += '<tr>';
        for (i = 0; i < keys.length; i++) {
            sOut += '<th>';
            sOut += descripts[keys[i]];
            sOut += '</th>';
        }
        sOut += '</tr>';
        sOut += '<tr>';
        for (i = 0; i < keys.length; i++) {
            sOut += '<td>';
            sOut += keys[i];
            sOut += '</td>';
        }
        sOut += '</tr>';

        for (i = 0; i < rows.length; i++) {
            row = rows[i];
            sOut += '<tr>';
            for (j = 0; j < keys.length; j++) {
                sOut += '<td>';
                sOut += row[keys[j]];
                sOut += '</td>';
            }
            sOut += '</tr>';
        }
        sOut += '</table>';

        document.getElementById('content').innerHTML = sOut;
    };

    cjSimple.req_resp_simple();
})();


