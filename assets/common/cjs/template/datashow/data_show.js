/**
 * Created by nielei on 2018/5/4.
 */
'use strict';

define(['jquery', 'global', 'async', 'jqGrid', 'panelConfig', 'uix-date', 'jqGridConfig', 'action', 'cjcommon', 'cjstorage', 'cjdatabaseaccess', 'cjajax', 'treeConfig', 'utils', 'cache', 'jqGridExtension'], function($, g, async) {
    let gDb = null;
    let gReqParam = null;
    let aTabIndex = []; // 标签索引

    let netype; // 表定义表中的NeType
    let tableName; // 表名
    let multi;
    let loadSql = '';
    let initSql = '';
    let sort = null;
    let group = null;
    let copyData; // 表格原始数据
    let def = []; // 表定义表相关定义
    let operationData; // 操作按钮
    let queryCfg; // 查询面板配置
    let timeType; // 时间类型


    let iUserID = sessionStorage.getItem('s_user_ID');
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
            // queryCfg = data.queryPanel.items;
            // for (let i = 0; i <queryCfg.length; i++) {
            //     if (queryCfg[i].name === 'F_T') {
            //         timeType = queryCfg[i].timeType || 'str';
            //     }
            // }
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
                    alert('请先前往实时数据配置功能进行配置！');
                } else {
                    for (let i = 0; i < val.length; i++) {
                        aTabIndex.push(val[i].TabIndex);
                        if (i === 0) {
                            sLiModel = `<li class='active'>
                                            <a href='#tab${val[i].TabIndex}' data-toggle='tab' id='index${val[i].TabIndex}'>${val[i].TabTitle}</a>
                                        </li>`;
                            sDivModel = `<div class='tab-pane active index${val[i].TabIndex}-table' id='tab${val[i].TabIndex}'>
                                            <div class='toolbar toolbar${val[i].TabIndex}' id = 'operation${val[i].TabIndex}'>
                                            <span class='r' id='data_record_count_span${val[i].TabIndex}'></span>
                                            </div>
                                            <table id='tbList${val[i].TabIndex}' class='table table-bordered noborder table-striped'>
                                            </table>
                                            <div id='pager${val[i].TabIndex}'></div>
                                         </div>`;
                        } else {
                            sLiModel = sLiModel + `<li>
                                                      <a href='#tab${val[i].TabIndex}' data-toggle='tab' id='index${val[i].TabIndex}'>${val[i].TabTitle}</a>
                                                   </li>`;
                            sDivModel = sDivModel + `<div class='tab-pane index${val[i].TabIndex}-table' id='tab${val[i].TabIndex}'>
                                                        <div class='toolbar toolbar${val[i].TabIndex}' id = 'operation${val[i].TabIndex}'>
                                                        <span class='r' id='data_record_count_span${val[i].TabIndex}'></span>
                                                        </div>
                                                        <table id='tbList${val[i].TabIndex}' class='table table-bordered noborder table-striped'>
                                                        </table>
                                                        <div id='pager${val[i].TabIndex}'></div>
                                                     </div>`;
                        }
                    }
                    $('.nav-tabs').append(sLiModel);
                    $('.tab-content').append(sDivModel);
                    tableInit();
                    for (let i = 0; i < aTabIndex.length; i++) {
                        uiResizeListener(aTabIndex[i]);
                        // loadTable(aTabIndex[i]);
                    }
                }
            }
        }, gReqParam);
    }

    /**
     * 初始化表格
     */
    function tableInit() {
        for (let i = 0; i < aTabIndex.length; i++) {
            // let aDef = [
            //     {propName: '名称', colName: 'code', propType: 4, readOnly: 1, width: 100, defaultValue: '{"type": "3", "value": "' + iUserID + '"}'},
            //     {propName: '值', colName: 'value', propType: 4, readOnly: 1, width: 100, defaultValue: '{"type": "3", "value": "' + aTabIndex[i] + '"}'},
            //     {propName: '时标', colName: 'refreshTime', propType: 4, readOnly: 1, width: 100},
            //     {propName: '备注', colName: 'res', propType: 4, readOnly: 1, width: 100},
            // ];
            let tbID = $('#tbList' + aTabIndex[i]);
            jqGridConfig.tableInit(tbID, def, 'pager' + aTabIndex[i]);
            // dataShow(aTabIndex[i]);
        }
        dataShow();
    }

    /**
     * 数据展示
     */
    function dataShow() {
        let sGetSignalSql = 'select F_NID as tabIndex,F_PID as NeNo,F_URI as SignalUrl, F_NAME as SignalName from omc_user_subscribe where F_MID = ' + iUserID + ' and F_ST_FLAG = 1 and F_CLASS = \'' + netype +'\'';
        let sGetTabCount = 'select count(' + '\'F_NID\'' + ') as sum from omc_user_tab where F_CLASS = \'' + netype +'\'';

        async.auto({
            getSignal: function(callBack) {
                loadSql_2(sGetSignalSql, function(v) {
                    callBack(null, v);
                });
            },
            getTabCount: function(callBack) {
                loadSql_2(sGetTabCount, function(v) {
                    callBack(null, v);
                });
            },
        }, function(err, value) {
            let aSignal = value.getSignal;
            let nTabCount = value.getTabCount[0].sum;
            let aData = [];
            let aPreData = [];
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
                                        arr[temp] = {
                                            code: aSignal[j].SignalName,
                                            value: aMeasure[i].value,
                                            refreshTime: aMeasure[i].refreshTime,
                                            res: aMeasure[i].res,
                                            tabIndex: aSignal[j].tabIndex,
                                            rowID: temp + 1,
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
                    aPreData = aData.concat();
                    loadData(aData);
                    nCallBackCount++;
                } else {
                    for (let i = 0; i < aData.length; i++) {
                        for (let j = 0; j < aData[i].length; j++) {
                            for (let k = 0; k < aData[i].length; k++) {
                                if (aData[i][j].code === aPreData[i][k].code) {
                                    if (aData[i][j].value !== aPreData[i][k].value) {
                                        $('#tbList' + aData[i][j].tabIndex).jqGrid('setCell', aData[i][j].rowID, 'value', aData[i][j].value);
                                        $('#tbList' + aData[i][j].tabIndex + ' #' + aData[i][j].rowID + ' td[aria-describedby=\"tbList' + aData[i][j].tabIndex + '_value\"]').css('animation', 'dataChanged 1s');
                                        setTimeout(function() {
                                            $('#tbList' + aData[i][j].tabIndex + ' #' + aData[i][j].rowID + ' td[aria-describedby=\"tbList' + aData[i][j].tabIndex + '_value\"]').css('animation', '');
                                        }, 1000);
                                    }
                                    if (aData[i][j].refreshTime !== aPreData[i][k].refreshTime) {
                                        $('#tbList' + aData[i][j].tabIndex).jqGrid('setCell', aData[i][j].rowID, 'refreshTime', aData[i][j].refreshTime);
                                        // $('#tbList' + aData[i][j].tabIndex + ' #' + aData[i][j].rowID + ' td[aria-describedby=\"tbList' + aData[i][j].tabIndex + '_refreshTime\"]').css('animation', 'dataChanged 1s');
                                        // setTimeout(function() {
                                        //     $('#tbList' + aData[i][j].tabIndex + ' #' + aData[i][j].rowID + ' td[aria-describedby=\"tbList' + aData[i][j].tabIndex + '_refreshTime\"]').css('animation', '');
                                        // }, 1000);
                                    }
                                    if (aData[i][j].res !== aPreData[i][k].res) {
                                        $('#tbList' + aData[i][j].tabIndex).jqGrid('setCell', aData[i][j].rowID, 'res', aData[i][j].res);
                                        $('#tbList' + aData[i][j].tabIndex + ' #' + aData[i][j].rowID + ' td[aria-describedby=\"tbList' + aData[i][j].tabIndex + '_res\"]').css('animation', 'dataChanged 1s');
                                        setTimeout(function() {
                                            $('#tbList' + aData[i][j].tabIndex + ' #' + aData[i][j].rowID + ' td[aria-describedby=\"tbList' + aData[i][j].tabIndex + '_res\"]').css('animation', '');
                                        }, 1000);
                                    }
                                }
                            }
                        }
                    }
                    aPreData = aData.concat();  // 深拷贝
                    nCallBackCount++;
                    console.log(nCallBackCount);
                    console.log(aPreData, aData);
                }
            });
        });
    }

    /**
     * 加载数据
     * @param {arr} aData
     */
    function loadData(aData) {
        for (let i = 0; i < aData.length; i++) {
            let jqGridTable = $('#tbList' + Number(i + 1));
            jqGridTable.jqGrid('clearGridData');
            for (let j = 0; j < aData[i].length; j++) {
                jqGridTable.jqGrid('addRowData', j + 1, aData[i][j]);
            }
            $('#data_record_count_span'+ Number(i + 1)).text('共' + aData[i].length + '条记录');
        }
    }
    /**
     * 执行sql
     * @param {str} sql
     * @param {fn} callBack
     */
    function loadSql_2(sql, callBack) {
        gDb.load(sql, function(e, v) {
            callBack(v);
        }, gReqParam);
    }


    /**
     * table位置调整
     * @param {num} id
     */
    function uiResizeListener(id) {
        let tableId = 'tbList' + id;
        let parentBox = $('#gbox_' + tableId).parent().parent();
        let gridBox = $('#' + tableId);
        gridBox.setGridWidth(parentBox.innerWidth() - 2);
        let height;
        if (id === 1) {
            height = parentBox.innerHeight() -
                $('#gbox_' + tableId + ' .ui-jqgrid-hdiv').outerHeight() -
                $('#pager' + id).outerHeight() -
                $('.toolbar' + id).outerHeight() -
                2;
        } else {
            height = parentBox.innerHeight() -
                $('#gbox_' + tableId + ' .ui-jqgrid-hdiv').outerHeight() -
                $('#pager' + id).outerHeight() -
                $('.toolbar' + id).outerHeight() -
                37;
        }
        if (parentBox.innerHeight() === 0) {
            height = 265;
        }
        gridBox.setGridHeight(height);
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
