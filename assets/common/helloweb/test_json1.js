/**
 * Created by oudream on 2017/5/22.
 */

let testJson11 = function() {
    function ProcessStatus() {
    // std::string
        this.getLogClass = function() {
            return 'ProcessStatus';
        };

        this.aid = 0;
        this.ord = 0;
        this.process = '';
        this.isRunnig = false;
        this.startTime = 0;
        this.startTimes = 0;
        this.receiveBytes = 0;
        this.lastReceiveTime = 0;
        this.recordTime = 0;
        this.syscpu = 0;
        this.sysmem = 0;
        this.cpu = 0;
        this.mem = 0;
        this.obj = {
            a: 'a',
            b: 'B',
            c: 'c',
            o: {
                e: 1,
            },
        };

    // const ProcessStatus &pss
        this.assignedFrom = function(pss) {
            this.isRunnig = pss.isRunnig;
            this.startTime = pss.startTime;
            this.startTimes = pss.startTimes;
            this.receiveBytes = pss.receiveBytes;
            this.lastReceiveTime = pss.lastReceiveTime;
            this.syscpu = pss.syscpu;
            this.sysmem = pss.sysmem;
            this.cpu = pss.cpu;
            this.mem = pss.mem;
        };

        this.toJson = function() {
            return JSON.stringify(this);
        };
    }

    let s1 = '{"aid":0,"ord":0,"process":"","isRunnig":false,"startTime":0,"startTimes":0,"receiveBytes":0,"lastReceiveTime":0,"recordTime":0,"syscpu":0,"sysmem":0,"cpu":0,"mem":0,"obj":{"a":"a","b":1,"c":"c","o":{"e":1}}}';

    this.refer2object = function(obj, referObject) {
        if (typeof obj !== 'object' || typeof referObject !== 'object') {
            return;
        }
        let sNames = Object.getOwnPropertyNames(obj);
        for (let i = 0; i < sNames.length; i++) {
            let sName = sNames[i];
            if (referObject.hasOwnProperty(sName)) {
                let sType1 = typeof obj[sName];
                let sType2 = typeof referObject[sName];
                if (sType1 === sType2) {
                    if (sType1 === 'object') {
                        this.refer2object(obj[sName], referObject[sName]);
                    }
                } else {
                    switch (sType2) {
                    case 'string':
                        obj[sName] = obj[sName].toString();
                        break;
                    case 'number':
                        obj[sName] = Number(obj[sName]);
                        break;
                    case 'boolean':
                        obj[sName] = Boolean(obj[sName]);
                        break;
                    }
                }
            }
        }
    };

    this.fromJson = function(sJson, fnClass) {
        if (typeof sJson !== 'string' && !(sJson instanceof String)) {
            return null;
        }
        try {
            let obj1 = JSON.parse(sJson);
            if (fnClass) {
                let r = new fnClass();
                this.refer2object(obj1, r);
            }
            return obj1;
        } catch (e) {
        }
        return null;
    };

    let obj2 = this.fromJson(s1, ProcessStatus);
    console.log(obj2);
  // let obj1 = new ProcessStatus();
  // let s2 = JSON.stringify(obj1);
  // console.log( s2 );
};
// testJson11();


let testJson12Array = function () {
    let arr1 = [
        [16777376, 180, 1, 1522071251000, 37123, 0],
        [16777376, 180, 1, 1522071251000, 37123, 0],
        [16777376, 180, 1, 1522071251000, 37123, 0]
    ];
    console.log(JSON.stringify(arr1));

    let sJson = '[[16777376,180,1,1522071251000,37123,0],[16777376,180,1,1522071251000,37123,0],[16777376,180,1,1522071251000,37123,0]]';
    try {
        let obj1 = JSON.parse(sJson);
        console.log(obj1);
    } catch (e) {
    }
};
testJson12Array();