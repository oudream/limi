/**
 * Created by nielei on 2018/4/13.
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
            initTopTable();
            loadTop();
            initBottomTable();
            loadBottom();
        },
    };
    function initTopTable() {
        let def = [
            {propName: '序号', colName: 'ID', propType: 4, readOnly: 1, visible: 0, width: 100},
            {propName: '应用', colName: 'AppID', propType: 4, readOnly: 1, visible: 0, width: 100, defaultValue: '{"type": "3", "value": "' + 3 + '"}'},
            {propName: 'IP', colName: 'IP', propType: 4, readOnly: 1, visible: 0, width: 100, defaultValue: '{"type": "3", "value": "' + 4 + '"}'},
            {propName: '端口', colName: 'Port', propType: 4, readOnly: 1, visible: 0, width: 100, defaultValue: '{"type": "3", "value": "' + 4 + '"}'},
            {propName: '三遥订阅', colName: 'TableName', propType: 5, readOnly: 1, visible: 1, width: 100, foreignKey: '{"type": "3","sql": "select F_NAME,F_V from omc_vxd_cst where F_CLASS = ' + '\'' + 'SUBS' + '\'' + '"}'},
            {propName: '起始点号', colName: 'StartID', propType: 4, readOnly: 0, visible: 1, width: 100, defaultValue: '{"type": "3", "value": "0"}'},
            {propName: '结束点号', colName: 'EndID', propType: 4, readOnly: 0, visible: 1, width: 100, defaultValue: '{"type": "3", "value": "0"}'},
        ];
        jqGridConfig.tableInit(tbID, def, 'pager');
    }
    function initBottomTable() {
        let def = [
            {propName: '序号', colName: 'ID', propType: 4, readOnly: 1, visible: 0, width: 100},
            {propName: '应用', colName: 'AppID', propType: 4, readOnly: 1, visible: 0, width: 100, defaultValue: '{"type": "3", "value": "' + 3 + '"}'},
            {propName: 'IP', colName: 'IP', propType: 4, readOnly: 1, visible: 0, width: 100, defaultValue: '{"type": "3", "value": "' + 4 + '"}'},
            {propName: '端口', colName: 'Port', propType: 4, readOnly: 1, visible: 0, width: 100, defaultValue: '{"type": "3", "value": "' + 4 + '"}'},
            {propName: '三遥订阅', colName: 'TableName', propType: 5, readOnly: 1, visible: 1, width: 100, foreignKey: '{"type": "3","sql": "select F_NAME,F_V from omc_vxd_cst where F_CLASS = ' + '\'' + 'SUBS' + '\'' + '"}'},
            {propName: '起始点号', colName: 'StartID', propType: 4, readOnly: 0, visible: 1, width: 100, defaultValue: '{"type": "3", "value": "0"}'},
            {propName: '结束点号', colName: 'EndID', propType: 4, readOnly: 0, visible: 1, width: 100, defaultValue: '{"type": "3", "value": "0"}'},
        ];
        jqGridConfig.tableInit(tbIDChild, def, 'pager_child');
    }
    function loadTop() {
        let sql = 'select ID,AppID,IP,Port,TableName,StartID,EndID from omc_rtsubscribe';
        jqGridExtend.countNum(sql, '', 'omc_rtsubscribe', '', 20, 'data_record_count_span');
        jqGridExtend.paging(tbID, sql, '', 'omc_rtsubscribe', '', '', 20, 'pager');
        jqGridExtend.pageBtn(tbID, sql, 'omc_rtsubscribe', '', 20, 'pager', 'data_record_count_span');
    }
    function loadBottom() {
        let sql = 'select ID,AppID,IP,Port,TableName,StartID,EndID from omc_rtsubscribe';
        jqGridExtend.countNum(sql, '', 'omc_rtsubscribe', '', 20, 'data_record_count_span');
        jqGridExtend.paging(tbIDChild, sql, '', 'omc_rtsubscribe', '', '', 20, 'pager_child');
        jqGridExtend.pageBtn(tbIDChild, sql, 'omc_rtsubscribe', '', 20, 'pager_child', 'data_record_count_span');
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
