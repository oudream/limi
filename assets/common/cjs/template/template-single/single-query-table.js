/**
 * Created by nielei on 2017/11/16.
 */

'use strict';

define(['jquery', 'async', 'global', 'jqGrid', 'uix-date', 'jqGridConfig', 'panelConfig', 'action', 'comAction', 'cjcommon', 'cjstorage', 'cjdatabaseaccess', 'cjajax', 'loadNode', 'structure', 'model', 'view', 'controller', 'utils', 'cache', 'jqGridExtension'], function($, async, g) {
    let gDb = null;
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

    let gReqParam = null;
    let tbID = $('#tbList');
    let formID = 'query_form';
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
            queryCfg = data.queryPanel.items;
            for (let i = 0; i <queryCfg.length; i++) {
                if (queryCfg[i].name === 'F_T') {
                    timeType = queryCfg[i].timeType || 'str';
                }
            }
            multi = data.multi;
            def = data.def;
            if (data.operationPanel !== undefined) {
                operationData = data.operationPanel.items;
                if (operationData !== null) {
                    panelConfig.operationInit('operation', operationData);
                    btnBind(operationData);
                }
            }
            panelConfig.queryInit(formID, queryCfg);
            dateSet();
            if (data.loadSql !== undefined) {
                loadSql = data.loadSql;
                if (data.sort !== undefined) {
                    sort = data.sort;
                }
                if (data.group !== undefined) {
                    group = data.group;
                }
            }
            $('#queryBtn').click(function() {
                if (data.loadSql !== undefined) {
                    loadSql = data.loadSql;
                    if (data.sort !== undefined) {
                        sort = data.sort;
                    }
                    if (data.group !== undefined) {
                        group = data.group;
                    }
                }
                $(document).off('jqGrid_gird_pager');
                jqGridExtend.countNum(loadSql, comAction.queryAction(formID, timeType), tableName, group, 40, 'data_record_count_span');
                jqGridExtend.paging(tbID, loadSql, comAction.queryAction(formID, timeType), tableName, group, sort, 40, 'pager', def);
                jqGridExtend.pageBtn(tbID, loadSql, tableName, sort, 40, 'pager', 'data_record_count_span', def);
            });
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

    function dateSet() {
        $('#dtp_input1').uixDate({
            dateType: 'form_date', // form_datetime,form_date,form_time
            readonly: false,
            name: 'StartTime',
            hideRemove: true,
            changeDate: function() {
                $('#dtp_input2').uixDate('setStartDate', $('#dtp_input1').val());
              // $('#dtp_input2').uixDate('setDate', $('#dtp_input1').val())
            },
        });
        $('#dtp_input2').uixDate({
            dateType: 'form_date', // form_datetime,form_date,form_time
            readonly: false,
            name: 'EndTime',
            hideRemove: true,
        });
    }

    function loadPropertyDef(db, loadSql, filter) {
        if (multi) {
            jqGridConfig.multiSelectTableInit(tbID, def, '#pager');
        } else {
            jqGridConfig.tableInit(tbID, def, 'pager');
        }
        uiResizeListener();
        $(document).off('jqGrid_gird_pager')
        jqGridExtend.countNum(loadSql, filter, tableName, group, 40, 'data_record_count_span');
        jqGridExtend.paging(tbID, loadSql, filter, tableName, group, sort, 40, 'pager', def);
        jqGridExtend.pageBtn(tbID, loadSql, tableName, sort, 40, 'pager', 'data_record_count_span', def);
        // }, reqParam)
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
