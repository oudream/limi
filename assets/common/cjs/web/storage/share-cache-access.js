/**
 * Created by liuchaoyu on 2017-03-15.
 */

'use strict';

let shareCache = null;

class ShareCacheAccess {

    static openShareCache() {
        if (!shareCache) {
            shareCache = remote.getGlobal('shareCache');
        }
    }

    static closeShareCache() {
        shareCache = null;
    }

    static set(id, key, value) {
        if (typeof key == 'string') {
            let _shareData = shareCache[id];
            _shareData[key] = value;
        } else if (typeof key == 'object') {
            shareCache[id] = key;
        }
    }

    static get(id, key) {
        let v = null;
        if (key) {
            v = shareCache[id][key];
        } else {
            v = shareCache[id];
        }

        return v;
    }

    static getAll(filterId, fn_callback) {
        let err = null;

        if (shareCache) {
            for (let t in shareCache) {
                if (t !== filterId) {
                    fn_callback(t, shareCache[t], err);
                }
            }
        } else {
            err = {
                code: 'Error : ShareCache is null',
            };

            fn_callback(null, null, err);
        }
    }

}
