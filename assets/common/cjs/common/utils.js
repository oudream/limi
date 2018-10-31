let utils = {
    'version': '1.0.0',
    'time': {},
    'dom': {},
    'number': {},
    'dataProcess': {},
    'data':{},
};
utils.time.getDate = function(separator) {
    let _separator = '/';
    if (separator) {
        _separator = separator;
    }

    let date = new Date();

    let _month = date.getMonth() + 1;
    let month = _month > 9 ? _month : ('0' + _month.toString());
    let day = date.getDate() > 9 ? date.getDate() : ('0' + date.getDate().toString());

    if (_separator === 'none') {
        return date.getFullYear().toString() + month.toString() + day.toString();
    }
    return date.getFullYear() + _separator + month + _separator + day;
};

utils.time.getMonthNow = function(separator) {
    let _separator = '/';
    if (separator) {
        _separator = separator;
    }

    let date = new Date();

    let _month = date.getMonth() + 1;
    let month = _month > 9 ? _month : ('0' + _month.toString());
  // let day = date.getDate() > 9 ? date.getDate() : ('0' + date.getDate().toString())

    return date.getFullYear() + _separator + month + _separator + '01';
};

utils.time.getTime = function() {
    let date = new Date();

    let _hour = date.getHours() > 9 ? date.getHours() : ('0' + date.getHours().toString());
    let _min = date.getMinutes() > 9 ? date.getMinutes() : ('0' + date.getMinutes().toString());
    let _sec = date.getSeconds() > 9 ? date.getSeconds() : ('0' + date.getSeconds().toString());

    return _hour + ':' + _min + ':' + _sec;
};

utils.time.getDateTime = function(separator) {
    let _separator = '/';
    if (separator) {
        _separator = separator;
    }

    return utils.time.getDate(_separator) + ' ' + utils.time.getTime();
};

utils.time.utc2Locale = function(utcStr, separator, separator1) {
    let _separator = '/';
    if (separator) {
        _separator = separator;
    }
    let _separator1 = ' ';
    if (separator1) {
        _separator1 = separator1;
    }

    let utc = parseInt(utcStr, 10) * 1000;
    let date = new Date(utc);

    let _month = date.getMonth() + 1;
    let month = _month > 9 ? _month : ('0' + _month.toString());
    let day = date.getDate() > 9 ? date.getDate() : ('0' + date.getDate().toString());

    let _hour = date.getHours() > 9 ? date.getHours() : ('0' + date.getHours().toString());
    let _min = date.getMinutes() > 9 ? date.getMinutes() : ('0' + date.getMinutes().toString());
    let _sec = date.getSeconds() > 9 ? date.getSeconds() : ('0' + date.getSeconds().toString());

    let localeString = date.getFullYear() + _separator + month + _separator + day + _separator1 +
    _hour + ':' + _min + ':' + _sec;
    return localeString;
};

utils.time.locale2Utc = function(localeStr) {
    let timeStr = localeStr.replace(/-/g, '/');
    let date = new Date(timeStr);

    let utcMsStr = date.getTime().toString();
    let utcSStr = utcMsStr.substr(0, utcMsStr.length - 3);

    return utcSStr;
};
utils.time.getUTC = function(){
    let utc = new Date().getTime()/1000;
    return parseInt(utc).toString();
}

utils.dom.getSelectOption = function(selectId, which) {
    let select = document.getElementById(selectId);
    let index = select.selectedIndex;

    if (!which) {
        return {
            'value': select.options[index].value,
            'text': select.options[index].text,
        };
    } else {
        if (which == 'value') {
            return select.options[index].value;
        } else if (which == 'text') {
            return select.options[index].text;
        }
    }
};

utils.number.dec2Hex = function(dec) {
    let sHex;
    let hexStr = (dec).toString(16);
    switch (hexStr.length) {
    case 1:
        sHex = '0x0' + hexStr;
        break;
    case 2:
        sHex = '0x' + hexStr;
        break;
    default:
        sHex = '0x' + hexStr;
    }
    return sHex;
};

utils.number.hex2Dec = function(hex) {
    if (typeof hex === 'string') {
        return parseInt(hex, 16);
    } else if (typeof hex === 'number') {
        return hex;
    }
};

utils.number.getHighBit = function(num) {
    let hexStr = '';
    if (typeof num === 'number') {
        hexStr = num.toString(16);
    } else if (typeof num === 'string') {
        hexStr = num;
    }

    let _high;
    let sHigh;
    switch (hexStr.length) {
    case 5:
        _high = hexStr.substr(0, 1);
        sHigh = '0x0' + _high;
        break;
    case 6:
        _high = hexStr.substr(0, 2);
        sHigh = '0x' + _high;
        break;
    default:
    }

    return sHigh;
};

utils.number.getLowBit = function(num, count) {
    let hexStr = '';
    if (typeof num === 'number') {
        hexStr = num.toString(16);
    } else if (typeof num === 'string') {
        hexStr = num;
    }

    let sLow = hexStr.substr(hexStr.length - count);
    let nLow = parseInt(sLow, 16);

    return {
        dec: nLow,
        hex: sLow,
    };
};

utils.number.getVaildIndex = function(ids) {
    let index = 1;
    let idsLength = ids.length;
    while (index) {
        let hasExist = false;
        for (let i = 0; i < idsLength; i++) {
            if (ids[i] == index) {
                hasExist = true;
                break;
            }
        }

        if (hasExist == false) {
            break;
        }

        index++;
    }

    return index;
};

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

utils.number.guid = function (mode) {
    if(mode === 0)
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    else
        return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
};

utils.dataProcess.getId = function(highOrder, lowOrder) {
  /** 顺序号index（低位）转为16进制 */
    let lowOrderHex = lowOrder.toString(16);
    let _lowHex = null;
    switch (lowOrderHex.length) {
    case 1:
        _lowHex = '000' + lowOrderHex;
        break;
    case 2:
        _lowHex = '00' + lowOrderHex;
        break;
    case 3:
        _lowHex = '0' + lowOrderHex;
        break;
    case 4:
        _lowHex = lowOrderHex;
        break;
    default:
    }

    let idHexStr = highOrder + _lowHex;
    let idHex = parseInt(idHexStr, 16).toString(16); // 转成16进制字符串显示
    let id = parseInt(idHexStr, 16);  // 转成10进制

    return {
        'id': id,
        'idHex': idHex,
    };
};

/**
 * k-v键值对的字符串转化为对象
 * @param {str} str k-v键值对的字符串
 */
utils.dataProcess.kvStrToObj = function(str) {
    let arr = str.split(';');
    let obj = {};
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== '') {
            let arrs = arr[i].split('=');
            obj[arrs[0]] = arrs[1];
        }
    }
    return obj;
};

/**
 *
 *  数据转换
 */

utils.data.trans = function(value,fmt){
    if (fmt === 'utc' || fmt ==='utcTime')
        return utils.time.locale2Utc(value);
    else return value;
};

/*5.加载文件*/
/* 已加载文件缓存列表,用于判断文件是否已加载过，若已加载则不再次加载*/
var classcodes =[];
window.Import={
    /*加载一批文件，_files:文件路径数组,可包括js,css,less文件,succes:加载成功回调函数*/
    LoadFileList:function(_files,succes){
        var FileArray=[];
        if(typeof _files==="object"){
            FileArray=_files;
        }else{
            /*如果文件列表是字符串，则用,切分成数组*/
            if(typeof _files==="string"){
                FileArray=_files.split(",");
            }
        }
        if(FileArray!=null && FileArray.length>0){
            var LoadedCount=0;
            for(var i=0;i< FileArray.length;i++){
                loadFile(FileArray[i],function(){
                    LoadedCount++;
                    if(LoadedCount==FileArray.length){
                        succes();
                    }
                })
            }
        }
        /*加载JS文件,url:文件路径,success:加载成功回调函数*/
        function loadFile(url, success) {
            if (!FileIsExt(classcodes,url)) {
                var ThisType=GetFileType(url);
                var fileObj=null;
                if(ThisType==".js"){
                    fileObj=document.createElement('script');
                    fileObj.src = url;
                }else if(ThisType==".css"){
                    fileObj=document.createElement('link');
                    fileObj.href = url;
                    fileObj.type = "text/css";
                    fileObj.rel="stylesheet";
                }else if(ThisType==".less"){
                    fileObj=document.createElement('link');
                    fileObj.href = url;
                    fileObj.type = "text/css";
                    fileObj.rel="stylesheet/less";
                }
                success = success || function(){};
                fileObj.onload = fileObj.onreadystatechange = function() {
                    if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
                        success();
                        classcodes.push(url)
                    }
                }
                document.getElementsByTagName('head')[0].appendChild(fileObj);
            }else{
                success();
            }
        }
        /*获取文件类型,后缀名，小写*/
        function GetFileType(url){
            if(url!=null && url.length>0){
                return url.substr(url.lastIndexOf(".")).toLowerCase();
            }
            return "";
        }
        /*文件是否已加载*/
        function FileIsExt(FileArray,_url){
            if(FileArray!=null && FileArray.length>0){
                var len =FileArray.length;
                for (var i = 0; i < len; i++) {
                    if (FileArray[i] ==_url) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
}
//
// var FilesArray=["js/index.js","js/ClassInherit1.js","js/highcharts_2.21.js","css/index.css"];
// Import.LoadFileList(FilesArray,function(){
//     /*这里写加载完成后需要执行的代码或方法*/
// });