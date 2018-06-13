/**
 * Created by nielei on 2018/4/13.
 */

'use strict';

define(['jquery', 'async', 'global', 'panelConfig', 'jqGrid', 'jqGridConfig', 'action', 'cjcommon', 'cjstorage', 'cjdatabaseaccess', 'cjajax', 'loadNode', 'structure', 'model', 'view', 'controller', 'utils', 'cache', 'jqGridExtension'], function($, async, g) {
    let gDb = null;
    let tableName; // 主表
    let tableNameChild; // 从表
    let child = {}; // 从表相关方法
    let connection; // 主从表之间数据库联系字段
    let loadSql = '';
    let loadSqlChild = '';
    let sort = null;
    let sortChild = null;
    let group = null;
    let groupChild = null;
    let saveSql;
    let def = [];
    let defChild = [];
    let copyData; // 表格原始数据
    let copyDataChild;
    let operationData;
    let operationDataChild;
    let connectionChild;

    let gReqParam = null;
    let tbID = $('#tbList');
    let tbIDChild = $('#tbList_c');
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

    /**
     * 获取json配置信息
     */
    function getConfig() {
        let arr = sessionStorage.getItem('tbName');
        let arrs = [];
        arrs = arr.split('!');
        let projectName = sessionStorage.getItem('projectName');
        let configUrl = '/ics/' + projectName + '/config/template_config/' + arrs[0] + '.json';
        $.getJSON(configUrl, function(data) {
            tableName = data.tbName;
            tableNameChild = data.tbNameChild;
            def = data.def;
            defChild = data.defChild;
            let a = data.connection.split(',');
            if (a.length>1) {
                child.connection = a[0];
                connection = a[0];
                connectionChild = a[1];
            } else {
                child.connection = a[0];
                connection = a[0];
                connectionChild = a[0];
            }
            loadSqlChild = data.loadSqlChild;

            if (data.operationPanel !== undefined) {
                operationData = data.operationPanel.items;
                if (operationData !== null) {
                    panelConfig.operationInit('operation', operationData);
                    btnBind(operationData);
                }
            }
            if (data.operationPanelChild !== undefined) {
                operationDataChild = data.operationPanelChild.items;
                if (operationDataChild !== null) {
                    panelConfig.operationInit('operationChild', operationDataChild);
                    btnBindChild(operationDataChild);
                }
            }

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
                initTopTable(loadSql);
            } else {
                initTopTable(loadSql, arrs[1]);
            }
        });
    }

    /**
     * 加载主表，显示数据
     * @param {str} loadSql
     * @param  {str} filter
     */
    function initTopTable(loadSql, filter) {
        jqGridConfig.tableInit(tbID, def, 'pager', child);
        uiResizeListener();
        loadTop(loadSql, filter);
        jqGridConfig.tableInit(tbIDChild, defChild, 'pager_c');
        uiResizeListenerC();
    }

    child.loadTBDataChild = function(sel) {
        tbIDChild.jqGrid('clearGridData', false);
        let sql = 'select * from ' + tableNameChild + ' where ' + connectionChild + ' = ' + '\'' + sel + '\'';
        if (loadSqlChild !== '') {
            sql = loadSqlChild + ' where ' + connectionChild + ' = ' + '\'' + sel + '\'';
        }
        loadBottom(sql);
    };
    function loadTop(sql, filter) {
        jqGridExtend.countNum(sql, filter, tableName, group, 20, 'data_record_count_span');
        jqGridExtend.paging(tbID, sql, filter, tableName, group, sort, 20, 'pager', def);
        jqGridExtend.pageBtn(tbID, sql, tableName, '', 20, 'pager', 'data_record_count_span', def);
    }
    function loadBottom(sql) {
        jqGridExtend.countNum(sql, '', tableNameChild, '', 20, 'data_record_count_span1');
        jqGridExtend.paging(tbIDChild, sql, '', tableNameChild, '', '', 20, 'pager_c', defChild);
        jqGridExtend.pageBtn(tbIDChild, sql, tableNameChild, '', 20, 'pager_c', 'data_record_count_span1', defChild);
    }
    function uiResizeListener() {
        let tableId = 'tbList';
        let parentBox = $('#gbox_' + tableId).parent();
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
    function uiResizeListenerC() {
        let tableId = 'tbList_c';
        let parentBox = $('#gbox_' + tableId).parent();
        let gridBox = $('#' + tableId);
        gridBox.setGridWidth(parentBox.innerWidth() - 2);
        let height = parentBox.innerHeight() -
            $('#gbox_' + tableId + ' .ui-jqgrid-hdiv').outerHeight() -
            $('#pager_c').outerHeight() -
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

    function btnBindChild(data) {
        for (let i = 0; i < data.length; i++) {
            $('#' + data[i].id).unbind('click');
            $('#' + data[i].id).click(function() {
                copyDataChild = JSON.parse(sessionStorage.getItem('tablePriData'));
                action.register(data[i], tbIDChild, tableNameChild, defChild, g, copyDataChild);
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
