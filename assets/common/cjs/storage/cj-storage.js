/**
 * Created by liuchaoyu on 2016-03-23.
 */


let cjTempStorage = {
    version: '2.0.0',
};

let cjLocalStorage = {
    version: '1.0.0',
};

cjTempStorage.save = function(k, v) {
    sessionStorage.setItem(k, v);
};

cjTempStorage.load = function(k) {
    return sessionStorage.getItem(k);
};

cjTempStorage.clearByKey = function(k) {
    sessionStorage.removeItem(k);
};

cjTempStorage.saveArray = function(k, array) {
    if (k === undefined || k.length === 0 || array === undefined || array.length === undefined) {
        return false;
    }

    let str = JSON.stringify(array);

    this.save(k, str);

    return true;
};

cjTempStorage.loadArray = function(k) {
    if (k === undefined || k.length === 0) {
        return false;
    }

    let str = this.load(k);

    let array = JSON.parse(str);

    return array;
};

cjTempStorage.deleteArray = function(k) {
    if (k === undefined || k.length === 0) {
        return false;
    }

    cjTempStorage.clearByKey(k);

    return true;
};

cjTempStorage.saveObj = function(k, obj) {
    if (k === undefined || k.length === 0 || obj === undefined || typeof obj != 'object') {
        return false;
    }

    function clone(obj) {
        return obj;
    }

    let str = JSON.stringify(clone(obj));

    this.save(k, str);

    return true;
};

cjTempStorage.loadObj = function(k) {
    if (k === undefined || k.length === 0) {
        return false;
    }

    let str = this.load(k);

    let obj = JSON.parse(str);

    return obj;
};

cjTempStorage.deleteObj = function(k) {
    if (k === undefined || k.length === 0) {
        return false;
    }

    this.clearByKey(k);
};

cjTempStorage.clearAll = function() {
    sessionStorage.clear();
};

cjLocalStorage.save = function(k, v) {
    localStorage.setItem(k, v);
};

cjLocalStorage.load = function(k) {
    return localStorage.getItem(k);
};

cjLocalStorage.clearByKey = function(k) {
    localStorage.removeItem(k);
};

cjLocalStorage.saveArray = function(k, array) {
    if (k === undefined || k.length === 0 || array === undefined || array.length === undefined) {
        return false;
    }

    let str = JSON.stringify(array);

    this.save(k, str);

    return true;
};

cjLocalStorage.loadArray = function(k) {
    if (k === undefined || k.length === 0) {
        return false;
    }

    let str = this.load(k);

    let array = JSON.parse(str);

    return array;
};

cjLocalStorage.deleteArray = function(k) {
    if (k === undefined || k.length === 0) {
        return false;
    }

    this.clearByKey(k);

    return true;
};

cjLocalStorage.saveObj = function(k, obj) {
    if (k === undefined || k.length === 0 || obj === undefined || typeof obj != 'object') {
        return false;
    }

    function clone(obj) {
        return obj;
    }

    let str = JSON.stringify(clone(obj));

    this.save(k, str);

    return true;
};

cjLocalStorage.loadObj = function(k) {
    if (k === undefined || k.length === 0) {
        return false;
    }

    let str = this.load(k);

    if (str) {
        var obj = JSON.parse(str);
    } else {
        var obj = undefined;
    }

    return obj;
};

cjLocalStorage.deleteObj = function(k) {
    if (k === undefined || k.length === 0) {
        return false;
    }

    this.clearByKey(k);
};

cjLocalStorage.clearAll = function() {
    localStorage.clear();
};
