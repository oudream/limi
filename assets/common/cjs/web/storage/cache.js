'use strict';

let cacheOpt = {
    version: '1.0.0',
};

/**
 * 获取本地缓存的数据
 * @param type : string 缓存数据的类别
 * @param filter : object 过滤器的对象
 * @returns {object} : 返回数据对象
 */
cacheOpt.get = function(type, filter) {
    switch (type) {
    case 'alarm-info' : {
        let alarmInfoArray = cjLocalStorage.loadObj('omc-alarm-info-config');
        let count = alarmInfoArray.length;

        if (!filter) {
            let _alarmInfoArray = null;
            if (_alarmInfoArray) {
                _alarmInfoArray = JSON.parse(JSON.stringify(alarmInfoArray));
            } else {
                _alarmInfoArray = alarmInfoArray;
            }
            alarmInfoArray = null;
            return _alarmInfoArray;
        }

        let _alarmInfos = [];
        for (let i = 0; i < count; i++) {
            let alarmInfo = alarmInfoArray[i];

            if (alarmInfo[filter.key] == filter.value) {
                if (filter.key == 'AlarmLevel' || filter.key == 'AlarmClass') {
                    _alarmInfos.push(alarmInfo);
                } else {
                    let _alarmInfo = JSON.parse(JSON.stringify(alarmInfo));

                    alarmInfo = null;
                    alarmInfoArray = null;
                    return _alarmInfo;
                }
            }
        }

        if (filter.key == 'AlarmLevel' || filter.key == 'AlarmClass') {
            return _alarmInfos;
        } else {
            return null;
        }
    }
        break;

    case 'server-config': {
        let _clientConfig = cjLocalStorage.loadObj('server-config');

        let clientConfig = null;

        if (_clientConfig) {
            clientConfig = JSON.parse(JSON.stringify(_clientConfig));
        } else {
            clientConfig = _clientConfig;
        }
        _clientConfig = null;

        return clientConfig;
    }
        break;

    case 'ne-config': {
        let _neConfig = cjLocalStorage.loadObj('omc-ne-config');

        let neConfig = null;
        if (_neConfig) {
            neConfig = JSON.parse(JSON.stringify(_neConfig));
        } else {
            neConfig = _neConfig;
        }
        _neConfig = null;

        return neConfig;
    }
        break;

    case 'alarm-level': {
        let _alarmLevel = cjLocalStorage.loadObj('omc-alarm-level-config');

        let alarmLevel = null;
        if (_alarmLevel) {
            alarmLevel = JSON.parse(JSON.stringify(_alarmLevel));
        } else {
            alarmLevel = _alarmLevel;
        }
        _alarmLevel = null;

        return alarmLevel;
    }
        break;

    case 'alarm-config': {
        let _alarmConfig = cjLocalStorage.loadObj('omc-alarm-config');

        let alarmConfig = null;
        if (_alarmConfig) {
            alarmConfig = JSON.parse(JSON.stringify(_alarmConfig));
        } else {
            alarmConfig = _alarmConfig;
        }
        _alarmConfig = null;

        return alarmConfig;
    }
        break;

    case 'ne-mgr': {
        let _neMgr = cjLocalStorage.loadObj('omc-ne-mgr');

        let neMgr = null;
        if (_neMgr) {
            neMgr = JSON.parse(JSON.stringify(_neMgr));
        } else {
            neMgr = _neMgr;
        }
        _neMgr = null;

        return neMgr;
    }
        break;

    case 'alarm-mgr': {
        let _alarmMgr = cjLocalStorage.loadObj('omc-alarm-mgr');

        let alarmMgr = null;
        if (_alarmMgr) {
            alarmMgr = JSON.parse(JSON.stringify(_alarmMgr));
        } else {
            alarmMgr = _alarmMgr;
        }
        _alarmMgr = null;

        return alarmMgr;
    }
        break;

    case 'used-alarmType-list': {
        let _list = cjLocalStorage.loadObj('omc-used-alarmType-list');

        let list = null;
        if (_list) {
            list = JSON.parse(JSON.stringify(_list));
        } else {
            list = _list;
        }
        _list = null;

        return list;
    }
        break;

    case 'alarm-rec': {
        let _rec = cjLocalStorage.loadObj('omc-alarm-rec');

        let rec = null;
        if (_rec) {
            rec = JSON.parse(JSON.stringify(_rec));
        } else {
            rec = _rec;
        }
        _rec = null;

        return rec;
    }
        break;

    default:
    }
};

/**
 * 设置本地缓存数据
 * @param type : string 缓存数据的类别
 * @param data : object 数据对象
 */
cacheOpt.set = function(type, data) {
    let key = null;
    switch (type) {
    case 'alarm-info' :
        key = 'omc-alarm-info-config';
        break;

    case 'server-config':
        key = 'server-config';
        break;

    case 'ne-config':
        key = 'omc-ne-config';
        break;

    case 'alarm-config':
        key = 'omc-alarm-config';
        break;

    case 'alarm-level':
        key = 'omc-alarm-level-config';
        break;

    case 'ne-mgr':
        key = 'omc-ne-mgr';
        break;

    case 'used-alarmType-list':
        key = 'omc-used-alarmType-list';
        break;

    case 'alarm-rec':
        key = 'omc-alarm-rec';
        break;

    default:
    }

    cjLocalStorage.saveObj(key, data);
};
