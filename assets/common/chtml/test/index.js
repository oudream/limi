/**
 * Created by oudream on 2016/3/21.
 */

(function() {
    window.cjMemu = {};
    let cjMemu = window.cjMemu;

    cjMemu.reqData = {
        'sql': 'SELECT `T_SYS_WEB_UI_MENU`.`F_ID` as \'id\',    `T_SYS_WEB_UI_MENU`.`F_LABEL` as \'lable\',    `T_SYS_WEB_UI_MENU`.`F_IMG_URL` as \'img_url\',    `T_SYS_WEB_UI_MENU`.`F_TARGET_URL` as \'target_url\',    `T_SYS_WEB_UI_MENU`.`F_PARENT` as \'parent\',    `T_SYS_WEB_UI_MENU`.`F_DESC` as \'desc\',    `T_SYS_WEB_UI_MENU`.`F_PARAMS` as \'params\',    `T_SYS_WEB_UI_MENU`.`F_AVAIL` as \'avail\',    `T_SYS_WEB_UI_MENU`.`F_RESO` FROM `YGCT`.`T_SYS_WEB_UI_MENU`;',
    };

    cjMemu.req_resp_memu = function() {
        let xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
        }
        xmlhttp.open('post', 'http://127.0.0.1:8821/ics.cgi?fncode=req.sql.&filetype=json', true);
        // xmlhttp.open("post", "http://10.31.16.73:8821/ics.cgi?fncode=req.sql.&filetype=json", true);
        // xmlhttp.open("post", "http://10.31.16.253:8821/ics.cgi?fncode=req.sql.&filetype=json", true);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                cjMemu.dealRespMain(xmlhttp.responseText);
            }
        };
        xmlhttp.send(JSON.stringify(cjMemu.reqData));
    };

    cjMemu.dealRespMain = function(response) {
        cjMemu.memus = new Array;
        let memus = cjMemu.memus;
        let resp = JSON.parse(response);
        let rows = resp.data;
        let row, memu, item;
        let i, j, k;
        // 要第一层
        for (i = 0; i < rows.length; i++) {
            row = rows[i];
            if (row && ! row.parent) {
                row.items = new Array();
                memus[memus.length] = row;
                rows[i] = null;
            }
        }
        // 要第二层
        for (j = 0; j < memus.length; j++) {
            memu = memus[j];
            for (i = 0; i < rows.length; i++) {
                row = rows[i];
                if (row && memu.id === row.parent) {
                    row.items = new Array();
                    memu.items[memu.items.length] = row;
                    rows[i] = null;
                }
            }
        }
        // 要第三层
        for (k = 0; k < memus.length; k++) {
            memu = memus[k];
            for (j = 0; j < memu.items.length; j++) {
                item = memu.items[j];
                for (i = 0; i < rows.length; i++) {
                    row = rows[i];
                    if (row && item.id === row.parent) {
                        item.items[item.items.length] = row;
                        rows[i] = null;
                    }
                }
            }
        }

        cjMemu.memusText = '';
        let sOut = '';
        for (k = 0; k < memus.length; k++) {
            memu = memus[k];
            sOut = '<h2>'+ memu.lable +'</h2>';
            sOut += '<ul>';
            for (j = 0; j < memu.items.length; j++) {
                item = memu.items[j];
                if (! item.target_url) {
                    sOut += '<li>';
                    sOut += item.lable;
                    sOut += '</li>';
                } else {
                    sOut += '<li><a href="';
                    sOut += item.target_url;
                    sOut += '" target="right">';
                    sOut += item.lable;
                    sOut += '</a> </li>';
                }
                if (item.items) {
                    sOut += '<ul>';
                    for (i = 0; i < item.items.length; i++) {
                        row = item.items[i];
                        sOut += '<li><a href="';
                        sOut += row.target_url;
                        sOut += '" target="right">';
                        sOut += row.lable;
                        sOut += '</a> </li>';
                    }
                    sOut += '</ul>';
                }
            }
            sOut += '</ul>';
            cjMemu.memusText += sOut;
        }
        document.getElementById('menu').innerHTML = cjMemu.memusText;
    };


    cjMemu.req_resp_memu();
})();

