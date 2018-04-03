/**
 * Created by liuchaoyu on 2016-12-14.
 */


var mainPageFunc = {
    'version' : '1.0.0',
    'base' : {},
};

mainPageFunc.base.save = function (pageObj) {
    var index = cjCommon.findInArray(pageObj.optType,'new');

    if (index >= 0) {
        dataInteraction.db.insertPage(pageObj, function (retData) {
            //todo 判断sql语句运行后返回是否成功

            pageObj.isChange = false;
            pageObj.optType = [];
            pageObj.optRec = [];

            dataStorage.cache.updateElement(pageObj);

            uiManager.workAreaManager.clearChangeStatus(pageObj.id);

            return 1;
        });
    }

    index = cjCommon.findInArray(pageObj.optType,'del');

    if (index >= 0) {
        dataInteraction.db.deletePage(pageObj.id, function (retData) {
            //todo 判断sql语句运行后返回是否成功

            dataStorage.cache.removeElement(pageObj,'page_list');

            return 1;
        });
    }

    return -1;
};


mainPageFunc.base.setConfig = function (confObj) {
    this.curConfig = cjCommon.clone(confObj);
};

mainPageFunc.base.getConfig = function () {
    return cjCommon.clone(this.curConfig);
};

mainPageFunc.base.saveConfig = function (confObj) {

    var attr;
    for (attr in confObj) {
        var _k = extendConfig.config_prefix + attr;

        localStorage.setItem(_k,confObj[attr]);
    }
};

mainPageFunc.base.loadConfig = function () {

    var _config = {};
    for (var i = 0; i < localStorage.length; i++) {
        var _k = localStorage.key(i);
        if (_k.indexOf(extendConfig.config_prefix) == -1) {
            continue;
        }

        var _key = _k.replace(extendConfig.config_prefix,'');
        _config[_key] = localStorage.getItem(_k);
    }

    return _config;
};