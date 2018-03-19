/**
 * Created by oudream on 2016/3/25.
 */

(function() {
    window.cjMain = {}

    var cjCommon = window.cjCommon;
    var cjSql570 = window.cjSql570;
    var cjDescript570 = window.cjDescript570;
    var cjMain = window.cjMain;

    cjMain.req_resp_ticket_statistics = function() {
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
                cjMain.deal_ticket_statistics(xmlhttp.responseText)
            }
        }
        xmlhttp.send(cjSql570.getSqlJson("ticket_statistics"));
    }

    cjMain.deal_ticket_statistics =  function (response) {
        var resp = JSON.parse(response);
        var rows = resp.data;
        if (!rows || rows.length<1) return;
        var row, item;
        var i, j;
        var ticket_todo = ticket_doing = ticket_done = 0;
        for(i = 0; i < rows.length; i++)
        {
            row = rows[i];
            switch ( row["status"] )
            {
                //4 正执行
                case 4:
                    ticket_doing = row["counter"];
                    break;
                //5 已执行
                case 5:
                    ticket_done = row["counter"];
                    break;
                //3 待执行
                default:
                    ticket_todo = row["counter"];
                    break;
            }
        }

        document.getElementById("ticket_todo").textContent = ticket_todo;
        document.getElementById("ticket_doing").textContent = ticket_doing;
        document.getElementById("ticket_done").textContent = ticket_done;
    }

    cjMain.req_resp_box_statistics = function() {
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
                cjMain.deal_box_statistics(xmlhttp.responseText)
            }
        }
        xmlhttp.send(cjSql570.getSqlJson("box_statistics"));
    }

    cjMain.deal_box_statistics =  function (response) {
        var resp = JSON.parse(response);
        var rows = resp.data;
        if (!rows || rows.length<1) return;
        var row, item;
        var i, j;
        var box_used = box_canuse = box_disable = 0;
        for(i = 0; i < rows.length; i++)
        {
            row = rows[i];
            switch ( row["used"] )
            {
                //1 已使用
                case 1:
                    box_used = row["counter"];
                    break;
                //0 可使用
                case 0:
                    box_canuse = row["counter"];
                    break;
                // 无效
                default:
                    box_disable = row["counter"];
                    break;
            }
        }

        document.getElementById("box_used").textContent = box_used;
        document.getElementById("box_canuse").textContent = box_canuse;
        document.getElementById("box_disable").textContent = box_disable;
    }

    cjMain.req_resp_ticket_statistics();
    cjMain.req_resp_box_statistics();

})()
