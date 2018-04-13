/**
 * Created by ygct on 2015/12/28.
 */

let AjaxServer = {
    version: '1.0.0',
};


/*
*
* post(url,type,fncode,async,callBack_fn,param1);
*
* */
AjaxServer.post = function(url, type, fncode, async, callBack_fn, configUrl, param1) {
    let xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
    }
    // xmlhttp.open(type, "http://10.31.58.86:8821/ics/xxx.cgi?fncode=" + fncode, async);
    // xmlhttp.open(type, "http://10.31.16.253:8821/ics/xxx.cgi?fncode=" + fncode, async);
    if (configUrl == '') {
        xmlhttp.open(type, 'ics.cgi?fncode=' + fncode, async);
        // xmlhttp.open(type, "http://10.31.16.73:8821/ics/xxx.cgi?fncode=" + fncode, async);
        // xmlhttp.open(type, "http://10.31.16.253:8821/ics/xxx.cgi?fncode=" + fncode, async);
    } else {
        // xmlhttp.open(type, "http://10.31.16.73:8821/ics/xxx.cgi?fncode=" + fncode + "&config-url=" + configUrl, async);
        // xmlhttp.open(type, "http://10.31.16.253:8821/ics/xxx.cgi?fncode=" + fncode + "&config-url=" + configUrl, async);
        xmlhttp.open(type, 'ics.cgi?fncode=' + fncode + '&config-url=' + configUrl, async);
    }
    xmlhttp.setRequestHeader('POWERED-BY-AID', 'Approve');
    xmlhttp.setRequestHeader('Content-Type', 'json');

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            callBack_fn(xmlhttp.response, param1);
        }
    };

    let r = xmlhttp.send(url);
};


