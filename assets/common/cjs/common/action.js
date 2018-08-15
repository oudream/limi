/**
 * Created by nielei on 2017/11/20.
 */

'use strict';

let comAction = {

};
define(['jquery', 'async', 'exportCSV', 'cjcommon', 'cjdatabaseaccess', 'cjajax', 'cache', 'utils', 'jqGridExtension', 'modal'], function($, async) {
    let doc = window.top.$(window.top.document);
    comAction.register = function(data, tbID, tbName, def, g, copyData) {
        let route = data.action;
        let nameSpaces = route.split('.');
        let name = '';
        if (nameSpaces.length === 1) {
            name = nameSpaces[0];
        } else {
            name = nameSpaces[1];
        }
        switch (name) {
        case 'delAction': delAction(tbID, tbName, def);
            break;
        case 'killProcess': killProcess(tbID, tbName, def);
            break;
        case 'saveAction': saveAction(tbID, tbName, def, copyData);
            break;
        case 'addAction':addAction(def, tbName, data.assistAction, data.getModelData, data.reload, data.para, g);
            break;
        case 'saveObjAction': saveObjAction(data, tbID, tbName, def, g);
            break;
        case 'modalAction':modalAction(g, data, tbID);
            break;
        case 'exportCsvAction':exportToCsv(tbID);
            break;
        case 'upAction':upAction(tbID, tbName, data);
            break;
        case 'downAction':downAction(tbID, tbName, data);
            break;
        case 'foreMostAction':foremostAction(tbID, tbName, data);
            break;
        case 'uploadAction':uploadAction(g, data);
            break;
        case 'menuAction':menuAction();
            break;
        }
    };
    comAction.queryAction = function(id, timeType) {
        let data = getFormData(id);
        let sql = '';
        let time;
        for (let i = 0; i < data.length; i++) {
            if (data[i].value !== '') {
                for (let j = i + 1; j < data.length; j++) {
                    if (data[j].value !== '') {
                        if ($.trim(data[i].name) === 'StartTime') {
                            if (timeType === 'utc') {
                                time = utils.time.locale2Utc(data[i].value);
                            } else {
                                time = data[i].value;
                            }
                            sql = sql + 'F_T > ' + '\'' + time + '\'' + ' and ';
                        } else if ($.trim(data[i].name) === 'EndTime') {
                            if (timeType === 'utc') {
                                time = utils.time.locale2Utc(data[i].value);
                            } else {
                                time = data[i].value;
                            }
                            sql = sql + 'F_T < ' + '\'' + time + '\'' + ' and ';
                        } else {
                            sql = sql + data[i].name + ' = ' + '\'' + data[i].value + '\'' + ' and ';
                        }
                        break;
                    }
                    if (j === data.length - 1) {
                        if (data[j].value === '') {
                            if ($.trim(data[i].name) === 'StartTime') {
                                if (timeType === 'utc') {
                                    time = utils.time.locale2Utc(data[i].value);
                                } else {
                                    time = data[i].value;
                                }
                                sql = sql + 'F_T > ' + '\'' + time + '\'';
                            } else if ($.trim(data[i].name) === 'EndTime') {
                                if (timeType === 'utc') {
                                    time = utils.time.locale2Utc(data[i].value);
                                } else {
                                    time = data[i].value;
                                }
                                sql = sql + 'F_T < ' + '\'' + time + '\'';
                            } else {
                                sql = sql + data[i].name + ' = ' + '\'' + data[i].value + '\'';
                            }
                        }
                    }
                }
                if (i === data.length - 1) {
                    if ($.trim(data[i].name) === 'StartTime') {
                        if (timeType === 'utc') {
                            time = utils.time.locale2Utc(data[i].value);
                        } else {
                            time = data[i].value;
                        }
                        sql = sql + 'F_T > ' + '\'' + time + '\'';
                    } else if ($.trim(data[i].name) === 'EndTime') {
                        if (timeType === 'utc') {
                            time = utils.time.locale2Utc(data[i].value);
                        } else {
                            time = data[i].value;
                        }
                        sql = sql + 'F_T < ' + '\'' + time + '\'';
                    } else {
                        sql = sql + data[i].name + ' = ' + '\'' + data[i].value + '\'';
                    }
                }
            }
        }
        return sql;
    };

    /**
     * 删除表格数据操作
     * @param tbID : num 单表id
     * @param tableName : string 数据库表名
     * @param def : obj 表定义表中配置
     */
    function delAction(tbID, tableName, def) {
        let propConfGrid = tbID;
        let colName = [];
        let propName = [];
        let deleteData = [];
        let selectedId = propConfGrid.jqGrid('getGridParam', 'selrow');
        let log = '删除:';
        tbID.jqGrid('saveRow', selectedId);
        let col = 'ID';
        let del = propConfGrid.jqGrid('getCell', selectedId, col);
        let data = propConfGrid.jqGrid('getRowData', selectedId);
        for (let j = 1; j < def.length; j++) {
            colName.push(def[j].colName);
            propName.push(def[j].propName);
        }
        for (let i = 0; i < colName.length; i++) {
            deleteData.push(data[colName[i]]);
            log = log + propName[i] + ':' + deleteData[i] + ',';
        }
        propConfGrid.jqGrid('delRowData', selectedId);

        let deleteSql = 'DELETE FROM ' + tableName + ' WHERE ID = ' + '\'' + del + '\'';
        if (window.confirm('确认删除？')) {
            executeSql(deleteSql, log);
        }
    }

    /**
     * 结束数据库进程操作
     * @param tbID : num 单表id
     * @param tableName : string 数据库表名
     * @param def : obj 表定义表中配置
     */
    function killProcess(tbID, tableName, def) {
        let propConfGrid = tbID;
        let aID = [];
        let deleteSql = '';
        let records = propConfGrid.jqGrid('getRowData');
        for (let i = 0; i < records.length; i++) {
            if (records[i].isCheck === '1') {
                aID.push(records[i].Id);
            }
        }
        for (let i = 0; i < aID.length; i++) {
            deleteSql = deleteSql + 'kill ' + aID[i] + ';';
        }
        // console.log(deleteSql);
        if (window.confirm('确认结束进程？')) {
            executeSql(deleteSql);
        }
    }

    /**
     * 保存表格操作
     * @param tbId : num 单表id
     * @param def : obj 表定义表中配置
     * @param tableName : string 数据库表名
     * @param copyData : obj 表格更改前数据
     */
    function saveAction(tbId, tableName, def, copyData) {
        let propConfGrid = tbId;
        let selectedId = propConfGrid.jqGrid('getGridParam', 'selrow');
        propConfGrid.jqGrid('saveRow', selectedId);
        let updateSql = '';
        let insertSql = '';
        let log = '';
        let colName = [];
        let propName = [];
        let sql;
        let maxId;
        let id = [];
        let data = getJQAllData(tbId);
        // 获取最大ID
        for (let i = 0; i < data.length; i++) {
            id.push(Number(data[i].ID));
        }
        for (let j = 1; j < def.length; j++) {
            colName.push(def[j].colName);
            propName.push(def[j].propName);
        }
        maxId = Math.max(...id) + 1;
        for (let len = 0; len < data.length; len++) {
            if (data[len].newTag === 'new') {
                let arr = data[len];
                let insData = [];
                let ins = '';
                log = log + '新增：';
                if (checkLimit(arr, def, copyData, len)) {
                    for (let i = 0; i < colName.length; i++) {
                        insData.push(arr[colName[i]]);
                        if (i < colName.length - 1) {
                            if (insData[i] === '') {
                                ins = ins + null + ',';
                            } else {
                                ins = ins + '\'' + insData[i] + '\'' + ',';
                            }
                        }
                        if (i === colName.length - 1) {
                            ins = ins + '\'' + insData[i] + '\'';
                        }
                        log = log + propName[i] + ':' + insData[i] + ',';
                    }

                    insertSql = insertSql + 'insert into ' + tableName + '(' + 'ID,' + colName + ')' +
                        ' values' + '(' + maxId + ',' + ins + ')' + ';';
                }
                maxId = maxId + 1;
            } else if (data[len].oldTag === 'old') {
                let arr = data[len];
                let copyArr = copyData[len];
                let upID = data[len].ID;
                // let copyArr = copyData[len]
                let upDate = [];
                let upD = '';
                log = log + '更新：';
                if (checkChange(arr, copyArr, colName)) {
                    if (checkLimit(arr, def, copyData, len)) {
                        for (let i = 0; i < colName.length; i++) {
                            upDate.push(arr[colName[i]]);
                            if (i < colName.length - 1) {
                                if (upDate[i] === '') {
                                    upD = upD + colName[i] + '=' + null + ',';
                                } else {
                                    upD = upD + colName[i] + '=' + '\'' + upDate[i] + '\'' + ',';
                                }
                            }
                            if (i === colName.length - 1) {
                                upD = upD + colName[i] + '=' + '\'' + upDate[i] + '\'';
                            }
                            log = log + propName[i] + ':' + upDate[i] + ',';
                        }

                        updateSql = updateSql + 'update ' + tableName + ' set ' + upD +
                            ' where ID = ' + upID + ';';
                    }
                }
            }
        }
        sql = insertSql + updateSql;
        // alert(sql)
        executeSql(sql, log);
    }

    /**
     * 添加操作(未使用json文件配置)
     * @param def : obj 表定义表中配置
     * @param tableName : string 数据库表名
     * @param action : string action名
     * @param g : obj 全局对象
     */
    function addAction(def, tableName, action, getModelData, reload, para, g) {
        let obj = {};
        obj.defConfig = def;
        obj.action = action;
        obj.reload = reload;
        obj.para = para;
        obj.getModelData = getModelData;
        let config = JSON.stringify(obj);
        sessionStorage.setItem('addConfig', config);
        sessionStorage.setItem('tbName', tableName);
        let u = 'common/chtml/template/single/add-single-obj.html';

        g.iframe({
            title: '新增',
            ajaxWindow: false,
            show: true,
            // backdrop: true,
            type: 'iframe', // iframe / html / alert / confirm
            width: 1200,
            height: 400,
            footerButtonAlign: 'right',
            url: g.url(u),
        });
    }

    /**
     * 保存单对象操作
     * @param formID : num 单对象form的id
     * @param tbName : string 数据库名
     * @param def : obj 表定义表中配置
     */
    function saveObjAction(cfg, formID, tbName, def, g) {
        let data = getFormData(formID);
        let insData = [];
        let insCol = [];
        let propName = [];
        let ins = '';
        let insertSql = '';
        for (let i = 0; i < data.length; i++) {
            insCol.push(data[i].name);
            if (def[i].textType) {
                if (def[i].textType === 'utcTime') {
                    insData.push(utils.time.locale2Utc(data[i].value));
                } else {
                    insData.push(data[i].value);
                }
            } else {
                insData.push(data[i].value);
            }
            propName.push(def[i].propName);
            let arr = data[i];
            if (checkObjLimit(arr, def)) {
                if (i < data.length - 1) {
                    if (insData[i] === '') {
                        ins = ins + null + ',';
                    } else {
                        ins = ins + '\'' + insData[i] + '\'' + ',';
                    }
                }
                if (i === data.length - 1) {
                    ins = ins + '\'' + insData[i] + '\'';
                }
            } else {
                return;
            }
        }
        insertSql = insertSql + 'insert into ' + tbName + '(' + insCol + ')' +
            ' values' + '(' + ins + ')' + ';';
        if (cfg.ModelData) {
            let getSql = cfg.ModelData.sql;
            async.auto({
                a: function(callBack) {
                    loadSql(getSql, function(v) {
                        callBack(null, v);
                    });
                },
                b: ['a', function(value, callBack) {
                    let str = $.trim(getSql.substring(getSql.indexOf('t') + 1, getSql.indexOf('f'))); // 截取select 和 from 之间的字符串
                    let arr = str.split(',');
                    let aSrc = cfg.ModelData.extraData.src || [];
                    let aDes = cfg.ModelData.extraData.des || [];
                    let insSql = '';
                    for (let i = 0; i < value.a.length; i++) {
                        let val = '';
                        insSql = insSql + 'insert into ' + cfg.ModelData.targetTB + ' (' + aDes + ',' + arr + ') values (';
                        for (let k = 0; k < aSrc.length; k++) {
                            for (let n = 0; n < data.length; n++) {
                                if (aSrc[k] === data[n].name) {
                                    val = val + '\'' + data[n].value + '\'' + ',';
                                    break;
                                }
                            }
                        }
                        for (let j = 0; j < arr.length; j++) {
                            if (j === arr.length - 1) {
                                val = val + '\'' + value.a[i][arr[j]] + '\'';
                            } else {
                                val = val + '\'' + value.a[i][arr[j]] + '\',';
                            }
                        }
                        insSql = insSql + val + ');';
                    }

                    insertSql = insertSql + insSql;
                    $('.modal', window.parent.document).hide();
                    $('.modal-backdrop', window.parent.document).remove();
                    executeSql(insertSql);
                    $('#box_content iframe', window.parent.document).last()[0].src = $('#box_content iframe', window.parent.document).last()[0].src;
                }],
            }, function(error, value) {
            });
        } else {
            $('.modal', window.parent.document).hide();
            $('.modal-backdrop', window.parent.document).remove();
            executeSql(insertSql, g, cfg);
            // $('#box_content iframe', window.parent.document).last()[0].src = $('#box_content iframe', window.parent.document).last()[0].src
        }
    }

    /**
     * 弹框操作
     * @param g : string 全局对象
     * @param data : obj json配置文件数据
     * @param tbID : num 单表id
     */
    function modalAction(g, data, tbID) {
        let config = data.modal;
        let arr = config[0].url;
        let arrs = [];
        arrs = arr.split('?');
        if (config[0].filter !== undefined) {
            let filter = config[0].filter;
            let selectedId = tbID.jqGrid('getGridParam', 'selrow');
            tbID.jqGrid('saveRow', selectedId);
            let sel = tbID.jqGrid('getCell', selectedId, filter);
            if (sel === undefined) {
                alert('请选择一行数据！');
                return;
            }
            arrs[1] = arrs[1] + '!' + filter + ' = ' + '\'' + sel + '\'';
        }
        sessionStorage.setItem('tbName', arrs[1]);
        g.iframe({
            title: config[0].title,
            ajaxWindow: false,
            show: true,
            // backdrop: true,
            type: 'iframe', // iframe / html / alert / confirm
            width: 1200,
            height: 400,
            footerButtonAlign: 'right',
            url: g.url(arr),
        });
    }

    /**
     * 导出csv操作(暂不支持)
     * @param tbID : num 单表id
     */
    function exportToCsv(tbID) {
        // tbID.jqGrid('exportToCsv', {
        //     separator: ',',
        //     separatorReplace: '', // in order to interpret numbers
        //     quote: '"',
        //     escquote: '"',
        //     newLine: '\r\n', // navigator.userAgent.match(/Windows/) ?	'\r\n' : '\n';
        //     replaceNewLine: ' ',
        //     includeCaption: true,
        //     includeLabels: true,
        //     includeGroupHeader: true,
        //     includeFooter: true,
        //     fileName: 'jqGridExport.csv',
        //     returnAsString: false,
        // });
        tbID.tableExport({
            filename: 'table',
            format: 'csv',
        });
    }

    /**
     * 上移操作
     * @param tbID : num 单表id
     * @param tbName : string 数据库名
     * @param limit : obj 调整限值
     */
    function upAction(tbID, tbName, limit) {
        let log = '';
        let selectedId = tbID.jqGrid('getGridParam', 'selrow');
        tbID.jqGrid('saveRow', selectedId);
        let ids = tbID.jqGrid('getDataIDs');
        let rowIDs = [];
        let maxRowId;
        let data = tbID.jqGrid('getRowData');
        let adjust = limit.adjustLimit;
        if (adjust !== undefined) {
            let arrs = adjust.split('=');
            for (let i = 0; i < data.length; i++) {
                if (data[i][arrs[0]] !== arrs[1]) {
                    if (selectedId === ids[i]) {
                        window.alert('该行不能移动！');
                        return;
                    }
                    rowIDs.push(ids[i]);
                }
            }
            maxRowId = Math.max(...rowIDs) + 1;
        }
        let $tr = $('.select');
        if ($tr.index() !== maxRowId) {
            $tr.fadeOut().fadeIn();
            $tr.prev().before($tr);
            let id = [];
            let maxId;
            for (let i = 0; i < data.length; i++) {
                id.push(Number(data[i].ID));
            }
            let currRowData = tbID.jqGrid('getRowData', selectedId);
            let prevRowData = tbID.jqGrid('getRowData', selectedId - 1);
            let currId = currRowData.ID;
            if (currId === undefined) {
                alert('请选择一行数据！');
                return;
            }
            let prevId = prevRowData.ID;
            // 获取最大ID
            maxId = -1;
            log = '上移车号:' + currRowData.F_CHEHAO;
            let sql = 'update ' + '`' + tbName + '`' + ' set ID = ' + maxId + ' where ID = ' + prevId + ';' +
                'update ' + '`' + tbName + '`' + ' set ID = ' + prevId + ' where ID = ' + currId + ';' +
                'update ' + '`' + tbName + '`' + ' set ID = ' + currId + ' where ID = ' + maxId + ';';
            executeSql(sql, log);
        }
    }

    /**
     * 下移操作
     * @param tbID : num 单表id
     * @param tbName : string 数据库名
     * @param limit : obj 调整限值
     */
    function downAction(tbID, tbName, limit) {
        let log;
        let selectedId = tbID.jqGrid('getGridParam', 'selrow');
        tbID.jqGrid('saveRow', selectedId);
        let ids = tbID.jqGrid('getDataIDs');
        let data = tbID.jqGrid('getRowData');
        let adjust = limit.adjustLimit;
        if (adjust !== undefined) {
            let arrs = adjust.split('=');
            for (let i = 0; i < data.length; i++) {
                if (data[i][arrs[0]] !== arrs[1]) {
                    if (selectedId === ids[i]) {
                        window.alert('该行不能移动！');
                        return;
                    }
                }
            }
        }
        let $down = $('.ui-row-ltr');
        let len = $down.length;
        let $tr = $('.select');
        if ($tr.index() !== len) {
            $tr.fadeOut().fadeIn();
            $tr.next().after($tr);

            let id = [];
            let maxId;
            let data = tbID.jqGrid('getRowData');
            for (let i = 0; i < data.length; i++) {
                id.push(Number(data[i].ID));
            }
            let currRowData = tbID.jqGrid('getRowData', selectedId);
            let nextRowData = tbID.jqGrid('getRowData', Number(selectedId) + 1);
            let currId = currRowData.ID;
            if (currId === undefined) {
                alert('请选择一行数据！');
                return;
            }
            let nextId = nextRowData.ID;
            // 获取最大ID
            maxId = -1;
            log = '下移车号:' + currRowData.F_CHEHAO;
            let sql = 'update ' + '`' + tbName + '`' + ' set ID = ' + maxId + ' where ID = ' + nextId + ';' +
                'update ' + '`' + tbName + '`' + ' set ID = ' + nextId + ' where ID = ' + currId + ';' +
                'update ' + '`' + tbName + '`' + ' set ID = ' + currId + ' where ID = ' + maxId + ';';
            executeSql(sql, log);
        }
    }

    /**
     * 置顶操作
     * @param tbID : num 单表id
     * @param tbName : string 数据库名
     * @param limit : obj 调整限值
     */
    function foremostAction(tbID, tbName, limit) {
        let log = '';
        let selectedId = tbID.jqGrid('getGridParam', 'selrow');
        tbID.jqGrid('saveRow', selectedId);
        let ids = tbID.jqGrid('getDataIDs');
        let sql;
        let rowIDs = [];
        let maxRowId;
        let data = tbID.jqGrid('getRowData');
        let adjust = limit.adjustLimit;
        if (adjust !== undefined) {
            let arrs = adjust.split('=');
            for (let i = 0; i < data.length; i++) {
                if (data[i][arrs[0]] !== arrs[1]) {
                    rowIDs.push(ids[i]);
                }
            }
            if (rowIDs.length === 0) {
                let $tr = $('.select');
                $tr.fadeOut().fadeIn();
                $('.jqgfirstrow').after($tr);
                let id = [];
                let maxId;
                // let data = tbID.jqGrid('getRowData')
                for (let i = 0; i < data.length; i++) {
                    id.push(Number(data[i].ID));
                }
                let currRowData = tbID.jqGrid('getRowData', selectedId);
                let currId = currRowData.ID;
                if (currId === undefined) {
                    alert('请选择一行数据！');
                    return;
                }
                log = '置顶车号:' + currRowData.F_CHEHAO;
                // 获取最大ID
                maxId = -1;
                sql = 'update ' + '`' + tbName + '`' + ' set ID = ' + maxId + ' where ID = ' + currId + ';';
                for (let i = 0; i < currId - 1; i++) {
                    sql = sql + 'update ' + '`' + tbName + '`' + ' set ID = ' + (currId - i) + ' where ID = ' + (currId - i - 1) + ';';
                }
                sql = sql + 'update ' + '`' + tbName + '`' + ' set ID = ' + 1 + ' where ID = ' + maxId + ';';
            } else {
                maxRowId = Math.max(...rowIDs);
                let $tr = $('.select');
                $tr.fadeOut().fadeIn();
                $('#' + maxRowId).after($tr);
                let id = [];
                let maxId;
                for (let i = 0; i < data.length; i++) {
                    id.push(Number(data[i].ID));
                }
                let currRowData = tbID.jqGrid('getRowData', selectedId);
                let foremostRowData = tbID.jqGrid('getRowData', maxRowId + 1);
                let currId = currRowData.ID;
                let foremostId = foremostRowData.ID;
                if (currId === undefined) {
                    alert('请选择一行数据！');
                    return;
                }
                log = '置顶车号:' + currRowData.F_CHEHAO;
                // 获取最大ID
                maxId = -1;
                sql = 'update ' + '`' + tbName + '`' + ' set ID = ' + maxId + ' where ID = ' + currId + ';';
                for (let i = 0; i < currId - foremostId; i++) {
                    sql = sql + 'update ' + '`' + tbName + '`' + ' set ID = ' + (currId - i) + ' where ID = ' + (currId - i - 1) + ';';
                }
                sql = sql + 'update ' + '`' + tbName + '`' + ' set ID = ' + foremostId + ' where ID = ' + maxId + ';';
            }
        } else {
            let $tr = $('.select');
            $tr.fadeOut().fadeIn();
            $('.jqgfirstrow').after($tr);
            let id = [];
            let maxId;
            // let data = tbID.jqGrid('getRowData')
            for (let i = 0; i < data.length; i++) {
                id.push(Number(data[i].ID));
            }
            let currRowData = tbID.jqGrid('getRowData', selectedId);
            let currId = currRowData.ID;
            if (currId === undefined) {
                alert('请选择一行数据！');
                return;
            }
            log = '置顶车号:' + currRowData.F_CHEHAO;
            // 获取最大ID
            maxId = -1;
            sql = 'update ' + '`' + tbName + '`' + ' set ID = ' + maxId + ' where ID = ' + currId + ';';
            for (let i = 0; i < currId - 1; i++) {
                sql = sql + 'update ' + '`' + tbName + '`' + ' set ID = ' + (currId - i) + ' where ID = ' + (currId - i - 1) + ';';
            }
            sql = sql + 'update ' + '`' + tbName + '`' + ' set ID = ' + 1 + ' where ID = ' + maxId + ';';
        }
        // alert(sql)
        executeSql(sql, log);
    }

    function uploadAction(g, data) {
        let targetDB = data.targetDB;
        sessionStorage.setItem('targetDB', targetDB);
        let u = 'common/chtml/template/upload/upload.html';
        g.iframe({
            title: '上传',
            ajaxWindow: false,
            show: true,
            // backdrop: true,
            type: 'iframe', // iframe / html / alert / confirm
            width: 680,
            height: 200,
            footerButtonAlign: 'right',
            url: g.url(u),
        });
    }

    function menuAction() {
        let mask = new modal.CreateModal();
        if ($('#modal-mask').length) {
            mask.maskCancel();
            $('#content #menu').toggle();
        } else {
            mask.maskInit(200);
            $('#content #menu').toggle();
        }
        $('#modal-mask').click(function() {
            mask.maskCancel();
            $('#content #menu').toggle();
        });
    }

    /* 获取表中所有数据 */
    function getJQAllData(tbID) {
        let o = tbID;
        // 获取当前显示的数据
        // let allData = o.jqGrid('getRowData')
        let rowNum = o.jqGrid('getGridParam', 'rowNum'); // 获取显示配置记录数量
        let total = o.jqGrid('getGridParam', 'records'); // 获取查询得到的总记录数量
        // 设置rowNum为总记录数量并且刷新jqGrid，使所有记录现出来调用getRowData方法才能获取到所有数据
        o.jqGrid('setGridParam', {rowNum: total, page: 1}).trigger('reloadGrid');
        let rows = o.jqGrid('getRowData');  // 此时获取表格所有匹配的
        o.jqGrid('setGridParam', {rowNum: rowNum}).trigger('reloadGrid'); // 还原原来显示的记录数量
        return rows;
    }
    // *获取form数据 */
    function getFormData(id) {
        return $('#' + id).serializeArray();
    }

    function checkChange(arr, copyData, colName) {
        let flag = false;
        for (let i = 0; i < colName.length; i++) {
            if (arr[colName[i]] !== copyData[colName[i]]) {
                flag = true;
            }
        }
        return flag;
    }

    function checkLimit(arr, def, copyData, rowID) {
        let flag = true;
        for (let i = 0; i < def.length; i++) {
            if (def[i].required === 0) {
                if (arr[def[i].colName] === '') {
                    window.alert(def[i].propName + '不能为空！');
                    flag = false;
                    return flag;
                }
            }
            if (def[i].unique === 1) {
                for (let j = 0; j < copyData.length; j++) {
                    if (j !== rowID) {
                        if (arr[def[i].colName] === copyData[j][def[i].colName]) {
                            window.alert(def[i].propName + '不能重复！');
                            flag = false;
                            return flag;
                        }
                    }
                }
            }
        }
        return flag;
    }

    function checkObjLimit(arr, def) {
        let flag = true;
        for (let i = 0; i < def.length; i++) {
            if (def[i].colName === arr.name) {
                if (def[i].required === 0) {
                    if (arr.value === '') {
                        window.alert(def[i].propName + '不能为空！');
                        flag = false;
                        return flag;
                    }
                    if (def[i].unique === 0) {

                    }
                }
            }
        }
        return flag;
    }

    function executeSql(sql, g, reload) {
        let db = window.top.cjDb;
        let serverInfo = cacheOpt.get('server-config');
        let reqHost = serverInfo['server']['ipAddress'];
        let reqPort = serverInfo['server']['httpPort'];
        let reqParam = {
            reqHost: reqHost,
            reqPort: reqPort,
        };
        db.loadT(sql, function fn(err, vals) {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    g.alert('数据重复，请重新添加');
                }
                console.log(err);
            } else {
                if (reload) {
                    switch (reload.reload) {
                    case 'YX': doc.trigger('reload-yx');
                        break;
                    case 'YC': doc.trigger('reload-yc');
                        break;
                    case 'YW': doc.trigger('reload-yw');
                        break;
                    case 'SUBS': doc.trigger('reload-subs');
                        break;
                    case 'dev_props': doc.trigger('reload-dev_props');
                        break;
                    default:
                        break;
                    }
                } else {
                    window.location.reload();
                }
            }
        }, reqParam);
    }

    function loadSql(sql, callBack) {
        let db = window.top.cjDb;
        let serverInfo = cacheOpt.get('server-config');
        let reqHost = serverInfo['server']['ipAddress'];
        let reqPort = serverInfo['server']['httpPort'];
        let reqParam = {
            reqHost: reqHost,
            reqPort: reqPort,
        };
        db.load(sql, function(e, v) {
            callBack(v);
        }, reqParam);
    }
});
