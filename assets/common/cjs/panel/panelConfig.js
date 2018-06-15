/**
 * Created by nielei on 2017/11/16.
 */
let panelConfig = {

};

define(['jquery', 'cjcommon', 'cjdatabaseaccess', 'cjajax', 'cache', 'utils'], function($) {
    /**
     * 初始化查询面板
     * @param id : num 查询面板id
     * @param data : array 数组对象
     */
    panelConfig.queryInit = function(id, data) {
        let queryForm = document.getElementById(id);
        for (let i = 0; i < data.length; i++) {
            if (data[i].type === 'text') {
                let div = document.createElement('div');
                div.className = 'control-group';
                queryForm.appendChild(div);

                let label = document.createElement('label');
                label.className = 'control-label';
                label.innerHTML = data[i].labelName;
                // label.for = data[i].id
                div.appendChild(label);

                let div1 = document.createElement('div');
                div1.className = 'controls';
                div.appendChild(div1);

                let input = document.createElement('input');
                input.type = 'text';
                input.id = data[i].id;
                input.name = data[i].name;
                div1.appendChild(input);
            }

            if (data[i].type === 'select') {
                let div = document.createElement('div');
                div.className = 'control-group';
                queryForm.appendChild(div);

                let label = document.createElement('label');
                label.className = 'control-label';
                label.innerHTML = data[i].labelName;
                // label.for = data[i].id
                div.appendChild(label);

                let div1 = document.createElement('div');
                div1.className = 'controls';
                div.appendChild(div1);

                let select = document.createElement('select');
                select.id = data[i].id;
                select.name = data[i].name;
                div1.appendChild(select);

                if (data[i].data !== undefined) {
                    if (typeof data[i].data === 'object') {
                        if (data[i].local === '1') {
                            setSelectLocal2(data[i].data, data[i].id);
                        } else {
                            setSelectLocal(data[i].data, data[i].id);
                        }
                    } else {
                        setSelectSql(data[i].data, data[i].id);
                    }
                }
            }

            if (data[i].type === 'time') {
                let div = document.createElement('div');
                div.className = 'control-group';
                queryForm.appendChild(div);

                let label = document.createElement('label');
                label.className = 'control-label';
                label.innerHTML = data[i].labelName;
                // label.for = data[i].id
                div.appendChild(label);

                let div1 = document.createElement('div');
                div1.className = 'controls';
                div.appendChild(div1);

                let input = document.createElement('input');
                let input1 = document.createElement('input');
                input.type = 'hidden';
                input1.type = 'hidden';
                input.id = 'dtp_input1';
                input1.id = 'dtp_input2';
                div1.appendChild(input);
                div1.appendChild(input1);
            }
        }

        let div = document.createElement('div');
        div.className = 'control-group text-right';
        queryForm.appendChild(div);

        let input = document.createElement('input');
        let input1 = document.createElement('input');
        input.type = 'button';
        input1.type = 'reset';
        input.className = 'btn btn-success';
        input.style.marginRight = '15px';
        input1.className = 'btn btn-info';
        input.id = 'queryBtn';
        input.value = '查询';
        input1.value = '重置';
        div.appendChild(input);
        div.appendChild(input1);
    };

    /**
     * 初始化单对象面板
     * @param id : num 单对象面板id
     * @param data : array 数组对象 表定义表相关配置
     * @param tableName : str 数据库名
     */
    panelConfig.objInit = function(id, data, tableName) {
        let objForm = document.getElementById(id);
        let type;
        for (let i = 0; i < data.length; i++) {
            if (data[i].visible !== 0) {
                if (data[i].propType === 5) {
                    let div = document.createElement('div');
                    div.className = 'form-group';
                    objForm.appendChild(div);

                    let label = document.createElement('label');
                    label.className = 'control-label';
                    label.innerHTML = data[i].propName + '：';
                    // label.for = data[i].id
                    div.appendChild(label);

                    let select = document.createElement('select');
                    select.name = data[i].colName;
                    select.id = data[i].colName + '_select';
                    select.className = 'form-control';
                    div.appendChild(select);
                    let valueScopes = data[i].valueScopes;
                    if (valueScopes === '' || valueScopes === null || valueScopes === undefined) {
                        let foreignKey = data[i].foreignKey;
                        let obj = {};
                        if (typeof (foreignKey) === 'string') {
                            obj = JSON.parse(foreignKey);
                        } else {
                            obj = foreignKey;
                        }
                        setPanalSelectSql(obj.sql, select.id);
                    } else {
                        let aSelect = [];
                        let oSelect = {};
                        aSelect = valueScopes.split(',');
                        for (let n = 0; n < aSelect.length; n++) {
                            oSelect[n] = aSelect[n];
                        }
                        setSelectLocal1(oSelect, select.id);
                    }
                } else if (data[i].propType === 6) {
                    let div = document.createElement('div');
                    div.className = 'form-group';
                    objForm.appendChild(div);

                    let label = document.createElement('label');
                    label.className = 'control-label';
                    label.innerHTML = data[i].propName + '：';
                    // label.for = data[i].id
                    div.appendChild(label);

                    let select = document.createElement('select');
                    select.name = data[i].colName;
                    select.id = data[i].colName + '_select';
                    select.className = 'form-control';
                    div.appendChild(select);
                    let valueScopes = data[i].valueScopes;
                    if (valueScopes === '' || valueScopes === null || valueScopes === undefined) {
                        let foreignKey = data[i].foreignKey;
                        let obj = {};
                        if (typeof (foreignKey) === 'string') {
                            obj = JSON.parse(foreignKey);
                        } else {
                            obj = foreignKey;
                        }
                        setPanalSelectSql(obj.sql, select.id);
                    } else {
                        let aSelect = [];
                        let oSelect = {};
                        aSelect = valueScopes.split(',');
                        for (let n = 0; n < aSelect.length; n++) {
                            oSelect[n] = aSelect[n];
                        }
                        setSelectLocal(oSelect, select.id);
                    }
                } else if (data[i].propType === 7) {
                    type = 'radio';
                    let div = document.createElement('div');
                    div.className = 'form-group';
                    objForm.appendChild(div);

                    let label = document.createElement('label');
                    label.className = 'control-label';
                    label.innerHTML = data[i].propName + '：';
                    // label.for = data[i].id
                    div.appendChild(label);

                    let input = document.createElement('input');
                    let input1 = document.createElement('input');
                    input.name = data[i].colName;
                    input1.name = data[i].colName;
                    input.type = type;
                    input1.type = type;
                    input.id = data[i].colName + '_radio';
                    input1.id = data[i].colName + '_radio1';
                    input.className = 'form-control';
                    input1.className = 'form-control';
                    input.value = 1;
                    input1.value = 0;
                    input1.checked = true;
                    div.appendChild(input);
                    div.appendChild(input1);
                    input.insertAdjacentHTML('afterEnd', '是&nbsp;&nbsp;&nbsp;&nbsp;');
                    input1.insertAdjacentText('afterEnd', '否');
                } else if (data[i].propType === 8) {
                    let div = document.createElement('div');
                    div.className = 'form-group';
                    objForm.appendChild(div);

                    let label = document.createElement('label');
                    label.className = 'control-label';
                    label.innerHTML = data[i].propName + '：';
                    // label.for = data[i].id
                    div.appendChild(label);

                    let input = document.createElement('input');
                    input.name = data[i].colName;
                    input.type = 'text';
                    let eleID = data[i].colName + '_input';
                    input.id = data[i].colName + '_input';
                    input.className = 'form-control';
                    div.appendChild(input);

                    let div1 = document.createElement('div');
                    div1.className = 'fuzzyDiv';
                    div.appendChild(div1);

                    if (data[i].foreignKey !== '' && data[i].foreignKey !== undefined) {
                        tableName = data[i].foreignKey;
                    }

                    fuzzyQuery(eleID, data[i].colName, tableName);
                } else if (data[i].propType === 9) {
                    type = 'radio';
                    let div = document.createElement('div');
                    div.className = 'form-group';
                    objForm.appendChild(div);

                    let label = document.createElement('label');
                    label.className = 'control-label';
                    label.innerHTML = data[i].propName + '：';
                    // label.for = data[i].id
                    div.appendChild(label);
                    let foreignKey = data[i].foreignKey;
                    let obj = {};
                    if (typeof (foreignKey) === 'string') {
                        obj = JSON.parse(foreignKey);
                    } else {
                        obj = foreignKey;
                    }
                    let sql = obj.sql;
                    let db = window.top.cjDb;
                    let serverInfo = cacheOpt.get('server-config');
                    let reqHost = serverInfo['server']['ipAddress'];
                    let reqPort = serverInfo['server']['httpPort'];
                    let reqParam = {
                        reqHost: reqHost,
                        reqPort: reqPort,
                    };

                    db.load(sql, function fn(e, v) {
                        for (let k = 0; k < v.length; k++) {
                            let input = document.createElement('input');
                            input.name = 'radio';
                            input.type = type;
                            input.id = 'my_radio' + k;
                            input.className = 'form-control';
                            input.value = v[k].value;
                            div.appendChild(input);
                            input.insertAdjacentHTML('afterEnd', v[k].name + '&nbsp;&nbsp;&nbsp;&nbsp;');
                        }
                        let defaultValue = data[i].defaultValue;
                        let obj1 = {};
                        if (typeof (defaultValue) === 'string') {
                            obj1 = JSON.parse(defaultValue);
                        } else {
                            obj1 = defaultValue;
                        }
                        let sql1 = obj1.sql;
                        db.load(sql1, function fn(err, vals) {
                            if (err) {
                                console.log(err);
                            } else {
                                $('#my_radio' + vals[0].value).attr('checked', true);
                            }
                        }, reqParam);
                    }, reqParam);
                } else if (data[i].propType === 10) {
                    let div = document.createElement('div');
                    div.className = 'form-group';
                    objForm.appendChild(div);

                    let label = document.createElement('label');
                    label.className = 'control-label';
                    label.innerHTML = data[i].propName + '：';
                    // label.for = data[i].id
                    div.appendChild(label);

                    let select = document.createElement('select');
                    select.name = data[i].colName;
                    select.id = data[i].colName + '_select';
                    select.className = 'form-control';
                    div.appendChild(select);
                    let valueScopes = data[i].valueScopes;
                    let valueObj = utils.dataProcess.kvStrToObj(valueScopes);
                    setSelectLocal3(valueObj, select.id);
                } else if (data[i].propType === 11) {
                    let div = document.createElement('div');
                    div.className = 'form-group';
                    objForm.appendChild(div);

                    let label = document.createElement('label');
                    label.className = 'control-label';
                    label.innerHTML = data[i].propName + '：';
                    // label.for = data[i].id
                    div.appendChild(label);

                    let select = document.createElement('select');
                    select.name = data[i].colName;
                    select.id = data[i].colName + '_select';
                    select.className = 'form-control';
                    div.appendChild(select);
                    let valueScopes = data[i].valueScopes;
                    let valueObj = utils.dataProcess.kvStrToObj(valueScopes);
                    let foreignKey = data[i].foreignKey;
                    let obj = {};
                    if (typeof (foreignKey) === 'string') {
                        obj = JSON.parse(foreignKey);
                    } else {
                        obj = foreignKey;
                    }
                    setPanalSelectSql(obj.sql, select.id, valueObj);
                } else {
                    if (data[i].textType === 'time' || data[i].textType === 'utcTime') {
                        let div = document.createElement('div');
                        div.className = 'form-group';
                        objForm.appendChild(div);

                        let label = document.createElement('label');
                        label.className = 'control-label';
                        label.innerHTML = data[i].propName;
                        div.appendChild(label);
                        let input = document.createElement('input');
                        input.className = 'form-control';
                        input.type = 'hidden';
                        input.id = 'dtp_input_' + data[i].colName;
                        div.appendChild(input);
                    } else {
                        let div = document.createElement('div');
                        div.className = 'form-group';
                        objForm.appendChild(div);

                        let label = document.createElement('label');
                        label.className = 'control-label';
                        label.innerHTML = data[i].propName + '：';
                        // label.for = data[i].id
                        div.appendChild(label);

                        let input = document.createElement('input');
                        input.name = data[i].colName;
                        input.type = 'text';
                        input.id = data[i].colName + '_input';
                        input.className = 'form-control';

                        //  设置只读
                        if (data[i].readOnly === 1) {
                            input.readOnly = true;
                        }
                        // 设置默认值
                        if (data[i].defaultValue !== '' && data[i].defaultValue !== null && data[i].defaultValue !== undefined) {
                            let defaultValue = data[i].defaultValue;
                            let obj = {};
                            if (typeof (defaultValue) === 'string') {
                                obj = JSON.parse(defaultValue);
                            } else {
                                obj = defaultValue;
                            }
                            let dateTime = utils.time.getDateTime();
                            let code;
                            let maxNum;
                            let date = utils.time.getDate('none');
                            if (obj.type === '0') {
                                let arr = obj.value.split('+');
                                let sql = 'select ' + data[i].colName + ' from ' + tableName + ' order by ID asc';
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
                                        let maxDbNum;
                                        if (vals.length === 0) {
                                            maxDbNum = 0;
                                        } else {
                                            maxDbNum = vals[vals.length - 1];
                                            maxDbNum = maxDbNum[data[i].colName].substr(maxDbNum[data[i].colName].length - Number(arr[1]));
                                        }
                                        maxNum = Number(maxDbNum) + 1;
                                        if (maxNum.toString().length !== Number(arr[1])) {
                                            let len = Number(arr[1]) - maxNum.toString().length;
                                            for (let k = 0; k < len; k++) {
                                                maxNum = '0' + maxNum;
                                            }
                                        }
                                        if (obj.rule === '1') {
                                            code = arr[0] + maxNum;
                                        }
                                        if (obj.rule === '2') {
                                            code = arr[0] + date + maxNum;
                                        }
                                        input.value = code;
                                    }
                                }, reqParam);
                            }
                            if (obj.type === '1') {
                                input.value = dateTime;
                            }
                            // 默认值为操作人员
                            if (obj.type === '2') {
                                input.value = sessionStorage.getItem('s_user');
                            }
                            // 默认值为表定义表默认值
                            if (obj.type === '3') {
                                input.value = obj.value;
                            }
                            if (obj.type === '4') {
                                let sql = obj.sql;
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
                                        input.value = vals[0].value;
                                    }
                                }, reqParam);
                            }
                            if (obj.type === '5') {
                                let sql = obj.sql;
                                let relyCol = obj.relyCol;
                                let col = data[i].colName;
                                setTextValue(sql, relyCol, col);
                            }
                        }

                        // 设置正则表达式
                        div.appendChild(input);
                        if (data[i].regularExpression !== '' && data[i].regularExpression !== null && data[i].regularExpression !== undefined) {
                            $('#' + data[i].colName + '_input').attr('onkeyup', 'value=value.replace(' + data[i].regularExpression + 'g,' + '\'' + '\'' + ')');
                        }
                    }
                }
            } else {
                let input = document.createElement('input');
                input.name = data[i].colName;
                input.type = 'hidden';
                input.id = data[i].colName + '_input';
                input.className = 'form-control';
                // 设置默认值
                if (data[i].defaultValue !== '' && data[i].defaultValue !== null && data[i].defaultValue !== undefined) {
                    let defaultValue = data[i].defaultValue;
                    let obj = {}
                    if (typeof (defaultValue) === 'string') {
                        obj = JSON.parse(defaultValue);
                    } else {
                        obj = defaultValue;
                    }
                    let dateTime = utils.time.getDateTime();
                    let code;
                    let maxNum;
                    let date = utils.time.getDate('none');
                    if (obj.type === '0') {
                        let arr = obj.value.split('+');
                        let sql = 'select ' + data[i].colName + ' from ' + tableName + ' order by ID asc';
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
                                let maxDbNum;
                                if (vals.length === 0) {
                                    maxDbNum = 0;
                                } else {
                                    maxDbNum = vals[vals.length - 1];
                                    maxDbNum = maxDbNum[data[i].colName].substr(maxDbNum[data[i].colName].length - Number(arr[1]));
                                }
                                maxNum = Number(maxDbNum) + 1;
                                if (maxNum.toString().length !== Number(arr[1])) {
                                    let len = Number(arr[1]) - maxNum.toString().length;
                                    for (let k = 0; k < len; k++) {
                                        maxNum = '0' + maxNum;
                                    }
                                }
                                if (obj.rule === '1') {
                                    code = arr[0] + maxNum;
                                }
                                if (obj.rule === '2') {
                                    code = arr[0] + date + maxNum;
                                }
                                input.value = code;
                            }
                        }, reqParam);
                    }
                    if (obj.type === '1') {
                        input.value = dateTime;
                    }
                    // 默认值为操作人员
                    if (obj.type === '2') {
                        input.value = sessionStorage.getItem('s_user');
                    }
                    // 默认值为表定义表默认值
                    if (obj.type === '3') {
                        input.value = obj.value;
                    }
                    if (obj.type === '4') {
                        let sql = obj.sql;
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
                                input.value = vals[0].value;
                            }
                        }, reqParam);
                    }
                    if (obj.type === '5') {
                        let sql = obj.sql;
                        let relyCol = obj.relyCol;
                        let col = data[i].colName;
                        setTextValue(sql, relyCol, col);
                    }
                    objForm.appendChild(input);
                }
            }
        }
    };

    /**
     * 初始化操作面板
     * @param id : num 操作面板id
     * @param data : array 数组对象，存放对应操作按钮的id和中文名
     * @param uDC : string 自定义class名
     */
    panelConfig.operationInit = function(id, data, uDC) {
        let toolBar = document.getElementById(id);
        for (let j = 0; j < data.length; j++) {
            let span = document.createElement('span');
            span.id = data[j].id;
            if (uDC !== '' || uDC !== null || uDC !== undefined) {
                span.className = 'l' + ' ' + uDC;
            } else {
                span.className = 'l';
            }
            span.innerHTML = data[j].name;
            toolBar.appendChild(span);
            let i = document.createElement('i');
            i.className = 'icon-th icon-pic ' + data[j].id;
            span.appendChild(i);
        }
    };
    panelConfig.operationChildInit = function(id, data, uDC) {
        let toolBar = document.getElementById(id);
        for (let j = 0; j < data.length; j++) {
            let span = document.createElement('span');
            span.id = data[j].id;
            if (uDC !== '' || uDC !== null || uDC !== undefined) {
                span.className = 'l' + ' ' + uDC;
            } else {
                span.className = 'l';
            }
            span.innerHTML = data[j].name;
            toolBar.appendChild(span);
            let i = document.createElement('i');
            i.className = 'icon-th icon-pic ' + data[j].id;
            span.appendChild(i);
        }
    };

    function setSelectLocal(data, id) {
        cjCommon.createElement('option', {'value': '', 'textContent': '全部'}, $('#' + id));
        for (let t in data) {
            cjCommon.createElement('option', {'value': data[t], 'textContent': data[t]}, $('#' + id));
        }
    }

    function setSelectLocal1(data, id) {
        cjCommon.createElement('option', {'value': '', 'textContent': '全部'}, $('#' + id));
        for (let t in data) {
            cjCommon.createElement('option', {'value': parseInt(t) + 1, 'textContent': data[t]}, $('#' + id));
        }
    }

    function setSelectLocal2(data, id) {
        cjCommon.createElement('option', {'value': '', 'textContent': '全部'}, $('#' + id));
        for (let t in data) {
            cjCommon.createElement('option', {'value': t, 'textContent': data[t]}, $('#' + id));
        }
    }
    function setSelectLocal3(data, id) {
        cjCommon.createElement('option', {'value': '', 'textContent': ''}, $('#' + id));
        for (let t in data) {
            cjCommon.createElement('option', {'value': t, 'textContent': data[t]}, $('#' + id));
        }
    }

    function setSelectSql(data, id) {
        let db = window.top.cjDb;
        let str = data.substring(data.indexOf('t') + 1, data.indexOf('f')); // 截取select 和 from 之间的字符串
        let arr = str.split(',');
        let serverInfo = cacheOpt.get('server-config');
        let reqHost = serverInfo['server']['ipAddress'];
        let reqPort = serverInfo['server']['httpPort'];
        let reqParam = {
            reqHost: reqHost,
            reqPort: reqPort,
        };
        db.load(data, function fn(err, vals) {
            if (err) {
                console.log(err);
            } else {
                if (arr[1] !== undefined) {
                    cjCommon.createElement('option', {'value': '', 'textContent': '全部'}, $('#' + id));
                    for (let i = 0; i < vals.length; i++) {
                        cjCommon.createElement('option', {'value': vals[i][$.trim(arr[1])], 'textContent': vals[i][$.trim(arr[0])]}, $('#' + id));
                    }
                } else {
                    cjCommon.createElement('option', {'value': '', 'textContent': '全部'}, $('#' + id));
                    for (let i = 0; i < vals.length; i++) {
                        cjCommon.createElement('option', {'value': vals[i][$.trim(str)], 'textContent': vals[i][$.trim(str)]}, $('#' + id));
                    }
                }
            }
        }, reqParam);
    }

    function setPanalSelectSql(data, id, obj) {
        let db = window.top.cjDb;
        let str = data.substring(data.indexOf('t') + 1, data.indexOf('f')); // 截取select 和 from 之间的字符串
        let arr = str.split(',');
        let serverInfo = cacheOpt.get('server-config');
        let reqHost = serverInfo['server']['ipAddress'];
        let reqPort = serverInfo['server']['httpPort'];
        let reqParam = {
            reqHost: reqHost,
            reqPort: reqPort,
        };
        db.load(data, function fn(err, vals) {
            if (err) {
                console.log(err);
            } else {
                if (obj) {
                    cjCommon.createElement('option', {'value': '', 'textContent': ''}, $('#' + id));
                    for (let i = 0; i < vals.length; i++) {
                        cjCommon.createElement('option', {'value': vals[i][$.trim(arr[1])], 'textContent': vals[i][$.trim(arr[0])]}, $('#' + id));
                    }
                    for (let t in obj) {
                        cjCommon.createElement('option', {'value': t, 'textContent': obj[t]}, $('#' + id));
                    }
                } else if (arr[1] !== undefined) {
                    cjCommon.createElement('option', {'value': '', 'textContent': ''}, $('#' + id));
                    for (let i = 0; i < vals.length; i++) {
                        cjCommon.createElement('option', {'value': vals[i][$.trim(arr[1])], 'textContent': vals[i][$.trim(arr[0])]}, $('#' + id));
                    }
                } else {
                    cjCommon.createElement('option', {'value': '', 'textContent': ''}, $('#' + id));
                    for (let i = 0; i < vals.length; i++) {
                        cjCommon.createElement('option', {'value': vals[i][$.trim(str)], 'textContent': vals[i][$.trim(str)]}, $('#' + id));
                    }
                }
            }
        }, reqParam);
    }

    function fuzzyQuery(id, data, tableName) {
        $('.fuzzyDiv').css({
            'display': 'none',
            'background-color': 'white',
            'width': $('#' + id).width(),
            'position': 'absolute',
            'border': '1px solid #cccccc',
            'left': '130px',
        });
        $('#' + id).click(function() {
            $('.fuzzyDiv').css('display', 'block');
        });
        $('#' + id).keyup(function() {
            let db = window.top.cjDb;
            let serverInfo = cacheOpt.get('server-config');
            let reqHost = serverInfo['server']['ipAddress'];
            let reqPort = serverInfo['server']['httpPort'];
            let reqParam = {
                reqHost: reqHost,
                reqPort: reqPort,
            };
            let li = '';
            let sql = 'select ' + data + ' from ' + tableName + ' where ' + data + ' like ' + '\'' + '%' + $('#' + id).val() + '%' + '\'' + 'limit 0,5';
            db.load(sql, function fn(e, v) {
                if (e) {
                    console.log(e);
                } else {
                    $('.fuzzyDiv').empty();
                    for (let i = 0; i < v.length; i++) {
                        li = li + '<li class="fuzzyLi">' + v[i][data] + '</li>';
                    }
                    $('.fuzzyDiv').append(li);
                    $('.fuzzyLi').hover(function() {
                        $(this).click(function() {
                            let val = $(this).text();
                            $('#' + id).val(val);
                            $('.fuzzyDiv').css('display', 'none');
                            let sql1 = 'select * from ti_web_zsh_register where F_CHEHAO = ' + '\'' + $('#F_CHEHAO_input').val() + '\'' + ';';
                            db.load(sql1, function fn(e, vals) {
                                if (vals.length > 0) {
                                    $('#F_FDJXH_input').val(vals[0].F_FDJXH);
                                    $('#F_WUZHI_select').val(vals[0].F_WUZHI);
                                    $('#F_GHDW_select').val(vals[0].F_GHDW);
                                    $('#F_CHANDI_input').val(vals[0].F_CHANDI);
                                    $('#F_YSDW_select').val(vals[0].F_YSDW);
                                    $('#F_TEL_input').val(vals[0].F_TEL);
                                }
                            }, reqParam);
                        });
                    }, function() {
                    });
                    li = '';
                }
            }, reqParam);
        });
    }

    // 根据下拉框值设置文本值
    function setTextValue(sql, relyCol, col) {
        let db = window.top.cjDb;
        let serverInfo = cacheOpt.get('server-config');
        let reqHost = serverInfo['server']['ipAddress'];
        let reqPort = serverInfo['server']['httpPort'];
        let reqParam = {
            reqHost: reqHost,
            reqPort: reqPort,
        };
        $('#' + relyCol + '_select').change(function() {
            let v = $('#' + relyCol + '_select').val();
            let _sql = sql + '\'' + v + '\'';
            let str = sql.substring(sql.indexOf('t') + 1, sql.indexOf('f'));
            db.load(_sql, function fn(e, v) {
                $('#' + col + '_input').val(v[0][$.trim(str)]);
            }, reqParam);
        });
    }
});
