/**
 * Created by liuchaoyu on 2017-03-07.
 */
'use strict';

class View {
    constructor(id, func) {
        this.id = id;
        this.func = func;
        this.data = [];
        this.type = 'view';
        this.update = null;
    }

    setV(which, value) {
        if (which == 'id') {
            console.log('\"id\" is can not be changed');
            return -1;
        }

        this[which] = value;

        return 1;
    }

    getV(which) {
        return this[which];
    }

    change() {
        let fn = this.update;
        if (fn) {
            fn(this.id, this.data);
        } else {
            console.log('\"fn\" is undefined');
        }
    }

    getData() {

    }

}

class TableView extends View {
    constructor(id, func) {
        let fn = null;
        if (func) {
            fn = func;
        } else {
            fn = tableViewUpdate;
        }

        super(id, fn);

        this.setV('data');
    }

    setV(which, value) {
        if (which == 'data' && value == undefined) {
            super.setV('data', this.getData());
        } else {
            super.setV(which, value);
        }
    }

    addRow(rowId, data, position) {
        let jqGridTable = $('#' + this.id);
        return jqGridTable.jqGrid('addRowData', rowId, data, position);
    }

    delRow(rowId) {
        let jqGridTable = $('#' + this.id);
        return jqGridTable.jqGrid('delRowData', rowId);
    }

    getData() {
        function dom(id) {
            return document.getElementById(id);
        }

        let table = dom(this.id);
        let rows = table.rows;
        let rowCount = rows.length;
        let startRow = 0;
        let dataArray = [];

        let thCount = $(table).find('th').length;
        if (thCount > 0) {
            startRow = 1;
        }

        for (let i = startRow; i < rowCount; i++) {
            let curRow = rows[i];
            let cellArray = [];

            let cells = curRow.cells;
            let cellCount = cells.length;
            for (let j = 0; j < cellCount; j++) {
                let curCell = cells[j];
                let val = '';

                let curInput = $(curCell).find('input');
                if (curInput) {
                    val = curInput.value;
                } else {
                    val = curCell.textContent;
                }

                cellArray.push(val);
            }

            dataArray.push(cellArray);
        }

        return dataArray;
    }

}

function tableViewUpdate(modelId, data) {
    let view = Controller.getView(modelId);

    function dom(id) {
        return document.getElementById(id);
    }

    let table = dom(view.id);

    let startRow = 0;
    let thCount = $(table).find('th').length;
    if (thCount > 0) {
        startRow = 1;
    }

    let tBody = $(table).children('tBody');
    tBody.remove();
    tBody = null;

    tBody = cjCommon.createElement('tBody', {}, $(table));

    for (let i = 0; i < data.length; i++) {
        let curRow = data[i];

        let tableRow = cjCommon.createElement('tr', {}, tBody);

        for (let j = 0; j < curRow.length; j++) {
            let cell = cjCommon.createElement('td', {}, tableRow);
            if (curRow[j] == null) {
                cell.text('');
            } else {
                cell.text(curRow[j]);
            }
        }
    }
}

class JqGridView extends TableView {
    constructor(id, func) {
        let fn = null;
        if (func) {
            fn = func;
        } else {
            fn = jqGridViewUpdate;
        }

        super(id, fn);

    // this.setV('data');
    }

    getData() {
        let jqGridTable = $('#' + this.id);
    // 获取当前显示的数据
    // var rows = jqGridTable.jqGrid('getRowData');
    // let selectedIds = jqGridTable.jqGrid("getGridParam", "selarrrow");
        let rowNum = jqGridTable.jqGrid('getGridParam', 'rowNum'); // 获取显示配置记录数量
        let total = jqGridTable.jqGrid('getGridParam', 'records'); // 获取查询得到的总记录数量
    // 设置rowNum为总记录数量并且刷新jqGrid，使所有记录现出来调用getRowData方法才能获取到所有数据
        jqGridTable.jqGrid('setGridParam', {rowNum: total}).trigger('reloadGrid');
        let rows = jqGridTable.jqGrid('getRowData');  // 此时获取表格所有匹配的
        let ids = jqGridTable.jqGrid('getDataIDs');  // 此时获取表格所有行号

        jqGridTable.jqGrid('setGridParam', {rowNum: rowNum}).trigger('reloadGrid'); // 还原原来显示的记录数量

    // for (let i = 0; i < ids.length; i++) {
    //     let isCheck = jqGridTable.jqGrid('getCell',ids[i],'checkConfirm');
    //     if (isCheck == 1) {
    //         jqGridTable.jqGrid('setSelection', ids[i], true);
    //     }
    // }
        return rows;
    }

    getCurrentPageData() {
        let jqGridTable = $('#' + this.id);
        let rows = jqGridTable.jqGrid('getRowData');  // 此时获取表格所有匹配的
        return rows;
    }

}

function jqGridViewUpdate(modelId, data) {
    let view = Controller.getView(modelId);

    let jqGridTable = $('#' + view.id);

    jqGridTable.jqGrid('clearGridData', false);

    if (data.length) {
        for (let i = 0; i < data.length; i++) {
            let _data = data[i];
            let _row = {};
            let cssProp = null;
            for (let t in _data) {
                if (t.indexOf('extend_') === -1) {
                    _row[t] = _data[t];
                } else if (t === 'extend_color') {
                    cssProp = {
                        'background': '#' + _data[t],
                    };
                }
            }

            if (_data.rowId) {
                jqGridTable.jqGrid('addRowData', _data.rowId, _row);
                jqGridTable.jqGrid('setRowData', _data.rowId, null, cssProp);
            } else {
                jqGridTable.jqGrid('addRowData', i + 1, _row);
                jqGridTable.jqGrid('setRowData', i + 1, null, cssProp);
            }
        }
    } else {
        jqGridTable[0].addJSONData(data);
    }
}
