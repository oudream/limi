/**
 * Created by liuchaoyu on 2017-03-13.
 */

"use strict";

global.shareCache = {};

class ShareCache {
    // constructor () {
    //
    //     global.shareCache = {};
    //
    // }
    //
    static createShareCache (id, data) {

        global.shareCache[id] = data;

    }

    static closeShareCache (id) {

        global.shareCache[id] = null;
        delete global.shareCache[id];

    }

    static set (id,key,value) {

        let _shareData = global.shareCache[id];

        if (!_shareData) {
            return null;
        }
        _shareData[key] = value;

    }

    static get (id,key) {

        let _shareData = global.shareCache[id];

        if (!_shareData) {
            return null;
        }

        if (key) {
            return _shareData[key];
        }
        else {
            return _shareData;
        }

    }

    static remove (id,key) {

        global.shareCache[id][key] = null;
        delete global.shareCache[id][key];

    }

    static clear (id) {

        global.shareCache[id] = null;
        global.shareCache[id] = {};

    }

}

module.exports = {
    'ShareCache': ShareCache,
};