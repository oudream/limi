(function() {
    'use strict';

  // define cjs
    if (typeof exports === 'object' && typeof global === 'object') {
        global.cjs = global.cjs || {};
    } else if (typeof window === 'object') {
        window.cjs = window.cjs || {};
    } else {
        throw Error('cjs only run at node.js or web browser');
    }
  // define CjJson
    let CjConfig = cjs.CjConfig || {};
    cjs.CjConfig = CjConfig;
  // require depend
    if (typeof exports === 'object' && typeof global === 'object') {
    // export CjConfig
        exports = module.exports = CjConfig;
        if (!cjs.CjJson) require('./cjjson');
    }

    if (CjConfig.hasOwnProperty('sources')) return;

    CjConfig.sources = [];
    CjConfig.configs = {};

    CjConfig.append = function append(sJsons) {
        cjs.CjJson.parse(sJsons, configs);
    };
})();
