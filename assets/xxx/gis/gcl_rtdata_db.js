/*!
 *
 */
(function () {

    window.gcl = window.gcl || {};
    window.gcl.rtdb = window.gcl.rtdb || {};

    let rtdb = window.gcl.rtdb;
    if (rtdb.debug) return;

    rtdb.debug = function () {
        console.log.apply(null, arguments);
    };
    
    rtdb.MeasureBase = function MeasureBase( ) {
        let iId = 0;
        let sUrl = '';
        if (arguments.length > 0) {
            let arg0 = arguments[0];
            if (typeof arg0 === 'number') {
                iId = arg0;
                if (arguments.length > 1) {
                    let arg1 = arguments[1];
                    if (typeof arg0 === 'string') {
                        sUrl = arg1;
                    }
                }
            } else if (typeof arg0 === 'string') {
                sUrl = arg0;
                if (arguments.length > 1) {
                    let arg1 = arguments[1];
                    if (typeof arg0 === 'number') {
                        iId = arg1;
                    }
                }
            } else if ( arg0 !== null && typeof value === 'object') {
                return {
                    // newMeasure.id               = measure.id              ? measure.id              : iId,
                    // newMeasure.url              = measure.url             ? measure.url             : sUrl,
                    // newMeasure.value            = measure.value           ? measure.value           : null;
                    // newMeasure.quality          = measure.quality         ? measure.quality         : 0;
                    // newMeasure.refreshTime      = measure.refreshTime     ? measure.refreshTime     : Date();
                    // newMeasure.changedTime      = measure.changedTime     ? measure.changedTime     : Date();
                    // newMeasure.refreshSourceId  = measure.refreshSourceId ? measure.refreshSourceId : 0;
                    // newMeasure.changedSourceId  = measure.changedSourceId ? measure.changedSourceId : 0;
                    // newMeasure.refreshReasonId  = measure.refreshReasonId ? measure.refreshReasonId : 0;
                    // newMeasure.changedReasonId  = measure.changedReasonId ? measure.changedReasonId : 0;
                    // newMeasure.equalStrategyId  = measure.equalStrategyId ? measure.equalStrategyId : 0;
                    // newMeasure.res              = measure.res             ? measure.res             : 0;              
                    id               : arg0.id              ? arg0.id              : iId,
                    url              : arg0.url             ? arg0.url             : sUrl,
                    value            : arg0.value           ? arg0.value           : null,
                    quality          : arg0.quality         ? arg0.quality         : 0,
                    refreshTime      : arg0.refreshTime     ? arg0.refreshTime     : Date(),
                    changedTime      : arg0.changedTime     ? arg0.changedTime     : Date(),
                    refreshSourceId  : arg0.refreshSourceId ? arg0.refreshSourceId : 0,
                    changedSourceId  : arg0.changedSourceId ? arg0.changedSourceId : 0,
                    refreshReasonId  : arg0.refreshReasonId ? arg0.refreshReasonId : 0,
                    changedReasonId  : arg0.changedReasonId ? arg0.changedReasonId : 0,
                    equalStrategyId  : arg0.equalStrategyId ? arg0.equalStrategyId : 0,
                    res              : arg0.res             ? arg0.res             : 0         
                };
            }
        }
        return {
            id: iId,
            url: sUrl,
            value: null,
            quality: 0,
            refreshTime: Date(),
            changedTime: Date(),
            refreshSourceId: 0,
            changedSourceId: 0,
            refreshReasonId: 0,
            changedReasonId: 0,
            equalStrategyId: 0,
            res: 0
        };
    };

    rtdb.MeasureManagerBase = function MeasureManagerBase() {
        let manager = {
            measures: [],
            measureClass: MeasureBase,
        };
        return manager;
    };

    rtdb.MeasureManagerBase.prototype.findById = function findById(iId=0) {
        let measures = this.measures;
        for (let i = 0; i < measures.length; i++) {
            let measure = measures[i];
            if (measure.id === iId) {
                return measure;
            }
        }
        return null;
    };

    rtdb.MeasureManagerBase.prototype.findByUrl = function findById(sUrl='') {
        let measures = this.measures;
        for (let i = 0; i < measures.length; i++) {
            let measure = measures[i];
            if (measure.url === sUrl) {
                return measure;
            }
        }
        return null;
    };

    rtdb.MeasureManagerBase.prototype.append = function append(measure) {
        if (measure) {
            let bId =  (typeof measure.id === 'number' && measure.id > 0 && this.findById(measure.id ) === null);
            let bUrl =  (typeof measure.url === 'string' && this.findByUrl(measure.url ) === null);
            if (bId || bUrl) {
                let measure = new this.measureClass(measure);
                this.measures.push(measure);
                return true;
            }
        }
        else {
            return false;
        }
    };

    rtdb.MeasureManagerBase.prototype.appendById = function appendById(iId) {
        if (typeof iId === 'number' && iId > 0 && this.findById(iId ) === null) {
            let measure = new this.measureClass(iId);
            this.measures.push(measure);
            return true;
        }
        else {
            return false;
        }
    };

    rtdb.MeasureManagerBase.prototype.appendByUrl = function appendByUrl(sUrl) {
        if (typeof sUrl === 'string' && this.findByUrl(sUrl ) === null) {
            let measure = new this.measureClass(sUrl);
            this.measures.push(measure);
            return true;
        }
        else {
            return false;
        }
    };

    rtdb.MeasureManagerBase.prototype.remove = function remove(measure) {
        let r = 0;
        if (measure) {
            let bId =  (typeof measure.id === 'number' && measure.id > 0) ;
            let bUrl =  (typeof measure.url === 'string');
            if (bId) r = this.removeById(measure.id);
            if (bUrl) r += this.removeByUrl(measure.url);
        }
        return r;
    };

    rtdb.MeasureManagerBase.prototype.removeById = function removeById(iId) {
        let r = 0;
        if (typeof iId === 'number') {
            let measures = this.measures;
            for (let i = measures.length-1; i >= 0; i--) {
                let measure = measures[i];
                if (measure.id === iId) {
                    measures.splice(i, 1);
                    r++;
                }
            }
        }
        return r;
    };

    rtdb.MeasureManagerBase.prototype.removeByUrl = function removeByUrl(sUrl) {
        let r = 0;
        if (typeof sUrl === 'string') {
            let measures = this.measures;
            for (let i = measures.length-1; i >= 0; i--) {
                let measure = measures[i];
                if (measure.url === sUrl) {
                    measures.splice(i, 1);
                    r++;
                }
            }
        }
        return r;
    };

    rtdb.MeasureManagerBase.prototype.getReqMeasures = function getReqMeasures() {
        let r = [];
        let measures = this.measures;
        for (let i = 0; i < measures.length; i++) {
            let measure = measures[i];
            let reqMeasure = {
                mid: measure.id,
                url: measure.url
            };
            r.push(reqMeasure);
        }
        return r;
    };

    rtdb.MonsbMeasure = function MonsbMeasure() {
        let monsb = new MeasureBase();
        monsb.value = -1;
        return monsb;
    };

    rtdb.MonsbManager = function MonsbManager() {
        let manager = new MeasureManagerBase();
        manager.monsbs = manager.measures;
        manager.measureClass = MonsbMeasure;
        return manager;
    };

    rtdb.YcaddMeasure = function YcaddMeasure() {
        let ycadd = new MeasureBase();
        ycadd.value = -1;
        return ycadd;
    };

    rtdb.YcaddManager = function YcaddManager() {
        let manager = new MeasureManagerBase();
        manager.ycadds = manager.measures;
        manager.measureClass = YcaddMeasure;
        return manager;
    };

    rtdb.StrawMeasure = function StrawMeasure() {
        let straw = new MeasureBase();
        straw.value = -1;
        return straw;
    };

    rtdb.StrawManager = function StrawManager() {
        let manager = new MeasureManagerBase();
        manager.straws = manager.measures;
        manager.measureClass = StrawMeasure;
        return manager;
    };

    rtdb.monsbManager = new MonsbManager();
    rtdb.ycaddManager = new YcaddManager();
    rtdb.strawManager = new StrawManager();

    rtdb.getReqMeasuresJson = function getReqMeasuresJson() {
        return JSON.stringify( {
            session: '',
            structtype: 'rtdata_v101',
            params: (((monsbManager.getReqMeasures()).concat(ycaddManager.getReqMeasures())).concat(strawManager.getReqMeasures()))
        });
    };

    rtdb.retReqMeasuresJson = '';

    rtdb.dealRespMeasures =  function (response) {
        let arr = JSON.parse(response);
        let measures = arr.data;
        for(let i = 0; i < measures.length; i++) {
            let measure = measures[i];
            let iId = measure.mid;
            let myMeasure = null;
            if (iId >= 0x01000000 && iId < 0x02000000) {
                myMeasure = this.monsbManager.findById(iId);
            } else if (iId >= 0x02000000 && iId < 0x03000000) {
                myMeasure = this.ycaddManager.findById(iId);
            } else if (iId >= 0x03000000 && iId < 0x04000000) {
                myMeasure = this.strawManager.findById(iId);
            }
            if (myMeasure !== null) {
                if (myMeasure.value !== measure.v) {
                    myMeasure.value = measure.v;
                }
                if (myMeasure.quality !== measure.q) {
                    myMeasure.quality = measure.q;
                }
                if (myMeasure.changedTime !== measure.t) {
                    myMeasure.changedTime = measure.t;
                }
                if (myMeasure.quality !== measure.q) {
                    myMeasure.quality = measure.q;
                }
            }
        }
    };
    
    rtdb.startReqMeasuresTimeOut = function () {
        rtdb.retReqMeasuresJson = getReqMeasuresJson();
        
        let req_resp_rtdatas = function () {
            let xmlhttp;
            if (window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
            }
            else if (window.ActiveXObject) {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.open("post", "ics.cgi", true);
            xmlhttp.setRequestHeader('Content-Type', 'text/xml');
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    rtdb.debug('接收：RespMeasures - ' + Date() + ' ' + xmlhttp.response.length);
                    rtdb.dealRespMeasures(xmlhttp.responseText)
                }
            };
            let r = xmlhttp.send(retReqMeasuresJson);
            rtdb.debug('发送：ReqMeasures - ' + Date() + ' ' + r);
        };

        if (retReqMeasuresJson.length > 0) {
            setInterval(req_resp_rtdatas, 1000);
            return true;
        } else {
            console.log('!!! warnning: retReqMeasuresJson is empty!!!')
            return false;
        }
    };

    rtdb.startReqMeasuresTimeOut();
})(typeof window !== "undefined" ? window : this);
