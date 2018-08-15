let utils = {
    'version': '1.0.0',
    'time': {},
    'dom': {},
    'number': {},
    'dataProcess': {},
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
