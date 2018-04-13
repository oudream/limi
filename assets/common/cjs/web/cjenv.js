/**
 * Created by oudream on 2016/12/23.
 */

(function() {
    'use strict';

    var CjEnv = CjEnv || {};

    if ( typeof window === 'object' ) {
        window.cjs = window.cjs || {};
    } else {
        throw Error('cjs only run at  web browser');
    }

    cjs.CjEnv = CjEnv;

    /**
     * get url params
     * @param name
     * @returns {*}
     */
    CjEnv.getUrlParam = function getUrlParam(name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    };
})();
