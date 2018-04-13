/**
 * Created by ygct on 2016/3/23.
 */


let cjAjax = {
    version: '1.0.0',
};

/*
 * 111111111
 * post(url,callBack_fn);
 *
 * */
cjAjax.post = function(url, callBack_fn, param1) {
    let xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
    }
    // xmlhttp.open("post", "http://10.31.16.253:8821/ics/xxx.cgi?fncode=req.sql.", true);
    xmlhttp.open('post', 'http://10.31.16.73:8821/ics/xxx.cgi?fncode=req.sql.', true);
    xmlhttp.setRequestHeader('POWERED-BY-AID', 'Approve');
    xmlhttp.setRequestHeader('Content-Type', 'json');

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            callBack_fn(xmlhttp.response, param1);
        }
    };
    let r = xmlhttp.send(url);
};
