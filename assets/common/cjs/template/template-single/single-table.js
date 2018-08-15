/**
 * Created by nielei on 2017/11/14.
 */

'use strict';

define(['jquery', 'async', 'global', 'jqGrid', 'panelConfig', 'jqGridConfig', 'action', 'cjcommon', 'cjstorage', 'cjdatabaseaccess', 'cjajax', 'loadNode', 'structure', 'model', 'view', 'controller', 'utils', 'cache', 'jqGridExtension'], function($, async, g) {
    let gDb = null;
    let netype; // 表定义表中的NeType
    let tableName; // 表名
    let multi; // 是否多选
    let localData; // 本地数据
    let copyData; // 表格原始数据
    let loadSql = '';
    let initSql = '';
    let group = null;
    let sort = null;
    let def = []; // 表定义表相关定义
  // let copyData
    let operationData; // 操作按钮

    let gReqParam = null;
    let tbID = $('#tbList');
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
            localData = data.localData;
            def = data.def;
            if (data.operationPanel !== undefined) {
                operationData = data.operationPanel.items;
                if (operationData !== null) {
                    panelConfig.operationInit('operation', operationData);
                    btnBind(operationData);
                }
            }
            multi = data.multi;
            if (data.loadSql !== undefined) {
                loadSql = data.loadSql;
                if (data.sort !== undefined) {
                    sort = data.sort;
                }
                if (data.group !== undefined) {
                    group = data.group;
                }
            }
            if (arrs[1] === undefined) {
                if (data.initSql) {
                    loadSql = data.initSql;
                }
                loadPropertyDef(gDb, loadSql);
            } else {
                if (data.initSql) {
                    loadSql = data.initSql;
                }
                loadPropertyDef(gDb, loadSql, arrs[1]);
            }
        });
    }

    function loadPropertyDef(db, loadSql, filter) {
        if (multi) {
            jqGridConfig.multiSelectTableInit(tbID, def, 'pager');
        } else {
            jqGridConfig.tableInit(tbID, def, 'pager');
        }
        uiResizeListener();
        if (localData) {
            let jqGridTable = $('#tbList');
            let recordCountSpan = $('#data_record_count_span');
            let data = sessionStorage.getItem('merge').split('!');
            let recordLength = data.length - 1;

            for (let i = 0; i <= recordLength; i++) {
                if (i < recordLength) {
                    let aGroup = JSON.parse(data[i]);
                    if (aGroup.F_WUZHI === '兰炭') {
                        aGroup.F_SFCY = 1;
                    } else {
                        aGroup.F_SFCY = 2;
                    }
                    jqGridTable.jqGrid('addRowData', i + 1, aGroup);
                    jqGridTable.jqGrid('setCell', i, 'rowID', i);
                }
                if (i === recordLength) {
                    jqGridTable.jqGrid('setCell', i, 'rowID', i);
                }
            }
            copyData = jqGridTable.jqGrid('getRowData');
            recordCountSpan.text('共' + recordLength.toString() + '条记录');
        } else {
            jqGridExtend.countNum(loadSql, filter, tableName, group, 20, 'data_record_count_span');
            jqGridExtend.paging(tbID, loadSql, filter, tableName, group, sort, 20, 'pager', def);
            jqGridExtend.pageBtn(tbID, loadSql, tableName, sort, 20, 'pager', 'data_record_count_span', def);
        }
    // }, reqParam)
    }

    function uiResizeListener() {
        let tableId = 'tbList';
        let parentBox = $('#gbox_tbList').parent();
        let gridBox = $('#' + tableId);
        gridBox.setGridWidth(parentBox.innerWidth() - 2);
        let height = parentBox.innerHeight() -
                    $('#gbox_' + tableId + ' .ui-jqgrid-hdiv').outerHeight() -
                    $('#pager').outerHeight() -
                    $('.toolbar').outerHeight() -
                    2;
        if (parentBox.innerHeight() === 0) {
            height = 265;
        }
        gridBox.setGridHeight(height);
    }

    function btnBind(data) {
        for (let i = 0; i < data.length; i++) {
            $('#' + data[i].id).unbind('click');
            $('#' + data[i].id).click(function() {
                copyData = JSON.parse(sessionStorage.getItem('tablePriData'));
                action.register(data[i], tbID, tableName, def, g, copyData);
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
