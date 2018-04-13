/**
 * Created by oudream on 2017/5/5.
 */

let testMap11 = function() {
    let mm = new Map();
    let sKey1 = 'f:/adfad asfasdf/sadfasd fasdf.sdfas sadfasdf2';
    let sKey2 = 'f:/adfad asfasdf/sadfasd fasdf.sdfas sadfasdf1';
    mm.set(sKey1, new Date());
    mm[sKey2] = [11, 22];
    let attrs = Object.getOwnPropertyNames(mm);

    let sFilePath = null, attach = null;
    for ([sFilePath, attach] of mm) {
        break;
    }
    console.log(`${sFilePath}, ${attach}`);
};
testMap11();
