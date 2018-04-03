/*!
 *
 */
(function () {

    window.gcl = window.gcl || {};
    window.gcl.rtdb = window.gcl.rtdb || {};

    var rtdb = window.gcl.rtdb;
    if (rtdb.MeasureBase) return;

    rtdb.MeasureBase = function MeasureBase( iMeasureId = 0 ) {
        var measure = {
            measureId: 0,
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
        return measure;
    };

    rtdb.MeasureManagerBase = function MeasureManagerBase() {
        var manager = {
            measures: [],
            measureClass: MeasureBase
        };
        return manager;
    };

    rtdb.MeasureManagerBase.prototype.append = function append(measure) {
        if (measure && measure.measureId && measure.measureId > 0) {
            var newMeasure = new this.measureClass();
            // newMeasure.measureId = measure.measureId ? : 0;
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
            newMeasure.measureId = measure.measureId;
            newMeasure.value = measure.value ? measure.value : null;
            newMeasure.quality = measure.quality ? measure.quality : 0;
            newMeasure.refreshTime = measure.refreshTime ? measure.refreshTime : Date();
            newMeasure.changedTime = measure.changedTime ? measure.changedTime : Date();
            newMeasure.refreshSourceId = measure.refreshSourceId ? measure.refreshSourceId : 0;
            newMeasure.changedSourceId = measure.changedSourceId ? measure.changedSourceId : 0;
            newMeasure.refreshReasonId = measure.refreshReasonId ? measure.refreshReasonId : 0;
            newMeasure.changedReasonId = measure.changedReasonId ? measure.changedReasonId : 0;
            newMeasure.equalStrategyId = measure.equalStrategyId ? measure.equalStrategyId : 0;
            newMeasure.res = measure.res ? measure.res : 0;
            return true;
        }
        else {
            return false;
        }
    };

    rtdb.MonsbMeasure = function MonsbMeasure() {
        var monsb = new MeasureBase();
        monsb.value = -1;
        return monsb;
    };

    rtdb.MonsbManager = function MonsbManager() {
        var manager = new MeasureManagerBase();
        manager.mmonsbs = manager.mmeasures;
        manager.mmeasureClass = MonsbMeasure;
        return manager;
    };

    rtdb.YcaddMeasure = function YcaddMeasure() {
        var ycadd = new MeasureBase();
        ycadd.value = -1;
        return ycadd;
    };

    rtdb.YcaddManager = function YcaddManager() {
        var manager = new MeasureManagerBase();
        manager.ycadds = manager.mmeasures;
        manager.mmeasureClass = YcaddMeasure;
        return manager;
    };

    rtdb.StrawMeasure = function StrawMeasure() {
        var straw = new MeasureBase();
        straw.value = -1;
        return straw;
    };

    rtdb.StrawManager = function StrawManager() {
        var manager = new MeasureManagerBase();
        manager.straws = manager.mmeasures;
        manager.measureClass = StrawMeasure;
        return manager;
    };

    rtdb.monsbManager = new MonsbManager();
    rtdb.ycaddManager = new YcaddManager();
    rtdb.strawManager = new StrawManager();

    rtdb.rtdataStartRefresh = function () {
        var csRrtdataUiPrefix = 'show-rtdata-';

        var sReqMeasureStringXML = function getReqMeasureStringXML() {
            var CS_req_measure_head =
                '<?xml version="1.0" encoding="utf-8"?>' +
                '<YGCT>' +
                '<HEAD>' +
                '<VERSION>1.0</VERSION>' +
                '<SRC>1200000003</SRC>' +
                '<DES>1200000003</DES>' +
                '<MsgNo>9991</MsgNo>' +
                '<MsgId>91d9e512-3695-4796-b063-306544be6f1f</MsgId>' +
                '<MsgRef/>' +
                '<TransDate>20151215094317</TransDate>' +
                '<Reserve/>' +
                '</HEAD>' +
                '<MSG>'
            ;

            var CS_req_measure_body =
                '<RealData9991>' +
                '<ADDRESSES>%1</ADDRESSES>' +
                '</RealData9991>'
            ;

            var CS_req_measure_foot =
                '</MSG>' +
                '</YGCT>'
            ;

            var sMids = "";
            var svgMids = $("text[id^='" + csRrtdataUiPrefix + "']");
            svgMids.each(function () {
                var name = this.id;
                var index = name.indexOf(csRrtdataUiPrefix);
                if (index >= 0) {
                    sMids += name.substring(index + 12) + ",";
                }
            });

            if (sMids.length > 0) {
                CS_req_measure_body = CS_req_measure_body.replace(/%1/, sMids);
                return CS_req_measure_head + CS_req_measure_body + CS_req_measure_foot;
            }
            return "";
        }();

        var req_resp_rtdatas = function () {
            var xmlhttp;
            if (window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
            }
            else if (window.ActiveXObject) {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.open("post", "ics.cgi", true);
            xmlhttp.setRequestHeader('Content-Type', 'text/xml');
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var svgOutInfo = d3.select("text[id=sys-recved-time]");
                    svgOutInfo.text("接收：" + Date() + "  " + xmlhttp.response.length);
                    var doc = (new DOMParser()).parseFromString(xmlhttp.response, "text/xml");
                    var x = doc.documentElement.getElementsByTagName("RealData9999");
                    for (var i = 0; i < x.length; i++) {
                        try {
                            var xx1 = x[i].getElementsByTagName("ADDRESS");
                            var sMid = xx1[0].textContent;
                            var iMid = Number(sMid);
                            var xx2 = x[i].getElementsByTagName("VALUE");
                            var sValue = xx2[0].textContent;
                            var svgMeasure = d3.select("[id=" + csRrtdataUiPrefix + sMid + "]");
                            if (iMid >= 0x01000000 && iMid < 0x02000000) {
                                var iState = Number(sValue);
                                if (iMid == 16777231 || iMid == 16777235) {
                                    var iX = 0 + (iState % 1000);
                                    var iY = 0 + (iState % 10);
                                    if (iMid == 16777235) {
                                        iX = 0 + (iState % 10);
                                        iY = 0 + (iState % 600);
                                    }
                                    var lable = d3.select("[id=outInfoEd]");
                                    var sTransform = "translate(" + iX + "," + iY + ")";
                                    if (iMid == 16777231) {
                                        sTransform += " rotate(90 110,700) "
                                    }
                                    lable.text("transform=" + sTransform);
                                    svgMeasure.attr("transform", sTransform);
//                                    var svg_1 = d3.select("[id=show-rtdata-16777235]");
//                                    svg_1.attr("transform", "translate("+(count*10)+","+(480+count%10)+")");
                                    continue;
                                }
                                var iRemain = iState % 3;
                                if (iRemain == 0)
                                    svgMeasure.attr("fill", "#ff0000");
                                else if (iRemain == 1)
                                    svgMeasure.attr("fill", "#00ff00");
                                else
                                    svgMeasure.attr("fill", "#0000ff");
                            }
                            else if (iMid >= 0x02000000 && iMid < 0x03000000) {
                                svgMeasure.text(sValue);
                            }
                            else if (iMid >= 0x03000000 && iMid < 0x04000000) {
                                svgMeasure.text(sValue);
                            }
                        }
                        catch (er) {
                            var body = d3.selectAll("body");
                            var lable = body.append("lable");
                            lable.text("接收到实时数据，但解释异常：" + er.message);
                        }
                    }
                }
            }
            var reqMeasureXml = getReqMeasureStringXML();
            var r = xmlhttp.send(reqMeasureXml);
            var svgOutInfo = d3.select("text[id=sys-send-time]");
            svgOutInfo.text("发送：" + Date() + "  " + r);
//            return {"r":r,"datetime":Date()}
        };

        if (sReqMeasureStringXML.length > 0) {
            setInterval(req_resp_rtdatas, 1000);
            return true;
        }
        else {
            console.log('!!! warnning: ' + csRrtdataUiPrefix + ' is empty!!!')
            return false;
        }
    };

    rtdb.rtdataStartRefresh();
})(typeof window !== "undefined" ? window : this);
