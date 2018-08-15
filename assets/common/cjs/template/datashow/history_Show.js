/**
 * Created by nielei on 2018/6/25.
 */

'use strict';

define(['jquery', 'global', 'async', 'jqGrid', 'modal', 'echartConfig', 'panelConfig', 'uix-date', 'jqGridConfig', 'action', 'cjcommon', 'cjstorage', 'cjdatabaseaccess', 'cjajax', 'treeConfig', 'utils', 'cache', 'jqGridExtension'], function($, g, async) {
    let gDb = null;
    let gReqParam = null;
    let aTabIndex = []; // 标签索引
    let aTitle = [];
    let rtlog = cc4k.rtlog;
    let aGroup = [];
    let aValue = [];
    let height = 0;
    let width = 0;
    let tabIndex = 0; // 标签索引
    let sTime; // 记录开始时间
    let eTime; // 记录结束时间
    let oSTime; // 记录原始的开始时间
    let oETime; // 记录原始的结束时间
    let clickFlag = true;
    const COUNT = 240; // 一屏固定的点号数量
    const MAXCOUNT = Math.floor(40000/(8+8*COUNT)); // 最大发送的点号数量
    let iUserID = sessionStorage.getItem('s_user_ID');
    let wait = new modal.CreateModal();
    let oAction = {
        init: function() {
            let db = window.top.cjDb;
            gDb = db;
            let serverInfo = cacheOpt.get('server-config');
            let reqHost = serverInfo['server']['ipAddress'];
            let reqPort = serverInfo['server']['httpPort'];
            let reqParam = {
                reqHost: reqHost,
                reqPort: reqPort,
            };
            gReqParam = reqParam;
            tabInit();
        },
    };

    /**
     * 初始化Tab页
     */
    function tabInit() {
        let sSql = 'select ID,F_NID as TabIndex, F_NAME as TabTitle from omc_user_tab where F_MID = ' + iUserID + ' and F_CLASS = ' + '\'' + 'HIS_CURV' + '\'';
        let sLiModel = '';
        let sDivModel = '';
        gDb.load(sSql, function fn(err, val) {
            if (err) {
                console.log(err);
            } else {
                if (val.length === 0) {
                    g.alert('请先前往历史曲线配置功能进行配置！');
                } else {
                    for (let i = 0; i < val.length; i++) {
                        aTabIndex.push(val[i].TabIndex);
                        if (i === 0) {
                            sLiModel = `<li class='active'>
                                            <a href='#tab${val[i].TabIndex}' data-toggle='tab' id='index${val[i].TabIndex}'>${val[i].TabTitle}</a>
                                        </li>`;
                            sDivModel = `<div class='tab-pane active index${val[i].TabIndex}-table' id='tab${val[i].TabIndex}' style='height:100%'>
                                            <div class='uix_box' style='position: relative;height:100%'>
                                                 <div id='chart${val[i].TabIndex}' class='tableBg' style='position: absolute;top:0;bottom:0;width: 100%;border-top: #ddd solid 1px;'>
                                                 </div>
                                                 <div id='control${val[i].TabIndex}' class='control' style="width: 242px; position: absolute; right: 5px; top: 0px; z-index: 1000;">
                                                    <ul>
                                                        <li class='cr string'>
                                                            <div>
                                                                <span class="property-name">开始时间</span>
                                                                <div class="c">
                                                                    <input type="datetime-local" name="start-time"/>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <!--<li class='cr string'>-->
                                                            <!--<div>-->
                                                                <!--<span class="property-name">结束时间</span>-->
                                                                <!--<div class="c">-->
                                                                    <!--<input type="datetime-local" name="end-time"/>-->
                                                                <!--</div>-->
                                                            <!--</div>-->
                                                        <!--</li>-->
                                                        <li class='cr string'>
                                                            <div>
                                                                <span class="property-name">间隔</span>
                                                                <div class="c">
                                                                    <input type="number" class="interval" name="time-interval"/>
                                                                    <select class="sel">
                                                                        <option value="h">时</option>
                                                                        <option value="m">分</option>
                                                                        <option value="s">秒</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li id="save-btn${val[i].TabIndex}" class="save-btn">保存设置</li>
                                                    </ul>
                                                    <div id='close-btn${val[i].TabIndex}' class="close-btn" style="width: 242px;">隐藏设置</div>
                                                 </div>
                                                 <div id="left${val[i].TabIndex}" class="left">
                                                     <img src="../../../../../common/cimg/img/left.png" style="margin-top: 42px;">
                                                 </div>
                                                 <div id="right${val[i].TabIndex}" class="right">
                                                     <img src="../../../../../common/cimg/img/right.png" style="margin-top: 42px;">
                                                 </div>
                                             </div>
                                         </div>`;
                        } else {
                            sLiModel = sLiModel + `<li>
                                                      <a href='#tab${val[i].TabIndex}' data-toggle='tab' id='index${val[i].TabIndex}'>${val[i].TabTitle}</a>
                                                   </li>`;
                            sDivModel = sDivModel + `<div class='tab-pane index${val[i].TabIndex}-table' id='tab${val[i].TabIndex}' style='height:100%'>
                                                        <div class='uix_box' style='position: relative;height:100%'>
                                                            <div id='chart${val[i].TabIndex}' class='tableBg' style='position: absolute;top:0;bottom:0;width: 100%;border-top: #ddd solid 1px;'>
                                                            </div>
                                                            <div id='control${val[i].TabIndex}' class='control' style="width: 242px; position: absolute; right: 5px; top: 0px; z-index: 1000;">
                                                    <ul>
                                                        <li class='cr string'>
                                                            <div>
                                                                <span class="property-name">开始时间</span>
                                                                <div class="c">
                                                                    <input type="datetime-local" name="start-time"/>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <!--<li class='cr string'>-->
                                                            <!--<div>-->
                                                                <!--<span class="property-name">结束时间</span>-->
                                                                <!--<div class="c">-->
                                                                    <!--<input type="datetime-local" name="end-time"/>-->
                                                                <!--</div>-->
                                                            <!--</div>-->
                                                        <!--</li>-->
                                                        <li class='cr string'>
                                                            <div>
                                                                <span class="property-name">间隔</span>
                                                                <div class="c">
                                                                    <input type="number" class="interval" name="time-interval"/>
                                                                    <select class="sel">
                                                                        <option value="h">时</option>
                                                                        <option value="m">分</option>
                                                                        <option value="s">秒</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li id="save-btn${val[i].TabIndex}" class="save-btn">保存设置</li>
                                                    </ul>
                                                    <div id='close-btn${val[i].TabIndex}' class="close-btn" style="width: 242px;">隐藏设置</div>
                                                 </div>
                                                 <div id="left${val[i].TabIndex}" class="left">
                                                     <img src="../../../../../common/cimg/img/left.png" style="margin-top: 42px;">
                                                 </div>
                                                 <div id="right${val[i].TabIndex}" class="right">
                                                     <img src="../../../../../common/cimg/img/right.png" style="margin-top: 42px;">
                                                 </div>
                                                        </div>
                                                     </div>`;
                        }
                        aTitle.push(val[i].TabTitle);
                    }
                    $('.nav-tabs').append(sLiModel);
                    $('.tab-content').append(sDivModel);
                    dataShow(0);
                }
            }
        }, gReqParam);
    }

    /**
     * @param {number} index
     * 数据展示
     */
    function dataShow(index) {
        wait.waitInit();
        let sGetSignalSql = 'select ID,F_NID as tabIndex,F_PID as NeNo,F_URI as SignalUrl, F_NAME as SignalName, F_V as para from omc_user_subscribe where F_MID = ' + iUserID + ' and F_CLASS = ' + '\'' + 'HIS_CURV' +'\'';
        let sGetTabCount = 'select count(' + '\'F_NID\'' + ') as sum from omc_user_tab where F_CLASS = ' + '\'HIS_CURV\'';
        async.auto({
            getSignal: function(callBack) {
                loadSql(sGetSignalSql, function(v) {
                    callBack(null, v);
                });
            },
            getTabCount: function(callBack) {
                loadSql(sGetTabCount, function(v) {
                    callBack(null, v);
                });
            },
        }, function(err, value) {
            let aSignal = value.getSignal;
            let nTabCount = value.getTabCount[0].sum;
            tabSwitch(nTabCount);
            showSwitch(nTabCount);
            leftSwitch(nTabCount);
            rightSwitch(nTabCount);
            let aData = [];
            let aMeasures = [];
            let oPara = {};
            // 将值按照tab分类
            aValue = [];
            for (let j = 0; j < aSignal.length; j++) {
                if (aSignal[j + 1]) {
                    if (aSignal[j].tabIndex === aSignal[j + 1].tabIndex) {
                        aGroup.push(aSignal[j]);
                    } else {
                        aGroup.push(aSignal[j]);
                        aValue.push(aGroup);
                        aGroup = [];
                    }
                } else {
                    aGroup.push(aSignal[j]);
                    aValue.push(aGroup);
                    aGroup = [];
                }
            }
            let rtLogCallBack = function(resDataObject) {
                if (typeof resDataObject !== 'object' || ! resDataObject.hasOwnProperty('structtype')) {
                    console.log('system error : refreshHourECharts.');
                    clickFlag = true;
                    wait.waitCancel();
                    return;
                }
                let iState = resDataObject.state;
                if (iState !== 0) {
                    if (iState === 504) {
                        g.alert('请求超时');
                    }
                    console.log('server error: ', iState);
                    clickFlag = true;
                    wait.waitCancel();
                    return;
                }
                let iLogCount = resDataObject.logcount;
                if (iLogCount === 0) {
                    g.alert('返回数据错误！');
                    clickFlag = true;
                    wait.waitCancel();
                    return;
                }
                let logObjects = resDataObject.data;
                console.log('received logCount: ', iLogCount);
                console.log('received logObjects.length: ', logObjects.length);
                let arr = [];
                let temp = 0;
                for (let i = 0; i < logObjects.length; i++) {
                    if (!logObjects[i]) {
                        break;
                    } else {
                        let aVal = [];
                        let aLog = [];
                        let oV = JSON.parse(aValue[index][i].para);
                        let logTime = oV.startTime;
                        let intervalTime = oV.timeInterval;
                        for (let n = 0; n < logObjects[i].log.length; n++) {
                            aVal.push(logObjects[i].log[n]);
                            aLog.push(logTime);
                            logTime = logTime + intervalTime;
                        }
                        arr[temp] = {
                            code: aValue[index][i].SignalName,
                            value: aVal,
                            refreshTime: aLog,
                            tabIndex: aValue[index][i].tabIndex,
                            color: oV.color,
                            yName: oV.yName,
                            yUnit: oV.yUnit,
                        };
                        temp ++;
                    }
                }
                aData[0] = arr;
                lineInit(aData, index);
            };
            controlPanel(aSignal, nTabCount);
            for (let i = 0; i < aValue[index].length; i++) {
                let obj = {
                    neno: Number(aValue[index][i].NeNo),
                    code: aValue[index][i].SignalUrl,
                };
                aMeasures.push(obj);
                oPara = {};
                oPara = JSON.parse(aValue[index][i].para);
            }
            let obj = {
                measures: aMeasures,
                tInterval: oPara.timeInterval,
            };
            sTime = oPara.startTime;
            eTime = oPara.endTime;
            oSTime = oPara.startTime;
            oETime = oPara.endTime;
            sessionStorage.setItem('historyLine', JSON.stringify(obj));
            rtlog.reqRtlogByPeriod(aMeasures, oPara.startTime, oPara.endTime, oPara.timeInterval, rtLogCallBack);
        });
    }

    /**
     * 加载数据
     * @param {arr} aData
     * @param {num} index
     */
    function lineInit(aData, index) {
        for (let i = 0; i < aData.length; i++) {
            let aLegend = [];
            let aColor = [];
            let aYAxis = [];
            let aSeriesData = [];
            for (let j = 0; j < aData[i].length; j++) {
                aLegend.push(aData[i][j].code);
                aColor.push(aData[i][j].color);
                let oYAxis = {};
                oYAxis.name = aData[i][j].yName;
                oYAxis.value = 'value';
                let offset = 40;
                if (j > 1) {
                    oYAxis.offset = offset + (j - 2) * offset;
                }
                oYAxis.axisLabel = {
                    formatter: '{value}' + aData[i][j].yUnit,
                };
                oYAxis.axisLine = {
                    lineStyle: {
                        color: aData[i][j].color,
                    },
                };
                aYAxis.push(oYAxis);
                let obj = {};
                obj.showSymbol = false;
                obj.name = aData[i][j].code;
                obj.type = 'line';
                obj.yAxisIndex = j;
                obj.data = [];
                for (let k = 0; k < aData[i][j].refreshTime.length; k++) {
                    let oData = {
                        value: [aData[i][j].refreshTime[k], aData[i][j].value[k]],
                    };
                    obj.data.push(oData);
                }
                aSeriesData.push(obj);
            }
            let ID = 'chart' + Number(index+ 1);
            if (index === 0) {
                height = $('#' + ID).height();
                width = $('#' + ID).width();
            } else {
                $('#' + ID).height(height);
                $('#' + ID).width(width);
            }
            let option = {
                title: aTitle[i],
                legend: aLegend,
                color: aColor,
                yAxis: aYAxis,
                seriesData: aSeriesData,
                float: true,
            };
            clickFlag = true;
            echartsConfig.dynamicTimeConfig(ID, option);
            wait.waitCancel();
        }
    }

    /**
     * 执行sql
     * @param {str} sql
     * @param {fn} callBack
     */
    function loadSql(sql, callBack) {
        gDb.load(sql, function(e, v) {
            callBack(v);
        }, gReqParam);
    }

    /**
     * 标签切换
     * @param {number} num
     */
    function tabSwitch(num) {
        for (let i = 0; i < num; i ++) {
            $('#index'+ Number(i + 1)).unbind('click');
            $('#index' + Number(i + 1)).click(function() {
                tabIndex = i;
                if (clickFlag) {
                    clickFlag = false;
                    dataShow(i);
                }
            });
        }
    }

    /**
     * 显示左右切换
     * @param {number} num
     */
    function showSwitch(num) {
        for (let i = 0; i < num; i ++) {
            $('#tab'+ Number(i + 1)).unbind('mouseover');
            $('#tab' + Number(i + 1)). mouseover( function() {
                $('#left' + Number(i + 1)).css('display', 'block');
                $('#right' + Number(i + 1)).css('display', 'block');
            });
        }
        for (let i = 0; i < num; i ++) {
            $('#tab'+ Number(i + 1)).unbind('mouseleave');
            $('#tab' + Number(i + 1)). mouseleave( function() {
                $('#left' + Number(i + 1)).css('display', 'none');
                $('#right' + Number(i + 1)).css('display', 'none');
            });
        }
    }

    /**
     * 左切换
     * @param {number} num
     */
    function leftSwitch(num) {
        for (let i = 0; i < num; i ++) {
            $('#left'+ Number(i + 1)).unbind('click');
            $('#left' + Number(i + 1)).click(function() {
                if (clickFlag) {
                    let obj = JSON.parse(sessionStorage.getItem('historyLine'));
                    oSTime = sTime;
                    oETime = eTime;
                    eTime = sTime;
                    sTime = eTime - obj.tInterval * COUNT;
                    clickFlag = false;
                    wait.waitInit();
                    rtlog.reqRtlogByPeriod(obj.measures, sTime, eTime, obj.tInterval, rtLogUpDateCallBack);
                }
            });
        }
    }

    /**
     * 右切换
     * @param {number} num
     */
    function rightSwitch(num) {
        for (let i = 0; i < num; i ++) {
            $('#right'+ Number(i + 1)).unbind('click');
            $('#right' + Number(i + 1)).click(function() {
                if (clickFlag) {
                    let obj = JSON.parse(sessionStorage.getItem('historyLine'));
                    oSTime = sTime;
                    oETime = eTime;
                    sTime = eTime;
                    eTime = sTime + obj.tInterval * COUNT;
                    clickFlag = false;
                    wait.waitInit();
                    rtlog.reqRtlogByPeriod(obj.measures, sTime, eTime, obj.tInterval, rtLogUpDateCallBack);
                }
            });
        }
    }

    /**
     * 左右切换时更新曲线
     * @param {obj} resDataObject
     * @param {number} startTime
     * @param {number} endTime
     * @param {number} timeInterval
     */
    function rtLogUpDateCallBack(resDataObject, startTime, endTime, timeInterval) {
        let aData = [];
        if (typeof resDataObject !== 'object' || ! resDataObject.hasOwnProperty('structtype')) {
            console.log('system error : refreshHourECharts.');
            clickFlag = true;
            sTime = oSTime;
            eTime = oETime;
            wait.waitCancel();
            return;
        }
        let iState = resDataObject.state;
        if (iState !== 0) {
            if (iState === 504) {
                g.alert('请求超时');
            }
            console.log('server error: ', iState);
            clickFlag = true;
            sTime = oSTime;
            eTime = oETime;
            wait.waitCancel();
            return;
        }
        let iLogCount = resDataObject.logcount;
        if (iLogCount === 0) {
            clickFlag = true;
            g.alert('返回数据错误！');
            sTime = oSTime;
            eTime = oETime;
            wait.waitCancel();
            return;
        }
        let logObjects = resDataObject.data;
        console.log('received logCount: ', iLogCount);
        console.log('received logObjects.length: ', logObjects.length);
        let arr = [];
        let temp = 0;
        for (let i = 0; i < logObjects.length; i++) {
            if (!logObjects[i]) {
                break;
            } else {
                let aVal = [];
                let aLog = [];
                let logTime = startTime;
                for (let n = 0; n < logObjects[i].log.length; n++) {
                    aVal.push(logObjects[i].log[n]);
                    aLog.push(logTime);
                    logTime = logTime + timeInterval;
                }
                arr[temp] = {
                    value: aVal,
                    refreshTime: aLog,
                };
                temp ++;
            }
        }
        aData[0] = arr;
        for (let i = 0; i < aData.length; i++) {
            let aSeriesData = [];
            for (let j = 0; j < aData[i].length; j++) {
                let obj = {};
                obj.data = [];
                for (let k = 0; k < aData[i][j].refreshTime.length; k++) {
                    let oData = {
                        value: [aData[i][j].refreshTime[k], aData[i][j].value[k]],
                    };
                    obj.data.push(oData);
                }
                aSeriesData.push(obj);
            }
            let ID = 'chart' + (parseInt(tabIndex)+ 1);
            clickFlag = true;
            echartsConfig.seriesUpDate(ID, aSeriesData);
            wait.waitCancel();
        }
    }

    /**
     * 控制面板设置
     * @param {arr} aSignal
     * @param {number} nTabCount
     */
    function controlPanel(aSignal, nTabCount) {
        let aPara = [];
        let aPa = [];
        let timeUnit;
        let timeInterval;
        // 设置隐藏按钮事件
        for (let i = 0; i < nTabCount; i++) {
            $('#close-btn' + Number(i+1)).click(function() {
                if ($('#control' + Number(i+1) + ' ul').hasClass('close')) {
                    $('#control' + Number(i+1) + ' ul').removeClass('close');
                    $('#close-btn' + Number(i+1)).text('隐藏设置');
                } else {
                    $('#control' + Number(i+1) + ' ul').addClass('close');
                    $('#close-btn' + Number(i+1)).text('显示设置');
                }
            });
        }
        // 获取每个tab的设置属性
        for (let i = 0; i < aSignal.length; i++) {
            if (aSignal[i + 1]) {
                if (aSignal[i].tabIndex !== aSignal[i + 1].tabIndex) {
                    aPara.push(aSignal[i].para);
                }
            } else {
                aPara.push(aSignal[i].para);
            }
        }


        // 设置原始值
        for (let i = 0; i < aPara.length; i++) {
            let obj = JSON.parse(aPara[i]);
            timeUnit = obj.timeUnit || 'h';
            $('#control' + Number(i + 1) + ' .sel').find('option[value=' + timeUnit + ']').attr('selected', true);
            $('#control' + Number(i + 1) + ' input[name=\'start-time\']').val(utils.time.utc2Locale(Number(obj.startTime/1000), '-', 'T'));
            // $('#control' + Number(i + 1) + ' input[name=\'end-time\']').val(utils.time.utc2Locale(Number(obj.endTime/1000), '-', 'T'));
            switch (timeUnit) {
            case 'h':
                timeInterval = Number(obj.timeInterval)/(1000*60*60);
                break;
            case 'm':
                timeInterval = Number(obj.timeInterval)/(1000*60);
                break;
            case 's':
                timeInterval = Number(obj.timeInterval)/1000;
                break;
            default:
                timeInterval = Number(obj.timeInterval)/(1000*60*60);
            }
            $('#control' + Number(i + 1) + ' input[name=\'time-interval\']').val(timeInterval);
        }
        // 设置保存按钮事件
        for (let i = 0; i < nTabCount; i++) {
            $('#save-btn' + Number(i+1)).click(function() {
                let updateSql = '';
                // 获取原有的F_V属性
                for (let j = 0; j < aValue[i].length; j++) {
                    let para = JSON.parse(aValue[i][j].para);
                    let obj = {
                        color: para.color,
                        yName: para.yName,
                        yUnit: para.yUnit,
                    };
                    aPa.push(obj);
                }
                let tStart = new Date($('#control' + Number(i + 1) + ' input[name=\'start-time\']').val()).getTime();
                let tUnit = $('#control' + Number(i + 1) + ' .sel').find('option:selected').val();
                let tInterval = $('#control' + Number(i + 1) + ' input[name=\'time-interval\']').val();
                switch (tUnit) {
                case 'h':
                    tInterval = tInterval*60*60*1000;
                    break;
                case 'm':
                    tInterval = tInterval*60*1000;
                    break;
                case 's':
                    tInterval = tInterval*1000;
                    break;
                default:
                    tInterval = tInterval*60*60*1000;
                    break;
                }
                let tEnd = tStart + COUNT * tInterval;
                let nowTime = new Date().getTime();
                if (tEnd > nowTime) {
                    tEnd = nowTime;
                }
                if (aValue[i].length > MAXCOUNT) {
                    g.alert('间隔过大，请重新填写！');
                    return;
                }
                for (let j = 0; j < aValue[i].length; j ++) {
                    let oPara = {
                        color: aPa[j].color,
                        yName: aPa[j].yName,
                        yUnit: aPa[j].yUnit,
                        startTime: tStart,
                        endTime: tEnd,
                        timeInterval: tInterval,
                        timeUnit: tUnit,
                    };
                    let sV = JSON.stringify(oPara);
                    updateSql = updateSql + 'update omc_user_subscribe set F_V = ' + '\'' + sV + '\'' +
                        ' where ID = ' + aValue[i][j].ID + ';';
                }
                if (clickFlag) {
                    clickFlag = false;
                    gDb.load(updateSql, function(err, val) {
                        if (err) {
                            console.log(err);
                        } else {
                            for (let i = 0; i < nTabCount; i++) {
                                $('#close-btn' + Number(i+1)).unbind('click');
                                $('#save-btn' + Number(i+1)).unbind('click');
                            }
                            clickFlag = true;
                            dataShow(i);
                        }
                    }, gReqParam);
                }
            });
        }
    }

    /**
     * 模块返回调用接口
     */
    return {
        beforeOnload: function() {
        },

        onload: function() {
            oAction.init();
        },
    };
});
