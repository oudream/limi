/**
 * Created by liuchaoyu on 2017-03-07.
 */
'use strict';

class Model {
    constructor(id, data, func) {
        this.id = id;
        this.data = data;
        this.func = func;
        this.type = 'model';
        this.update = null;
    }

    setV(which, value) {
        if (which == 'id') {
            console.log('\"id\" is not be changed');
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

  /** 加载数据到view */
    toView(data) {
        this.setV('data', data);
        this.change();
        this.setV('data', null);
    }

  /** 从view读取数据 */
    fromView(type) {
        let dataArray = null;
        let view = Controller.getView(this.id);
        if (type === undefined || type === 'all') {
            dataArray = view.getData();
        } else if (type === 'cur') {
            dataArray = view.getCurrentPageData();
        }

        return dataArray;
    }
}

class TableModel extends Model {
    constructor(id, data, func) {
        let fn = null;
        if (func) {
            fn = func;
        } else {
            fn = tableHandleFunc;
        }
        super(id, data, fn);
    }

    addRow(data, position) {
        if (!data || typeof data != 'object') {
            console.log('\'data\' is error!');
            return -1;
        }

        let pos = null;

        if (!position) {
            pos = 0;
        } else {
            pos = position;
        }

        if (typeof position != 'number') {
            console.log('\'position\' must be a number');
            return -2;
        }

        let orgData = super.fromView();

        let newDataArray = [];
        for (let i = 0; i < orgData; i++) {
            if (i === pos) {
                newDataArray.push(data);
            }
            newDataArray.push(orgData[i]);
        }

        this.toView(newDataArray);

        return 1;
    }
}

function tableHandleFunc(viewId, data) {
    let model = Controller.getModel(viewId);

    if (model) {
        model.setV('data', data);
    }
}

class JqGridModel extends TableModel {
    constructor(id, data, func) {
        super(id, data, func);
    }
}
