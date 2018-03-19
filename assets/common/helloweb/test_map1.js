/**
 * Created by oudream on 2017/5/5.
 */

var testMap11 = function () {
    var mm = new Map();
    var sKey1 = "f:/adfad asfasdf/sadfasd fasdf.sdfas sadfasdf2";
    var sKey2 = "f:/adfad asfasdf/sadfasd fasdf.sdfas sadfasdf1";
    mm.set(sKey1, new Date())
    mm[sKey2] = [11, 22];
    var attrs = Object.getOwnPropertyNames(mm);

    var sFilePath = null, attach = null;
    for ([sFilePath, attach] of mm) {
        break;
    }
    console.log(`${sFilePath}, ${attach}`);
};
testMap11();
