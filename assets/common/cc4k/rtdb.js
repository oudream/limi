(function() {
    'use strict';

    if (typeof exports === 'object' && typeof global === 'object') {
        global.cc4k = global.cc4k || {};
    } else if (typeof window === 'object') {
        window.cc4k = window.cc4k || {};
    } else {
        throw Error('cjs only run at node.js or web browser');
    }
    let rtdb = cc4k.rtdb || {};
    cc4k.rtdb = rtdb;
    if (typeof exports === 'object' && typeof global === 'object') {
        exports = module.exports = rtdb;
    }

    let myDebug = function(...args) {
        console.log.apply(null, args);
    };

    let EnumMeasureType = {
        none: 0,
        monsb: 1,
        ycadd: 2,
        straw: 3,
    };
    rtdb.EnumMeasureType = EnumMeasureType;

    let getMeasureTypeById = function getMeasureTypeById(measureId) {
        let iId = Number(measureId);
        if (iId >= 0x1000000000 && iId < 0x2000000000) {
            return EnumMeasureType.monsb;
        } else if (iId >= 0x2000000000 && iId < 0x3000000000) {
            return EnumMeasureType.ycadd;
        } else if (iId >= 0x3000000000 && iId < 0x4000000000) {
            return EnumMeasureType.straw;
        } else {
            return EnumMeasureType.none;
        }
    };
    rtdb.getMeasureTypeById = getMeasureTypeById;

    let EnumMeasureTableName = {
        none: '',
        monsb: 'T_RT_YX',
        ycadd: 'T_RT_YC',
        straw: 'T_RT_YW',
    };
    rtdb.EnumMeasureTableName = EnumMeasureTableName;

    let getMeasureTableNameById = function getMeasureTableNameById(measureId) {
        let iId = Number(measureId);
        if (iId >= 0x1000000000 && iId < 0x2000000000) {
            return EnumMeasureTableName.monsb;
        } else if (iId >= 0x2000000000 && iId < 0x3000000000) {
            return EnumMeasureTableName.ycadd;
        } else if (iId >= 0x3000000000 && iId < 0x4000000000) {
            return EnumMeasureTableName.straw;
        } else {
            return EnumMeasureTableName.none;
        }
    };
    rtdb.getMeasureTableNameById = getMeasureTableNameById;

    let MeasureBase = function MeasureBase(...args) {
        let iId = null;
        let sUrl = null;
        if (args.length > 0) {
            let arg0 = args[0];
            if (typeof arg0 === 'number') {
                iId = arg0;
                if (args.length > 1) {
                    let arg1 = args[1];
                    if (typeof arg0 === 'string') {
                        sUrl = arg1;
                    }
                }
            } else if (typeof arg0 === 'string') {
                sUrl = arg0;
                if (args.length > 1) {
                    let arg1 = args[1];
                    if (typeof arg0 === 'number') {
                        iId = arg1;
                    }
                }
            } else if (arg0 !== null && typeof arg0 === 'object') {
                this.type = arg0.type ? arg0.type : null;
                this.id = arg0.id ? arg0.id : null;
                this.url = arg0.url ? arg0.url : null;
                this.neno = arg0.neno ? arg0.neno : null;
                this.code = arg0.code ? arg0.code : null;
                this.title = arg0.title ? arg0.title : '';
                this.value = arg0.value ? arg0.value : null;
                this.quality = arg0.quality ? arg0.quality : null;
                this.refreshTime = arg0.refreshTime ? arg0.refreshTime : null;
                this.changedTime = arg0.changedTime ? arg0.changedTime : null;
                this.refreshSourceId = arg0.refreshSourceId ? arg0.refreshSourceId : null;
                this.changedSourceId = arg0.changedSourceId ? arg0.changedSourceId : null;
                this.refreshReasonId = arg0.refreshReasonId ? arg0.refreshReasonId : null;
                this.changedReasonId = arg0.changedReasonId ? arg0.changedReasonId : null;
                this.equalStrategyId = arg0.equalStrategyId ? arg0.equalStrategyId : null;
                this.res = arg0.res ? arg0.res : 0;
                return this;
                //     this.type             = arg0.type            ? arg0.type            : null;
                //     this.id               = arg0.id              ? arg0.id              : null;
                //     this.url              = arg0.url             ? arg0.url             : null;
                //     this.neno             = arg0.neno            ? arg0.neno            : null;
                //     this.code             = arg0.code            ? arg0.code            : null;
                //     this.title            = arg0.title           ? arg0.title           : null;
                //     this.value            = arg0.value           ? arg0.value           : null;
                //     this.quality          = arg0.quality         ? arg0.quality         : null;
                //     this.refreshTime      = arg0.refreshTime     ? arg0.refreshTime     : null;
                //     this.changedTime      = arg0.changedTime     ? arg0.changedTime     : null;
                //     this.refreshSourceId  = arg0.refreshSourceId ? arg0.refreshSourceId : null;
                //     this.changedSourceId  = arg0.changedSourceId ? arg0.changedSourceId : null;
                //     this.refreshReasonId  = arg0.refreshReasonId ? arg0.refreshReasonId : null;
                //     this.changedReasonId  = arg0.changedReasonId ? arg0.changedReasonId : null;
                //     this.equalStrategyId  = arg0.equalStrategyId ? arg0.equalStrategyId : null;
                //     this.res              = arg0.res             ? arg0.res             : null;
            }
        }
        this.type = null;
        this.id = iId;
        this.url = sUrl;
        this.neno = null;
        this.code = null;
        this.title = null;
        this.value = null;
        this.quality = null;
        this.refreshTime = null;
        this.changedTime = null;
        this.refreshSourceId = null;
        this.changedSourceId = null;
        this.refreshReasonId = null;
        this.changedReasonId = null;
        this.equalStrategyId = null;
        this.res = null;
    };
    rtdb.MeasureBase = MeasureBase;

    MeasureBase.prototype.setValue = function(v) {
        myDebug('!!!error. setValue is abstract method!');
    };

    MeasureBase.prototype.setVQT = function(v, q, t) {
        myDebug('!!!error. setValue is abstract method!');
    };

    MeasureBase.prototype.setVTR = function(v, t, r) {
        myDebug('!!!error. setValue is abstract method!');
    };

    let MeasureManagerBase = function() {
        this.measures = [];
        this.MeasureClass = MeasureBase;
    };
    rtdb.MeasureManagerBase = MeasureManagerBase;

    MeasureManagerBase.prototype.findById = function findById(iId = 0) {
        let measures = this.measures;
        for (let i = 0; i < measures.length; i++) {
            let measure = measures[i];
            if (measure.id === iId) {
                return measure;
            }
        }
        return null;
    };

    MeasureManagerBase.prototype.findByUrl = function findByUrl(sUrl = '') {
        let measures = this.measures;
        for (let i = 0; i < measures.length; i++) {
            let measure = measures[i];
            if (measure.url === sUrl) {
                return measure;
            }
        }
        return null;
    };

    MeasureManagerBase.prototype.findByNenoCode = function findByNenoCode(neno = 0, code = '') {
        let iNeno = Number(neno);
        let sCode = String(code);
        let measures = this.measures;
        for (let i = 0; i < measures.length; i++) {
            let measure = measures[i];
            if (measure.neno === iNeno && measure.code === sCode) {
                return measure;
            }
        }
        return null;
    };

    MeasureManagerBase.prototype.append = function append(measure) {
        if (measure) {
            let bId = (typeof measure.id === 'number' && measure.id > 0 && this.findById(measure.id) === null);
            let bUrl = (typeof measure.url === 'string' && this.findByUrl(measure.url) === null);
            if (bId || bUrl) {
                let newMeasure = new this.MeasureClass(measure);
                this.measures.push(newMeasure);
                return newMeasure;
            }
        } else {
            return null;
        }
    };

    MeasureManagerBase.prototype.appendById = function appendById(iId) {
        if (typeof iId === 'number' && iId > 0 && this.findById(iId) === null) {
            let measure = new this.MeasureClass(iId);
            this.measures.push(measure);
            return measure;
        } else {
            return null;
        }
    };

    MeasureManagerBase.prototype.appendByUrl = function appendByUrl(sUrl) {
        if (typeof sUrl === 'string' && this.findByUrl(sUrl) === null) {
            let measure = new this.MeasureClass(sUrl);
            this.measures.push(measure);
            return measure;
        } else {
            return null;
        }
    };

    MeasureManagerBase.prototype.remove = function remove(measure) {
        let r = 0;
        if (measure) {
            let bId = (typeof measure.id === 'number' && measure.id > 0);
            let bUrl = (typeof measure.url === 'string');
            if (bId) r = this.removeById(measure.id);
            if (bUrl) r += this.removeByUrl(measure.url);
        }
        return r;
    };

    MeasureManagerBase.prototype.removeById = function removeById(iId) {
        let r = 0;
        if (typeof iId === 'number') {
            let measures = this.measures;
            for (let i = measures.length - 1; i >= 0; i--) {
                let measure = measures[i];
                if (measure.id === iId) {
                    measures.splice(i, 1);
                    r++;
                }
            }
        }
        return r;
    };

    MeasureManagerBase.prototype.removeByUrl = function removeByUrl(sUrl) {
        let r = 0;
        if (typeof sUrl === 'string') {
            let measures = this.measures;
            for (let i = measures.length - 1; i >= 0; i--) {
                let measure = measures[i];
                if (measure.url === sUrl) {
                    measures.splice(i, 1);
                    r++;
                }
            }
        }
        return r;
    };

    MeasureManagerBase.prototype.getReqMeasures = function getReqMeasures() {
        let r = [];
        let measures = this.measures;
        for (let i = 0; i < measures.length; i++) {
            let measure = measures[i];
            let reqMeasure = {
                mid: measure.id,
                url: measure.url,
            };
            r.push(reqMeasure);
        }
        return r;
    };

    // # monsb
    let MonsbMeasure = function MonsbMeasure(...args) {
        MeasureBase.apply(this, args);
        this.type = EnumMeasureType.monsb;
        this.value = -1;
    };
    MonsbMeasure.prototype = Object.create(MeasureBase.prototype);
    MonsbMeasure.prototype.constructor = MonsbMeasure;
    rtdb.MonsbMeasure = MonsbMeasure;

    MonsbMeasure.prototype.setValue = function(v) {
        let newValue = Number(v);
        if (newValue !== this.value) {
            this.value = newValue;
        }
    };

    MonsbMeasure.prototype.setVQT = function(v, q, t) {
        this.setValue(v);
        if (q !== this.quality) {
            this.quality = q;
        }
        if (t !== this.refreshTime) {
            this.refreshTime = t;
        }
    };

    MonsbMeasure.prototype.setVTR = function(v, t, r) {
        this.setValue(v);
        if (t !== this.refreshTime) {
            this.refreshTime = t;
        }
        if (r !== this.res) {
            this.res = r;
        }
    };

    let MonsbManager = function MonsbManager() {
        MeasureManagerBase.call(this);
        this.monsbs = this.measures;
        this.MeasureClass = MonsbMeasure;
    };
    MonsbManager.prototype = Object.create(MeasureManagerBase.prototype);
    MonsbManager.prototype.constructor = MonsbManager;
    rtdb.MonsbManager = MonsbManager;

    // # ycadd
    let YcaddMeasure = function YcaddMeasure(...args) {
        MeasureBase.apply(this, args);
        this.type = EnumMeasureType.ycadd;
        this.value = -1;
    };
    YcaddMeasure.prototype = Object.create(MeasureBase.prototype);
    YcaddMeasure.prototype.constructor = YcaddMeasure;
    rtdb.YcaddMeasure = YcaddMeasure;

    YcaddMeasure.prototype.setValue = function(v) {
        let newValue = Number(v);
        if (newValue !== this.value) {
            this.value = newValue;
        }
    };

    YcaddMeasure.prototype.setVQT = function(v, q, t) {
        this.setValue(v);
        if (q !== this.quality) {
            this.quality = q;
        }
        if (t !== this.refreshTime) {
            this.refreshTime = t;
        }
    };

    YcaddMeasure.prototype.setVTR = function(v, t, r) {
        this.setValue(v);
        if (t !== this.refreshTime) {
            this.refreshTime = t;
        }
        if (r !== this.res) {
            this.res = r;
        }
    };

    let YcaddManager = function YcaddManager() {
        MeasureManagerBase.call(this);
        this.ycadds = this.measures;
        this.MeasureClass = YcaddMeasure;
    };
    YcaddManager.prototype = Object.create(MeasureManagerBase.prototype);
    YcaddManager.prototype.constructor = YcaddManager;
    rtdb.YcaddManager = YcaddManager;

    // # straw
    let StrawMeasure = function StrawMeasure(...args) {
        MeasureBase.apply(this, args);
        this.type = EnumMeasureType.straw;
        this.value = -1;
    };
    StrawMeasure.prototype = Object.create(MeasureBase.prototype);
    StrawMeasure.prototype.constructor = StrawMeasure;
    rtdb.StrawMeasure = StrawMeasure;

    StrawMeasure.prototype.setValue = function(v) {
        let newValue = String(v);
        if (newValue !== this.value) {
            this.value = newValue;
        }
    };

    StrawMeasure.prototype.setVQT = function(v, q, t) {
        this.setValue(v);
        if (q !== this.quality) {
            this.quality = q;
        }
        if (t !== this.refreshTime) {
            this.refreshTime = t;
        }
    };

    StrawMeasure.prototype.setVTR = function(v, t, r) {
        this.setValue(v);
        if (t !== this.refreshTime) {
            this.refreshTime = t;
        }
        if (r !== this.res) {
            this.res = r;
        }
    };

    let StrawManager = function StrawManager() {
        MeasureManagerBase.call(this);
        this.straws = this.measures;
        this.MeasureClass = StrawMeasure;
    };
    StrawManager.prototype = Object.create(MeasureManagerBase.prototype);
    StrawManager.prototype.constructor = StrawManager;
    rtdb.StrawManager = StrawManager;

    // # rtdb's container
    let monsbManager = new MonsbManager();
    rtdb.monsbManager = monsbManager;
    let ycaddManager = new YcaddManager();
    rtdb.ycaddManager = ycaddManager;
    let strawManager = new StrawManager();
    rtdb.strawManager = strawManager;

    // # rtdb's generic find - append
    let findMeasureById = function findMeasureById(measureId) {
        let iId = Number(measureId);
        let r = null;
        switch (getMeasureTypeById(iId)) {
        case EnumMeasureType.monsb:
            r = monsbManager.findById(iId);
            break;
        case EnumMeasureType.ycadd:
            r = ycaddManager.findById(iId);
            break;
        case EnumMeasureType.straw:
            r = strawManager.findById(iId);
            break;
        default:
            break;
        }
        return r;
    };
    rtdb.findMeasureById = findMeasureById;

    let findMeasureByUrl = function findMeasureByUrl(sUrl = '') {
        return monsbManager.findByUrl(sUrl)
            || ycaddManager.findByUrl(sUrl)
            || strawManager.findByUrl(sUrl);
    };
    rtdb.findMeasureByUrl = findMeasureByUrl;

    let findMeasureByNenoCode = function findMeasureByNenoCode(neno = 0, code = '') {
        return monsbManager.findByNenoCode(neno, code)
            || ycaddManager.findByNenoCode(neno, code)
            || strawManager.findByNenoCode(neno, code);
    };
    rtdb.findMeasureByNenoCode = findMeasureByNenoCode;

    let appendMeasureById = function appendMeasureById(measureId) {
        let iId = Number(measureId);
        let r = null;
        switch (getMeasureTypeById(iId)) {
        case EnumMeasureType.monsb:
            r = monsbManager.appendById(iId);
            break;
        case EnumMeasureType.ycadd:
            r = ycaddManager.appendById(iId);
            break;
        case EnumMeasureType.straw:
            r = strawManager.appendById(iId);
            break;
        default:
            break;
        }
        return r;
    };
    rtdb.appendMeasureById = appendMeasureById;

    let appendMeasure = function appendMeasure(obj) {
        let r = null;
        if (obj && obj.id) {
            switch (getMeasureTypeById(obj.id)) {
            case EnumMeasureType.monsb:
                r = monsbManager.append(obj);
                break;
            case EnumMeasureType.ycadd:
                r = ycaddManager.append(obj);
                break;
            case EnumMeasureType.straw:
                r = strawManager.append(obj);
                break;
            default:
                break;
            }
        }
        return r;
    };
    rtdb.appendMeasure = appendMeasure;

    rtdb.measuresChangedCallback = null;
    let receivedMeasures = function receivedMeasures(recvMeasures) {
        let measuresByAdd = [];
        let measuresByDelete = [];
        let measuresByEdit = [];
        for (let i = 0; i < recvMeasures.length; i++) {
            let recvMeasure = recvMeasures[i];
            let measure = rtdb.findMeasureById(recvMeasure.id);
            if (measure === null) {
                measure = rtdb.appendMeasure(recvMeasure);
                if (measure) {
                    measuresByAdd.push(measure);
                }
            } else {
                measure.setVTR(recvMeasure.value, recvMeasure.refreshTime, recvMeasure.res);
                measuresByEdit.push(measure);
            }
        }
        if (rtdb.measuresChangedCallback) {
            rtdb.measuresChangedCallback(measuresByAdd, measuresByDelete, measuresByEdit);
        }
        console.log('measuresByAdd: ', measuresByAdd.length);
        console.log(measuresByAdd);
        console.log('measuresByDelete: ', measuresByDelete.length);
        console.log(measuresByDelete);
        console.log('measuresByEdit: ', measuresByEdit.length);
        console.log(measuresByEdit);
    };
    rtdb.receivedMeasures = receivedMeasures;

    // # rtdb's sync data
    let getReqMeasuresJson = function getReqMeasuresJson() {
        return JSON.stringify({
            session: '',
            structtype: 'rtdata_v101',
            params: (
                ((monsbManager.getReqMeasures()).concat(ycaddManager.getReqMeasures()))
                    .concat(strawManager.getReqMeasures())
            ),
        });
    };
    rtdb.getReqMeasuresJson = getReqMeasuresJson;

    /**
     * registerMeasuresChangedCallback
     * @param {Function}fnDataChangedCallback : fn(addMeasures, deleteMeasures, editMeasures)
     */
    let registerMeasuresChangedCallback = function registerMeasuresChangedCallback(fnDataChangedCallback) {
        rtdb.measuresChangedCallback = fnDataChangedCallback;
    };
    rtdb.registerMeasuresChangedCallback = registerMeasuresChangedCallback;
})(typeof window !== 'undefined' ? window : this);
