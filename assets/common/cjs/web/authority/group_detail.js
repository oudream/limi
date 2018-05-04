/**
 * Created by nielei on 2017/10/26.
 */

'use strict';

define(['jquery', 'server', 'async', 'global', 'jqGrid', 'ztree', 'cjcommon', 'cjstorage', 'cjdatabaseaccess', 'cjajax', 'loadNode', 'structure', 'model', 'view', 'controller', 'utils', 'cache', 'jqGridExtension'], function($, server, async, g) {
    let gDb = null;
    let gReqParam = null;
    let tbList = $('#tbList');
    let mainColNames = [
        '序号', '账号', '用户名', '选中', '行号',
    ]; // newTag,OldTag为增加，修改标记，其余为表名

    let mainColModel = [
      {name: 'ID', hidden: true},
      {name: 'UserName', width: 100, editable: true},
      {name: 'Name', width: 100, editable: true},
      {name: 'isCheck', hidden: true},
      {name: 'rowID', hidden: true},
    ]; // newTag,OldTag为增加，修改标记，其余为数据库字段名，根据jqGrid文档配置相关属性

    let loadMainSql = 'SELECT ID,UserName,Name FROM omc_sys_User order by UserName;';

    let action = {
        init: function() {
            gDb = window.top.cjDb;
            let serverInfo = cacheOpt.get('server-config');
            let reqHost = serverInfo['server']['ipAddress'];
            let reqPort = serverInfo['server']['httpPort'];
            gReqParam = {
                reqHost: reqHost,
                reqPort: reqPort,
            };
            mainTableInit(tbList, mainColNames, mainColModel);
            uiResizeListener();
            loadTBData(loadMainSql, tbList);
            saveFunc();
        },
    };

    function mainTableInit(tbID, colNames, colModel) {
        $('#tbList').jqGrid({
            datatype: 'local', // 本地加载模式
            // data: data,
            width: 'auto',
            height: 'auto',
            autowidth: true,
            rownumbers: true, // 序号
            shrinkToFit: true,
            // caption: '用户组',
            colNames: colNames,
            colModel: colModel,
      // rowNum: 10,
            rowList: [5, 12, 24],
            pager: '#pager',
            pginput: false,
            pgbuttons: true,
            sortname: 'id',
            // loadonce: true,
            // mtype : "get",
            viewrecords: true,
            multiselect: true,
            sortorder: 'desc',
            onSelectRow: function(id) {
                $(document).trigger('jqGrid_selected_row', [id]);
            },
            onSelectAll: function(rowids, statue) {
                $(document).trigger('jqGrid_selected_all', [rowids]);
            // 函数里做自己的处理
            },
        });
    }

    function loadTBData(sql, tbID) {
        if ($('#tbList').jqGrid) {
            $('#tbList').jqGrid('clearGridData', false);
        }
        gDb.load(sql, function fn(err, vals) {
            if (err) {
                console.log(err);
                throw err;
            }

            let recordLength = vals.length;
            for (let i = 0; i <= recordLength; i++) {
                if (i < recordLength) {
                    let aGroup = vals[i];
                    $('#tbList').jqGrid('addRowData', i + 1, aGroup);
                    $('#tbList').jqGrid('setCell', i, 'rowID', i);
                }
                if (i === recordLength) {
                    $('#tbList').jqGrid('setCell', i, 'rowID', i);
                }
            }
        }, gReqParam);
    }

    function saveFunc() {
        $(document).on('jqGrid_selected_row', function(evt, rowId) {
            let table = $('#tbList');
            let checked = 0;
            let records = table.jqGrid('getRowData');
            for (let j = 0; j < records.length; j++) {
                if (records[j]['rowID'] === rowId) {
                    let isCheck = records[j]['isCheck'];
                    if (isCheck === '') {
                        checked = 1;
                        table.jqGrid('setCell', rowId, 'isCheck', checked);
                    } else {
                        checked = '';
                        table.jqGrid('setCell', rowId, 'isCheck', checked);
                    }
                    break;
                }
            }
        });

        $(document).on('jqGrid_selected_all', function(evt, rowId) {
            let table = $('#tbList');
            let checked = 0;
            let records = table.jqGrid('getRowData');
            for (let j = 0; j < records.length; j++) {
                if (records[j]['rowID'] === rowId[j]) {
                    let isCheck = records[j]['isCheck'];
                    if (isCheck === '') {
                        checked = 1;
                        table.jqGrid('setCell', rowId[j], 'isCheck', checked);
                    } else {
                        checked = '';
                        table.jqGrid('setCell', rowId[j], 'isCheck', checked);
                    }
                }
            }
        });
        let GID = sessionStorage.getItem('GID');
        let UNO = sessionStorage.getItem('UID');
        $('#save').click(function() {
            let Table = $('#tbList');
            let insertSql = '';
            let UID = [];
            let records = Table.jqGrid('getRowData');
            for (let i = 0; i < records.length; i++) {
                if (records[i].isCheck === '1') {
                    UID.push(records[i].ID);
                }
            }
            for (let j = 0; j < UID.length; j++) {
                for (let t = 0; t < UNO.length; t++) {
                    if (UID[j] === UNO[t]) {
                        break;
                    } else if (t === UNO.length - 1) {
                        insertSql = insertSql + 'insert into omc_sys_user_group (UID,GID) values(' + UID[j] + ',' + GID + ');';
                    }
                }
                if (UNO.length === 0) {
                    insertSql = insertSql + 'insert into omc_sys_user_group (UID,GID) values(' + UID[j] + ',' + GID + ');';
                }
            }
            gDb.loadT(insertSql, function(err, vals) {
                if (err) {
                    console.log(err);
                    alert('保存失败！');
                    document.location.reload();
                } else {
                    alert('添加成功！');
                    document.location.reload();
                }
            }, gReqParam);
        });
    }

    function uiResizeListener() {
        // let tableId = 'tbList'
        let gridBox = $('#tbList');
        gridBox.setGridWidth(450);
        gridBox.setGridHeight(250);
    }

    /**
     * 模块返回调用接口
     */
    return {
        beforeOnload: function() {
        },

        onload: function() {
            action.init();
        },
    };
});
