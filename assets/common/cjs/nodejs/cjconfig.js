/**
 * Created by oudream on 2017/1/11.
 */

'use strict';

// define cjs
global.cjs = global.cjs || {};
// define CjJson
let CjConfig = cjs.CjConfig || {};
cjs.CjConfig = CjConfig;
// require depend
exports = module.exports = CjConfig;
if (! cjs.CjMeta) require('./../cjjson');

if (CjConfig.hasOwnProperty('loadDefault')) return;

CjConfig.loadDefault = function loadDefault() {

};


loadDefault();

