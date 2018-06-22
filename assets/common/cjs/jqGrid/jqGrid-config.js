/**
 * Created by nielei on 2017/11/14.
 */
'use strict';

let jqGridConfig = {

};
define(['jquery', 'cjcommon', 'cjdatabaseaccess', 'cjajax', 'cache', 'utils'], function($) {
    /**
     * 初始化单表
     * @param tbID : num 单表 id
     * @param def : array 列定义
     * @param pager : string 分页id
     * @param obj : obj 加载子表相关配置 (可选)
     * @param selFunc : obj 点击行相关操作 (可选)
     */
    jqGridConfig.tableInit = function(tbID, def, pager, obj, selFunc) {
        let lastsel;
        let aSelect = [];
        let aValue = [];
        let aName = [];
        let oSelect = {};
        let colNames = ['newTag', 'oldTag', 'rowID'];
        let colModels = ['newTag', 'oldTag', 'rowID'];
        let colModel = [
        {name: 'newTag', hidden: true},
        {name: 'oldTag', hidden: true},
        {name: 'rowID', hidden: true},
        ];
        for (let j = 0; j < def.length; j++) {
            colNames.push(def[j].propName);
            colModels.push(def[j].colName);
        }
        if (tbID.jqGrid) {
            tbID.jqGrid('clearGridData', false);
        }

    // tbID.GridUnload()

        for (let i = 0; i < def.length; i++) {
            let type;
            let hidden;
            let editable;
            let _model;
            if (def[i].colName === 'ID') {
                editable = false;
            }
            if (def[i].readOnly === 1) {
                editable = false;
            } else if (def[i].readOnly === 2) {
                editable = false;
            } else {
                editable = true;
            }
            if (def[i].visible === 0) {
                hidden = true;
            } else if (def[i].visible === 2) {
                hidden = true;
            } else {
                hidden = false;
            }
            if (def[i].propType === 5) {
                type = 'select';
                let localValue = def[i].valueScopes;
                let exteriorValue = def[i].foreignKey;
                if (localValue !== '' && localValue !== null && localValue !== undefined) {
                    aSelect = localValue.split(',');
                    if (aSelect[0] === '1') {
                        for (let n = 0; n < aSelect.length - 1; n++) {
                            oSelect[n] = aSelect[n + 1];
                        }
                    } else {
                        for (let n = 0; n < aSelect.length; n++) {
                            oSelect[n + 1] = aSelect[n];
                        }
                    }
                    aValue.push(oSelect);
                    aName.push(def[i].colName);
                    aSelect = [];
                    oSelect = {};
                } else {
                    let obj = {};
                    if (typeof (exteriorValue) === 'string') {
                        obj = JSON.parse(exteriorValue);
                    } else {
                        obj = exteriorValue;
                    }
                    let sName = def[i].colName;
                    if (obj.type === '1') {

                    } else if (obj.type === '2') {
                        let sql = obj.sql;
                        executeSql(sql, sName, tbID);
                    } else if (obj.type === '3') {
                        let sql = obj.sql;
                        executeSql1(sql, sName, tbID);
                    }
                }
            } else if (def[i].propType === 6) {
                type = 'select';
                let localValue = def[i].valueScopes;
                let exteriorValue = def[i].foreignKey;
                if (localValue !== '' && localValue !== null && localValue !== undefined) {
                    aSelect = localValue.split(',');
                    for (let n = 0; n < aSelect.length; n++) {
                        oSelect[aSelect[n]] = aSelect[n];
                    }
                    aValue.push(oSelect);
                    aName.push(def[i].colName);
                    aSelect = [];
                    oSelect = {};
                } else {
                    let obj = JSON.parse(exteriorValue);
                    let sName = def[i].colName;
                    if (obj.type === '1') {

                    } else if (obj.type === '2') {
                        let sql = obj.sql;
                        executeSql(sql, sName, tbID);
                    }
                }
            } else if (def[i].propType === 7) {
                type = 'select';
                let storage = def[i].valueScopes;
                let sType = storage.split(',');
                let value;
                if (sType[0] === '0') {
                    value = JSON.parse(localStorage.getItem(sType[1]));
                } else {
                    value = JSON.parse(sessionStorage.getItem(sType[1]));
                }
                if (typeof value === 'object') {
                    oSelect = value[def[i].colName];
                }
                aValue.push(oSelect);
                aName.push(def[i].colName);
                aSelect = [];
                oSelect = {};
            } else if (def[i].propType === 10) {
                type = 'select';
                let localValue = def[i].valueScopes;
                let valueObj = utils.dataProcess.kvStrToObj(localValue);

                aName.push(def[i].colName);
                aValue.push(valueObj);

                aSelect = [];
                oSelect = {};
            } else {
                type = 'text';
            }

            if (def[i].width === 0) {
                _model = {
                    name: colModels[i + 3],
                    editable: editable,
                    edittype: type,
                    hidden: hidden,
                    sortable: false,
                    align: def[i].align || 'center',
                };
            } else {
                _model = {
                    name: colModels[i + 3],
                    editable: editable,
                    edittype: type,
                    hidden: hidden,
                    width: def[i].width,
                    sortable: false,
                    align: def[i].align || 'center',
                };
            }
            colModel.push(_model);
        }
// console.log(colModel)
        tbID.jqGrid({
            datatype: 'local',
            // data: data,
            width: 'auto',
            height: 'auto',
            autowidth: true,
            rownumbers: true, // 序号
            shrinkToFit: true,
            colNames: colNames,
            colModel: colModel,
            pager: '#' + pager,
      // rowList: [5, 10, 20],
            // multiPageSelection: true,
            rowNum: 20,
            sortname: 'id',
            // mtype : "get",
            viewrecords: true,
            // onSelectRow: editRow,
            pginput: false,
            sortorder: 'desc',
            multiselect: false,
            loadonce: false,
            cellsubmit: 'clientArray',
            // jsonReader: {
            //     repeatitems: false,
            //     root: "rows",
            //     page: "page",
            //     total: "total",
            //     records: "records"
            // },
            onSelectRow: function(id) {
                $('#' + id).addClass('select');
                $('#' + id).siblings().removeClass('select');
                if (id && id !== lastsel) {
                    tbID.jqGrid('saveRow', lastsel);
                    tbID.jqGrid('editRow', id, true);
                    lastsel = id;
                }
                let oldRow = {};
                oldRow.oldTag = 'old';
                tbID.jqGrid('setRowData', id, oldRow);

                if (obj) {
                    let selectedId = tbID.jqGrid('getGridParam', 'selrow');
                    tbID.jqGrid('saveRow', selectedId);
                    let col = obj.connection;
                    let sel = tbID.jqGrid('getCell', selectedId, col);
                    obj.loadTBDataChild(sel);
                }

                if (selFunc) {
                    selFunc.selFunc(id);
                }
            },
            onPaging: function(pgButton) {
                $(document).trigger('jqGrid_gird_' + pager, [pgButton]);
            },
        });
        for (let i = 0; i < aName.length; i++) {
            tbID.jqGrid('setColProp', aName[i],
                {
                    editoptions: {value: aValue[i]},
                    formatter: 'select',
                });
        }
    };

    /**
     * 初始化分组单表
     * @param tbID : num 单表 id
     * @param def : array 列定义
     * @param pager : string 分页id
     * @param obj : obj 加载分组相关配置
     * @param selFunc : obj 点击行相关操作 (可选)
     */
    jqGridConfig.groupTableInit = function(tbID, def, pager, obj, selFunc) {
        let lastsel;
        let aSelect = [];
        let aValue = [];
        let aName = [];
        let oSelect = {};
        let colNames = ['newTag', 'oldTag', 'rowID'];
        let colModels = ['newTag', 'oldTag', 'rowID'];
        let colModel = [
        {name: 'newTag', hidden: true},
        {name: 'oldTag', hidden: true},
        {name: 'rowID', hidden: true},
        ];
        for (let j = 0; j < def.length; j++) {
            colNames.push(def[j].propName);
            colModels.push(def[j].colName);
        }
        if (tbID.jqGrid) {
            tbID.jqGrid('clearGridData', false);
        }

    // tbID.GridUnload()

        for (let i = 0; i < def.length; i++) {
            let type;
            let hidden;
            let editable;
            let _model;
            if (def[i].colName === 'ID') {
                editable = false;
            }
            if (def[i].readOnly === 1) {
                editable = false;
            } else if (def[i].readOnly === 2) {
                editable = false;
            } else {
                editable = true;
            }
            if (def[i].visible === 0) {
                hidden = true;
            } else {
                hidden = false;
            }
            if (def[i].propType === 5) {
                type = 'select';
                let localValue = def[i].valueScopes;
                let exteriorValue = def[i].foreignKey;
                if (localValue !== '' && localValue !== null && localValue !== undefined) {
                    aSelect = localValue.split(',');
                    if (aSelect[0] === '1') {
                        for (let n = 0; n < aSelect.length - 1; n++) {
                            oSelect[n] = aSelect[n + 1];
                        }
                    } else {
                        for (let n = 0; n < aSelect.length; n++) {
                            oSelect[n + 1] = aSelect[n];
                        }
                    }
                    aValue.push(oSelect);
                    aName.push(def[i].colName);
                    aSelect = [];
                    oSelect = {};
                } else {
                    let obj = JSON.parse(exteriorValue);
                    let sName = def[i].colName;
                    if (obj.type === '1') {

                    } else if (obj.type === '2') {
                        let sql = obj.sql;
                        executeSql(sql, sName, tbID);
                    } else if (obj.type === '3') {
                        let sql = obj.sql;
                        executeSql1(sql, sName, tbID);
                    }
                }
            } else if (def[i].propType === 6) {
                type = 'select';
                let localValue = def[i].valueScopes;
                let exteriorValue = def[i].foreignKey;
                if (localValue !== '' && localValue !== null && localValue !== undefined) {
                    aSelect = localValue.split(',');
                    for (let n = 0; n < aSelect.length; n++) {
                        oSelect[aSelect[n]] = aSelect[n];
                    }
                    aValue.push(oSelect);
                    aName.push(def[i].colName);
                    aSelect = [];
                    oSelect = {};
                } else {
                    let obj = JSON.parse(exteriorValue);
                    let sName = def[i].colName;
                    if (obj.type === '1') {

                    } else if (obj.type === '2') {
                        let sql = obj.sql;
                        executeSql(sql, sName, tbID);
                    }
                }
            } else if (def[i].propType === 7) {
                type = 'select';
                let storage = def[i].valueScopes;
                let sType = storage.split(',');
                let value;
                if (sType[0] === '0') {
                    value = JSON.parse(localStorage.getItem(sType[1]));
                } else {
                    value = JSON.parse(sessionStorage.getItem(sType[1]));
                }
                if (typeof value === 'object') {
                    oSelect = value[def[i].colName];
                }
                aValue.push(oSelect);
                aName.push(def[i].colName);
                aSelect = [];
                oSelect = {};
            } else if (def[i].propType === 10) {
                type = 'select';
                let localValue = def[i].valueScopes;
                let valueObj = utils.dataProcess.kvStrToObj(localValue);

                aName.push(def[i].colName);
                aValue.push(valueObj);

                aSelect = [];
                oSelect = {};
            } else {
                type = 'text';
            }

            if (def[i].width === 0) {
                _model = {
                    name: colModels[i + 3],
                    editable: editable,
                    edittype: type,
                    hidden: hidden,
                    sortable: false,
                };
            } else {
                _model = {
                    name: colModels[i + 3],
                    editable: editable,
                    edittype: type,
                    hidden: hidden,
                    width: def[i].width,
                    sortable: false,
                };
            }
            colModel.push(_model);
        }
// console.log(colModel)
        tbID.jqGrid({
            datatype: 'local',
            // data: data,
            width: 'auto',
            height: 'auto',
            autowidth: true,
            rownumbers: true, // 序号
            shrinkToFit: true,
            colNames: colNames,
            colModel: colModel,
            pager: pager,
      // rowList: [5, 10, 20],
            // multiPageSelection: true,
            rowNum: 20,
            sortname: 'id',
            // mtype : "get",
            viewrecords: true,
            // onSelectRow: editRow,
            pginput: false,
            sortorder: 'desc',
            multiselect: false,
            loadonce: false,
            grouping: true,
            groupingView: {
                groupField: obj.groupField, // 分组属性
                groupColumnShow: obj.groupColumnShow, // 是否显示分组列
                groupText: ['<b>{0}:</b> {1} 条记录', '<b>{0}:</b> {1} 条记录', '<b>{0}:</b> {1} 条记录', '<b>{0}:</b> {1} 条记录'], // 表头显示数据(每组中包含的数据量)
                groupCollapse: true, // 加载数据时是否只显示分组的组信息
                groupSummary: obj.groupSummary, // 是否显示汇总  如果为true需要在colModel中进行配置summaryType:'max',summaryTpl:'<b>Max: {0}</b>'
                groupDataSorted: true, // 分组中的数据是否排序
                groupOrder: obj.groupOrder, // 分组后组的排列顺序
                showSummaryOnHide: false, // 是否在分组底部显示汇总信息并且当收起表格时是否隐藏下面的分组
            },
            // jsonReader: {
            //     repeatitems: false,
            //     root: "rows",
            //     page: "page",
            //     total: "total",
            //     records: "records"
            // },
            onSelectRow: function(id) {
                $('#' + id).addClass('select');
                $('#' + id).siblings().removeClass('select');
                if (id && id !== lastsel) {
                    tbID.jqGrid('saveRow', lastsel);
                    tbID.jqGrid('editRow', id, true);
                    lastsel = id;
                }
                let oldRow = {};
                oldRow.oldTag = 'old';
                tbID.jqGrid('setRowData', id, oldRow);
                if (selFunc) {
                    selFunc.selFunc();
                }
            },
            onPaging: function(pgButton) {
                $(document).trigger('jqGrid_gird_' + pager, [pgButton]);
            },
        });
        for (let i = 0; i < aName.length; i++) {
            tbID.jqGrid('setColProp', aName[i],
                {
                    editoptions: {value: aValue[i]},
                    formatter: 'select',
                });
        }
    };

    /**
     * 初始多选单表
     * @param tbID : num 单表 id
     * @param def : array 列定义
     * @param pager : string 分页id
     * @param obj : obj 加载子表相关配置 (可选)
     * @param selFunc : obj 点击行相关操作 (可选)
     */
    jqGridConfig.multiSelectTableInit = function(tbID, def, pager, obj, selFunc) {
        let lastsel;
        let aSelect = [];
        let aValue = [];
        let aName = [];
        let oSelect = {};
        let colNames = ['newTag', 'oldTag', 'isCheck', 'rowID'];
        let colModels = ['newTag', 'oldTag', 'isCheck', 'rowID'];
        let colModel = [
            {name: 'newTag', hidden: true},
            {name: 'oldTag', hidden: true},
            {name: 'isCheck', hidden: true},
            {name: 'rowID', hidden: true},
        ];
        for (let j = 0; j < def.length; j++) {
            colNames.push(def[j].propName);
            colModels.push(def[j].colName);
        }
        if (tbID.jqGrid) {
            tbID.jqGrid('clearGridData', false);
        }

    // tbID.GridUnload()

        for (let i = 0; i < def.length; i++) {
            let type;
            let hidden;
            let editable;
            if (def[i].colName === 'ID') {
                editable = false;
            }
            if (def[i].readOnly === 1) {
                editable = false;
            } if (def[i].readOnly === 2) {
                editable = false;
            } else {
                editable = true;
            }
            if (def[i].visible === 0) {
                hidden = true;
            } else {
                hidden = false;
            }
            if (def[i].propType === 5) {
                type = 'select';
                let localValue = def[i].valueScopes;
                let exteriorValue = def[i].foreignKey;
                if (localValue !== '' && localValue !== null && localValue !== undefined) {
                    aSelect = localValue.split(',');
                    if (aSelect[0] === '1') {
                        for (let n = 0; n < aSelect.length - 1; n++) {
                            oSelect[n] = aSelect[n + 1];
                        }
                    } else {
                        for (let n = 0; n < aSelect.length; n++) {
                            oSelect[n + 1] = aSelect[n];
                        }
                    }
                    aValue.push(oSelect);
                    aName.push(def[i].colName);
                    aSelect = [];
                    oSelect = {};
                } else {
                    let obj = JSON.parse(exteriorValue);
                    let sName = def[i].colName;
                    if (obj.type === '1') {

                    } else if (obj.type === '2') {
                        let sql = obj.sql;
                        executeSql(sql, sName, tbID);
                    } else if (obj.type === '3') {
                        let sql = obj.sql;
                        executeSql1(sql, sName, tbID);
                    }
                }
            } else if (def[i].propType === 6) {
                type = 'select';
                let localValue = def[i].valueScopes;
                let exteriorValue = def[i].foreignKey;
                if (localValue !== '' && localValue !== null && localValue !== undefined) {
                    aSelect = localValue.split(',');
                    for (let n = 0; n < aSelect.length; n++) {
                        oSelect[aSelect[n]] = aSelect[n];
                    }
                    aValue.push(oSelect);
                    aName.push(def[i].colName);
                    aSelect = [];
                    oSelect = {};
                } else {
                    let obj = JSON.parse(exteriorValue);
                    let sName = def[i].colName;
                    if (obj.type === '1') {

                    } else if (obj.type === '2') {
                        let sql = obj.sql;
                        executeSql(sql, sName, tbID);
                    }
                }
            } else if (def[i].propType === 7) {
                type = 'select';
                let storage = def[i].valueScopes;
                let sType = storage.split(',');
                let value;
                if (sType[0] === '0') {
                    value = JSON.parse(localStorage.getItem(sType[1]));
                } else {
                    value = JSON.parse(sessionStorage.getItem(sType[1]));
                }
                if (typeof value === 'object') {
                    oSelect = value[def[i].colName];
                }
                aValue.push(oSelect);
                aName.push(def[i].colName);
                aSelect = [];
                oSelect = {};
            } else if (def[i].propType === 10) {
                type = 'select';
                let localValue = def[i].valueScopes;
                let valueObj = utils.dataProcess.kvStrToObj(localValue);

                aName.push(def[i].colName);
                aValue.push(valueObj);

                aSelect = [];
                oSelect = {};
            } else {
                type = 'text';
            }
            let _model = {
                name: colModels[i + 4],
                editable: editable,
                edittype: type,
                hidden: hidden,
                sortable: false,
            };
            colModel.push(_model);
        }

        tbID.jqGrid({
            datatype: 'local',
            // data: data,
            width: 'auto',
            height: 'auto',
            autowidth: true,
            rownumbers: true, // 序号
            shrinkToFit: true,
            colNames: colNames,
            colModel: colModel,
            pager: '#' + pager,
      // rowList: [5, 10, 20],
            // multiPageSelection: true,
            rowNum: 20,
            sortname: 'id',
            // mtype : "get",
            viewrecords: true,
            // onSelectRow: editRow,
            pginput: false,
            sortorder: 'desc',
            multiselect: true,
            loadonce: false,
            // jsonReader: {
            //     repeatitems: false,
            //     root: "rows",
            //     page: "page",
            //     total: "total",
            //     records: "records"
            // },
            onSelectRow: function(id) {
                $('#' + id).addClass('select');
                $('#' + id).siblings().removeClass('select');
                if (id && id !== lastsel) {
                    tbID.jqGrid('saveRow', lastsel);
                    tbID.jqGrid('editRow', id, true);
                    lastsel = id;
                }
                let oldRow = {};
                oldRow.oldTag = 'old';
                tbID.jqGrid('setRowData', id, oldRow);

                if (obj) {
                    let selectedId = tbID.jqGrid('getGridParam', 'selrow');
                    tbID.jqGrid('saveRow', selectedId);
                    let col = obj.connection;
                    let sel = tbID.jqGrid('getCell', selectedId, col);
                    obj.loadTBDataChild(sel);
                }
                if (selFunc) {
                    selFunc.selFunc();
                }
                selectRow(id, tbID);
            },
            onSelectAll: function(id) {
                selectAll(id, tbID);
            },
            onPaging: function(pgButton) {
                $(document).trigger('jqGrid_gird_' + pager, [pgButton]);
            },
        });
        for (let i = 0; i < aName.length; i++) {
            tbID.jqGrid('setColProp', aName[i],
                {
                    editoptions: {value: aValue[i]},
                    formatter: 'select',
                });
        }
    };

    function selectRow(rowId, tbId) {
        let table = tbId;
        tbId.jqGrid('saveRow', rowId);
        let checked = 0;
        let records = table.jqGrid('getRowData');
        for (let j = 0; j < records.length; j++) {
            if (records[j]['rowID'] === rowId) {
                let isCheck = records[j]['isCheck'];
                if (isCheck === '' || isCheck === '2') {
                    checked = 1;
                    table.jqGrid('setCell', rowId, 'isCheck', checked);
                } else {
                    checked = 2;
                    table.jqGrid('setCell', rowId, 'isCheck', checked);
                }
                records = table.jqGrid('getRowData');
                break;
            }
        }
    }

    function selectAll(rowId, tbId) {
        let table = tbId;
        let checked = 0;
        let records = table.jqGrid('getRowData');
        for (let j = 0; j < records.length; j++) {
            if (records[j]['rowID'] === rowId[j]) {
                let isCheck = records[j]['isCheck'];
                if (isCheck === '' || isCheck === '2') {
                    checked = 1;
                    table.jqGrid('setCell', rowId[j], 'isCheck', checked);
                } else {
                    checked = 2;
                    table.jqGrid('setCell', rowId[j], 'isCheck', checked);
                }
            }
        }
    }

    function executeSql(sql, sName, tbID) {
        let str = sql.substring(sql.indexOf('t') + 1, sql.indexOf('f')); // 截取select 和 from 之间的字符串
        let oSelect = {};
        let aValue = [];
        let db = window.top.cjDb;
        let serverInfo = cacheOpt.get('server-config');
        let reqHost = serverInfo['server']['ipAddress'];
        let reqPort = serverInfo['server']['httpPort'];
        let reqParam = {
            reqHost: reqHost,
            reqPort: reqPort,
        };
        db.load(sql, function fn(err, vals) {
            if (err) {
                console.log(err);
            } else {
                for (let i = 0; i < vals.length; i++) {
                    oSelect[vals[i][$.trim(str)]] = vals[i][$.trim(str)];
                }
                aValue.push(oSelect);
                tbID.jqGrid('setColProp', sName,
                    {
                        editoptions: {value: aValue[0]},
                        formatter: 'select',
                    });
            }
        }, reqParam);
    }

    function executeSql1(sql, sName, tbID) {
        let str = sql.substring(sql.indexOf('t') + 1, sql.indexOf('f')); // 截取select 和 from 之间的字符串
        let arr = str.split(',');
        let oSelect = {};
        let aValue = [];
        let db = window.top.cjDb;
        let serverInfo = cacheOpt.get('server-config');
        let reqHost = serverInfo['server']['ipAddress'];
        let reqPort = serverInfo['server']['httpPort'];
        let reqParam = {
            reqHost: reqHost,
            reqPort: reqPort,
        };
        db.load(sql, function fn(err, vals) {
            if (err) {
                console.log(err);
            } else {
                for (let i = 0; i < vals.length; i++) {
          // oSelect[parseInt(vals[i].value)] = vals[i].name
                    oSelect[vals[i][$.trim(arr[1])]] = vals[i][$.trim(arr[0])];
                }
                aValue.push(oSelect);
                tbID.jqGrid('setColProp', sName,
                    {
                        editoptions: {value: aValue[0]},
                        formatter: 'select',
                    });
            }
        }, reqParam);
    }
});
