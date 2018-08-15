/**
 * Created by nielei on 2018/5/22.
 */
'use strict';

define(['jquery', 'global', 'async', 'jqGrid', 'echartConfig', 'panelConfig', 'uix-date', 'jqGridConfig', 'action', 'cjcommon', 'cjstorage', 'cjdatabaseaccess', 'cjajax', 'treeConfig', 'utils', 'cache', 'jqGridExtension'], function($, g, async) {
    let gDb = null;
    let gReqParam = null;
    let aTabIndex = []; // 标签索引
    let aTitle = [];
    let aTabData = [];
    let aSeriesDataUpdate =[];
    let iUserID = sessionStorage.getItem('s_user_ID');

    let netype; // 表定义表中的NeType
    let tableName; // 表名
    let multi;
    let def = []; // 表定义表相关定义

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
            getConfig();
        },
    };

    function getConfig() {
        let arr = sessionStorage.getItem('tbName');
        let arrs = [];
        arrs = arr.split('!');
        let projectName = sessionStorage.getItem('projectName');
        let configUrl = '/ics/' + projectName + '/config/template_config/' + arrs[0] + '.json';
        $.getJSON(configUrl, function(data) {
            netype = data.neType;
            tableName = data.tbName;
            multi = data.multi;
            def = data.def;
            tabInit();
        });
    }

    /**
     * 初始化Tab页
     */
    function tabInit() {
        let sSql = 'select ID,F_NID as TabIndex, F_NAME as TabTitle from omc_user_tab where F_MID = ' + iUserID + ' and F_CLASS = \'' + netype +'\'';
        let sLiModel = '';
        let sDivModel = '';
        gDb.load(sSql, function fn(err, val) {
            if (err) {
                console.log(err);
            } else {
                if (val.length === 0) {
                    alert('请先前往实时曲线配置功能进行配置！');
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
                                                        </div>
                                                     </div>`;
                        }
                        aTitle.push(val[i].TabTitle);
                    }
                    $('.nav-tabs').append(sLiModel);
                    $('.tab-content').append(sDivModel);
                    dataShow();
                }
            }
        }, gReqParam);
    }

    /**
     * 数据展示
     */
    function dataShow() {
        let sGetSignalSql = 'select F_NID as tabIndex,F_PID as NeNo,F_URI as SignalUrl, F_NAME as SignalName, F_V as para from omc_user_subscribe where F_MID = ' + iUserID + ' and F_CLASS = \'' + netype +'\'';
        let sGetTabCount = 'select count(' + '\'F_NID\'' + ') as sum from omc_user_tab where F_CLASS = \'' + netype +'\'';

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
            let aData = [];
            let nCallBackCount = 1;
            for (let i = 0; i < aSignal.length; i++) {
                cc4k.rtdb.appendMeasureByNenoCode(Number(aSignal[i].NeNo), aSignal[i].SignalUrl);
            }
            cc4k.rtdb.startSyncMeasures();
            cc4k.rtdb.registerMeasuresChangedCallback(function() {
                let aMeasure = [];
                for (let i = 0; i < aSignal.length; i++) {
                    aMeasure.push(cc4k.rtdb.findMeasureByNenoCode(Number(aSignal[i].NeNo), aSignal[i].SignalUrl));
                }
                for (let k = 0; k < nTabCount; k ++) {
                    let arr = [];
                    let temp = 0;
                    for (let i = 0; i < aMeasure.length; i++) {
                        for (let j = 0; j < aSignal.length; j++) {
                            if (!aMeasure[i]) {
                                break;
                            } else {
                                if (aMeasure[i].code === aSignal[j].SignalUrl) {
                                    if (aSignal[j].tabIndex === k + 1) {
                                        let oV = JSON.parse(aSignal[j].para);
                                        arr[temp] = {
                                            code: aSignal[j].SignalName,
                                            value: aMeasure[i].value,
                                            refreshTime: aMeasure[i].refreshTime,
                                            res: aMeasure[i].res,
                                            tabIndex: aSignal[j].tabIndex,
                                            color: oV.color,
                                            yName: oV.yName,
                                            yUnit: oV.yUnit,
                                        };
                                        temp ++;
                                    }
                                }
                            }
                        }
                    }
                    aData[k] = arr;
                }
                if (nCallBackCount === 1) {
                    lineInit(aData);
                    // 组装更新曲线的数据结构
                    for (let i = 0; i < aData.length; i++) {
                        aTabData[i] = [];

                        for (let j = 0; j < aData[i].length; j++) {
                            aTabData[i][j] = {};
                            aTabData[i][j].data = [];

                            // aTabData[i][j].data = [];
                            // aTabData[i][j].data.length = 240;
                            // aTabData[i][j].index = 0;
                            //
                            // for(let k=0;k<240;k++)
                            // {
                            //     let oData = {};
                            //     oData.value = [,];
                            //     aTabData[i][j].data[k] = oData;
                            // }
                        }
                    }
                    console.log(aTabData);
                    nCallBackCount++;
                } else {
                    for (let i = 0; i < aData.length; i++) {
                        let ID = 'chart' + Number(i + 1);
                        for (let j = 0; j < aData[i].length; j++) {
                            let oData = {};
                            oData.value = [aData[i][j].refreshTime, aData[i][j].value];

                            // aTabData[i][j].data[aTabData[i][j].index] = oData;
                            //
                            // if(aTabData[i][j].index==0)
                            // {
                            //     let min = utils.time.locale2Utc(aData[i][j].refreshTime);
                            //     let max = utils.time.utc2Locale((Number(min)+240).toString());
                            //     let ax={
                            //         min:aData[i][j].refreshTime,
                            //         max:max,
                            //         type: 'time',
                            //     };
                            //     echartsConfig.setAxis(ID,ax);
                            // }
                            // if(aTabData[i][j].index==239)
                            // {
                            //     aTabData[i][j].index = 0;
                            //     for(let k=0;k<240;k++)
                            //     {
                            //         let oData = {};
                            //         oData.value = [,];
                            //         aTabData[i][j].data[k] = oData;
                            //     }
                            // }
                            // else
                            // {
                            //     aTabData[i][j].index ++;
                            // }
                            if (aTabData[i][j].data.length === 0) {
                                setAxis(ID, oData.value[0], 240);
                            }
                            if (aTabData[i][j].data.length > 239) {
                                aTabData[i][j].data.splice(0, 120);
                                let a = aTabData[i][j].data[0];
                                setAxis(ID, a.value[0], 240);
                                aTabData[i][j].data.push(oData);
                            } else {
                                aTabData[i][j].data.push(oData);
                            }
                        }
                        echartsConfig.seriesUpDate(ID, aTabData[i]);
                    }
                    nCallBackCount++;
                    console.log(aTabData);
                    console.log(nCallBackCount);
                    console.log('line', aData);
                }
            });
        });
    }

    function setAxis(id, strStart, len) {
        let min = utils.time.locale2Utc(strStart);
        let max = utils.time.utc2Locale((Number(min)+Number(len)).toString());
        let ax={
            min: strStart,
            max: max,
            type: 'time',
        };
        echartsConfig.setAxis(id, ax);
    }
    /**
     * 加载数据
     * @param {arr} aData
     */
    function lineInit(aData) {
        let height = 0;
        let width = 0;
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
                let oData = {};
                obj.showSymbol = false;
                obj.name = aData[i][j].code;
                obj.type = 'line';
                obj.showSymbol= false;
                obj.yAxisIndex = j;
                oData.value = [aData[i][j].refreshTime, aData[i][j].value];
                obj.data = [];
                obj.data.push(oData);
                aSeriesData.push(obj);
            }
            let ID = 'chart' + Number(i + 1);
            if (i === 0) {
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
                float: false,
            };
            echartsConfig.dynamicTimeConfig(ID, option);
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
