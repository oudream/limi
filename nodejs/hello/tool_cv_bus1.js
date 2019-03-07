
const CjLog = require('./../common/cjs/cjlog.js');

let fs = require('fs');


let mainCvBus1 = function (fp1, fp2) {
    if (!(fp1 && fp2)) {
        CjLog.logError('mainCvBus1 param invalid!');
        return;
    }
    fs.openSync(fp1, 'r+');

    };

let fp1 = 'C:\\ddd\\ygct\\ics_nodejs_v2_alpha\\assets\\hello\\cc4k\\bus.json';
let fp2 = 'C:\\ddd\\ygct\\ics_nodejs_v2_alpha\\assets\\hello\\cc4k\\gis_bus1.json';
mainCvBus1(fp1, fp2);