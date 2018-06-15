/**
 * Created by nielei on 2017/11/16.
 */

'use strict';

define(['jquery', 'async', 'global', 'panelConfig', 'jqGrid', 'jqGridConfig', 'action', 'alarmModal', 'cjcommon', 'cjstorage', 'cjdatabaseaccess', 'cjajax', 'loadNode', 'structure', 'model', 'view', 'controller', 'utils', 'cache', 'jqGridExtension'], function($, async, g) {
    let gDb = null;
    let tableName; // 主表
    let tableNameChild; // 从表
    let child = {}; // 从表相关方法
    let tbName = []; // 表定义表中NeType
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

    function getConfig() {
        let arr = sessionStorage.getItem('tbName');
        let arrs = [];
        arrs = arr.split('!');
        let projectName = sessionStorage.getItem('projectName');
        let configUrl = '/ics/' + projectName + '/config/template_config/' + arrs[0] + '.json';
        $.getJSON(configUrl, function(data) {
            tbName = data.tbName;
            operationDataChild = data.operationPanel.itemsChild;
            child.connection = data.connection;
            if (data.operationPanel !== undefined) {
                operationData = data.operationPanel.items;
                if (operationData !== null) {
                    panelConfig.operationInit('operation', operationData);
                    btnBind(operationData);
                }
            }
            if (data.operationPanelChild !== undefined) {
                operationDataChild = data.operationPanel.itemsChild;
                if (operationDataChild !== null) {
                    panelConfig.operationInit('operation', operationDataChild);
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
            if (data.loadSqlChild !== undefined) {
                loadSqlChild = data.loadSqlChild;
                if (data.sortChild !== undefined) {
                    sortChild = data.sortChild;
                }
                if (data.group !== undefined) {
                    groupChild = data.groupChild;
                }
            }
            jqGridExtend.pageBtn(loadSql, tableName, sort, 40, 'pager', 'data_record_count_span');
            jqGridExtend.pageBtn(loadSqlChild, tableName, sort, 40, 'pager', 'data_record_count_span');
            if (arrs[1] === undefined) {
                loadPropertyDef(gDb, loadSql, loadSqlChild);
            } else {
                loadPropertyDef(gDb, loadSql, loadSqlChild, arrs[1]);
            }
        });
    }

    function loadTBData(neTypeHex, loadSql, filter) {
        let jqGridTable = $('#tbList');
        jqGridTable.jqGrid('clearGridData', false);
        let recordCountSpan = $('#data_record_count_span');
        tableName = 'property_' + neTypeHex;
        let sql = 'select * from ' + tableName;
        if (loadSql !== '') {
            sql = loadSql;
        }
        if (filter !== undefined) {
            sql = sql + ' where ' + filter;
        }
        if (sort !== null) {
            sql = sql + ' order by ' + sort;
        }
        gDb.load(sql, function fn(err, vals) {
            if (err) {
                console.log(err);
            }

            let recordLength = vals.length;

            for (let i = 0; i <= recordLength; i++) {
                if (i < recordLength) {
                    let aGroup = vals[i];
                    jqGridTable.jqGrid('addRowData', i + 1, aGroup);
                    jqGridTable.jqGrid('setCell', i + 1, 'rowID', i + 1);
                }
                if (i === recordLength) {
                    jqGridTable.jqGrid('setCell', i, 'rowID', i);
                }
            }
            copyData = jqGridTable.jqGrid('getRowData');
            recordCountSpan.text('共' + recordLength.toString() + '条记录');
        }, gReqParam);
    }

    child.loadTBDataChild = function(sel) {
        let jqGridTable = $('#tbList_c');
        jqGridTable.jqGrid('clearGridData', false);
        let recordCountSpan = $('#data_record_count_span1');
        tableNameChild = 'property_' + tbName[1];
        let sql = 'select * from ' + tableNameChild + ' where ' + connection + ' = ' + '\'' + sel + '\'';
        if (loadSqlChild !== '') {
            sql = loadSqlChild;
        }
        if (sort !== null) {
            sql = sql + ' order by ' + sort;
        }
        gDb.load(sql, function fn(err, vals) {
            if (err) {
                console.log(err);
            }

            let recordLength = vals.length;

            for (let i = 0; i <= recordLength; i++) {
                if (i < recordLength) {
                    let aGroup = vals[i];
                    jqGridTable.jqGrid('addRowData', i + 1, aGroup);
                    jqGridTable.jqGrid('setCell', i + 1, 'rowID', i + 1);
                }
                if (i === recordLength) {
                    jqGridTable.jqGrid('setCell', i, 'rowID', i);
                }
            }
            copyDataChild = jqGridTable.jqGrid('getRowData');
            recordCountSpan.text('共' + recordLength.toString() + '条记录');
        }, gReqParam);
    };

    function loadPropertyDef(db, loadSql, loadSqlChild, filter) {
        let serverInfo = cacheOpt.get('server-config');
        let reqHost = serverInfo['server']['ipAddress'];
        let reqPort = serverInfo['server']['httpPort'];
        let reqParam = {
            reqHost: reqHost,
            reqPort: reqPort,
        };
        let sql = 'select * from qms_propertydef';
        db.load(sql, function(err, vals) {
            let sNeType;
            for (let i = 0; i < vals.length; i++) {
                let val = vals[i];
                sNeType = val.NeType;
                if (sNeType === tbName[0]) {
                    let define = {
                        propName: vals[i].PropName,
                        colName: vals[i].ColumnName,
                        visible: vals[i].Visible,
                        propType: vals[i].PropType,
                        unique: vals[i].Unique,
                        required: vals[i].Required,
                        readOnly: vals[i].ReadOnly,
                        defaultValue: vals[i].DefaultValue,
                        valueScopes: vals[i].ValueScopes,
                        foreignKey: vals[i].ForeignKey,
                        width: vals[i].DisplayWidth,
                    };
                    def.push(define);
                }
                if (sNeType === tbName[1]) {
                    let define = {
                        propName: vals[i].PropName,
                        colName: vals[i].ColumnName,
                        visible: vals[i].Visible,
                        propType: vals[i].PropType,
                        unique: vals[i].Unique,
                        required: vals[i].Required,
                        readOnly: vals[i].ReadOnly,
                        defaultValue: vals[i].DefaultValue,
                        valueScopes: vals[i].ValueScopes,
                        foreignKey: vals[i].ForeignKey,
                        width: vals[i].DisplayWidth,
                    };
                    defChild.push(define);
                }
            }
            jqGridConfig.tableInit(tbID, def, 'pager', child);
            uiResizeListener();
            jqGridConfig.tableInit(tbIDChild, defChild, 'pager_c');
            uiResizeListenerChild();
            loadTBData(tbName[0], loadSql, filter);
        }, reqParam);
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
    function uiResizeListenerChild() {
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
                saveSql = action.register(data[i], tbID, tableName, def, g, copyData);
            });
        }
    }

    function btnBindChild(data) {
        for (let i = 0; i < data.length; i++) {
            $('#' + data[i].id).unbind('click');
            $('#' + data[i].id).click(function() {
                saveSql = action.register(data[i], tbIDChild, tableNameChild, defChild, g, copyDataChild);
                if (saveSql !== undefined) {
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
