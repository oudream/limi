/**
 * Created by liuchaoyu on 2016-03-07.
 */


let cjSetting = {
    version: '1.0.0',
};

let settingRequest = {
    version: '1.0.0',
};

// 配置项的类
let ServiceItemClass = {
    createNew: function(id, modelId, name, label, itemType, menu, value, defaultValue, configUrl) {
        let serviceItem = {};
        serviceItem.id = id;
        serviceItem.modelId = modelId;
        serviceItem.name = name;
        serviceItem.label = label;
        serviceItem.itemType = itemType;
        serviceItem.menu = menu;
        serviceItem.value = value;
        serviceItem.defaultValue = defaultValue;
        serviceItem.configUrl = configUrl;

        return serviceItem;
    },
};

// 配置数据的类
let ServiceItemDataClass = {
    createNew: function(id, modelId, value, defaultValue, configUrl) {
        let serviceItem = {};
        serviceItem.id = id;
        serviceItem.modelId = modelId;
        serviceItem.value = value;
        serviceItem.defaultValue = defaultValue;
        serviceItem.configUrl = configUrl;

        return serviceItem;
    },
};

// 用户类
let UserItemClass = {
    createNew: function(userName, password, priv) {
        let obj = {};
        obj.userName = userName;
        obj.passwd = password;
        obj.priv = priv;

        return obj;
    },
};

cjSetting.allSaveButtonId = [];


// 从数据库中获取数据，动态生成页面内容
cjSetting.displayContent = function(sUrl) {
    // cjTempStorage.clearByKey("currentServiceUrl");
    // cjTempStorage.clearByKey("dataDeleteArray");
    cjTempStorage.clearAll();
    cjSetting.allSaveButtonId = [];

    let curUrl = '';

    if ( sUrl == '' ) {
        curUrl = cjCommon.getUrlParam('url');
    } else {
        curUrl = sUrl;
    }
    console.log('url=' + curUrl);

    // 先从数据库中获取相应服务子项
    let sqlCommand = 'select F_CONFIG_URL from ' + 'T_570_SERVICE_MODEL' + ' where F_ITEM_AVAIL = 1 and F_CONFIG_URL like \'' + settingService_init.prefix + curUrl + '.%\'';
    // var sqlCommand = "select F_CONFIG_URL from " + "T_570_SERVICE_MODEL" + " where F_ITEM_AVAIL = 1 and F_CONFIG_URL like '" + settingService_init.prefix + curUrl + "' order by F_ID";
    let url = {
        sql: sqlCommand,
    };

    AjaxServer.post(JSON.stringify(url), 'post', 'req.sql.', true, settingRequest.createDiv, '', '');
    cjTempStorage.save('currentServiceUrl', curUrl);
};


// 创建主表格的函数
// 参数：idText。表格的ID号
cjSetting.createTable = function(idText, parentDivId) {
    let parentDiv = document.getElementById(parentDivId);
    let table = document.createElement('table');
    table.id = idText;
    // table.style.marginLeft = "auto";
    // table.style.marginRight = "auto";
    parentDiv.appendChild(table);

    return table;
};

// 删除主表格的函数
// 参数：obj。删除表格的对象
cjSetting.deleteTable = function(obj) {
    obj.parentNode.removeChild(obj);

    let saveButton = document.getElementById('saveButton');
    saveButton.parentNode.removeChild(saveButton);
};

// 创建“输入”控件的函数
// 参数：row。指定插入主表格的行数
//       labelText。标签显示的内容
//       inputId。input控件的ID号
//       value。input控件的值
//       parentObj。父对象
//       buttonId。按钮的ID号（目前只针对DB配置才需要）
//       buttonText。按钮显示的内容（目前只针对DB配置才需要）
cjSetting.createInput = function(row, labelText, inputId, value, parentObj, buttonId, buttonText) {
    let input = document.createElement('input');
    input.type = 'text';
    input.id = inputId;
    input.value = value;

    let rowContent = parentObj.insertRow(row);
    let cellContent1 = rowContent.insertCell(0);
    cellContent1.innerHTML = labelText + ' : ';

    let cellContent2 = rowContent.insertCell(1);
    cellContent2.appendChild(input);
    cellContent2.setAttribute('configID', '');
    cellContent2.setAttribute('configModelID', inputId);

    if ( buttonId != null ) {
        let cellContent3 = rowContent.insertCell(2);
        let button = cjSetting.createButton(buttonText, buttonId, 'delete_button', cellContent3, cjSetting.delDbConnection);
        button.setAttribute('ParentTableId', parentObj.id);

        if ( row < 1 ) {
            button.disabled = 'disabled';
        } else {
            let rows = parentObj.rows;
            for ( let i = 0; i < rows.length; i++ ) {
                let cells = rows[i].cells;
                let delButton = cells[2].firstChild;
                delButton.disabled = false;
            }
        }
    }
};

// 创建“按钮”控件的函数
// 参数：text。按钮显示的内容
//       id。按钮的ID号
//       classText。按钮属于哪个类
//       parentObj。父对象
//       callBack_fn。onclick触发时的回调函数
cjSetting.createButton = function(text, id, classText, parentObj, callBack_fn) {
    let button = document.createElement('input');
    button.type = 'button';
    button.id = id;
    button.value = text;
    button.class = classText;

    if ( parentObj != null ) {
        parentObj.appendChild(button);
    }

    button.onclick = function(e) {
        callBack_fn(e);
    };

    return button;
};

// 创建新行（只针对表格展示模式）
cjSetting.createNewRow = function(table) {
    let childObj;

    let rowContent = table.insertRow(table.rows.length);
    let fristRow = table.rows[0];
    for ( let i = 0; i < fristRow.cells.length; i++ ) {
        let cell = rowContent.insertCell(i);
        cell.setAttribute('configModelID', fristRow.cells[i].getAttribute('configModelID'));

        if ( fristRow.cells[i].getAttribute('configItemType') == 0 ) {
            childObj = document.createElement('input');
        } else if ( fristRow.cells[i].getAttribute('configItemType') == 1 ) {
            let menuStr = fristRow.cells[i].getAttribute('configItemMenu');
            let menuArray = menuStr.split(',');

            childObj = document.createElement('select');
            childObj.onchange = function(e) {
                cjSetting.selectOnChange(e);
            };
            for ( let j = 0; j < menuArray.length; j++ ) {
                let optionObj = document.createElement('option');
                optionObj.value = j;
                optionObj.textContent = menuArray[j];
                childObj.add(optionObj);
            }
        } else if ( fristRow.cells[i].getAttribute('configItemType') == 2 ) {

        } else if ( fristRow.cells[i].getAttribute('configItemType') == 3 ) {
            childObj = document.createElement('input');
            childObj.type = 'password';
        } else {
            childObj = cjSetting.createButton('删除', 'delbutton', '', null, cjSetting.delDbConnection);
            childObj.setAttribute('ParentTableId', table.id);
        }
        cell.appendChild(childObj);
    }
};

cjSetting.showByList = function(objArray, table) {
    for (let i = 0; i < objArray.length; i++) {
        let value = objArray[i].defaultValue;
        let labelText = objArray[i].label;
        let inputId = objArray[i].modelId;
        let buttonId = null;
        let buttonText = '';

        // 创建输入控件，插入到主表格中
        cjSetting.createInput(i, labelText, inputId, value, table, buttonId, buttonText);
    }
};

cjSetting.showByTable = function(objArray, table) {
    table.border = 1;

    let rowContent = table.insertRow(0);

    for (let i = 0; i < objArray.length; i++) {
        let value = '';
        let modelId = objArray[i].modelId;
        let itemName = objArray[i].name;
        let labelText = objArray[i].label;
        let itemType = objArray[i].itemType;
        let menu = objArray[i].menu;
        let defaultValue = objArray[i].defaultValue;

        let cell = rowContent.insertCell(i);
        cell.setAttribute('configItemType', itemType);
        cell.setAttribute('configItemMenu', menu);
        cell.setAttribute('configModelID', modelId);
        cell.setAttribute('configID', '');
        cell.innerHTML = labelText;
    }

    let delCell = rowContent.insertCell(objArray.length);
    delCell.innerHTML = '操作';

    let addButton = cjSetting.createButton('添加', 'addbutton', '', table, cjSetting.addDbConnection);
    addButton.setAttribute('ParentTableId', table.id);
};


// 从服务器中获取配置项所有的数据记录
settingRequest.getDataAndFill = function(request, configUrl) {
    let DataObjArray = new Array();
    let data = request;
    let obj = JSON.parse(data);

    let splitResult = configUrl.split('|');

    let currentUrl = splitResult[0];
    let showType = splitResult[1];

    var table = document.getElementById(currentUrl + '_base_table');
    let serviceObjArray = cjTempStorage.loadArray(currentUrl + '_base_table' + '_serviceObjArray');

    for (var i = 0; i < obj.data.length; i++) {
        let itemData = {};
        if (showType != 'user') {
            itemData = ServiceItemDataClass.createNew(obj.data[i].F_ID, obj.data[i].F_MODEL_ID, obj.data[i].F_VALUE, '', obj.data[i].F_CONFIG_URL);

            for (var j = 0; j < serviceObjArray.length; j++) {
                if (serviceObjArray[j].modelId == obj.data[i].F_MODEL_ID) {
                    itemData.defaultValue = serviceObjArray[j].defaultValue;
                }
            }
        } else if (showType == 'user') {
            itemData = UserItemClass.createNew(obj.data[i].F_USER_NAME, obj.data[i].F_PASSWORD, obj.data[i].F_PRIVILEGE);
        }

        DataObjArray.push(itemData);
    }

    var table = document.getElementById(currentUrl + '_base_table');
    cjTempStorage.saveArray(currentUrl + '_base_table' + '_serviceDataObjArray', DataObjArray);

    if ( showType == 'list' ) {
        var startNum = 0;
        for ( var i = 0; i < table.rows.length; i++ ) {
            var cell = table.rows[i].cells[1];
            let inputObj = cell.firstChild;

            for ( var j = startNum; j < DataObjArray.length; j++ ) {
                if ( inputObj.id == DataObjArray[j].modelId ) {
                    if ( cell.getAttribute('configID') != DataObjArray[j].id.toString() ) {
                        if ( DataObjArray[j].value == '' ) {
                            inputObj.value = DataObjArray[j].defaultValue;
                        } else {
                            inputObj.value = DataObjArray[j].value;
                        }
                        cell.setAttribute('configID', DataObjArray[j].id.toString());
                        cell.setAttribute('configModelID', DataObjArray[j].modelId);
                        startNum = j + 1;
                        break;
                    }
                }
            }
        }
    } else if ( showType == 'table' ) {
        let dataCount = Math.ceil(DataObjArray.length / (table.rows[0].cells.length - 1));

        for ( var i = 0; i < dataCount; i++ ) {
            cjSetting.createNewRow(table);
        }

        var startNum = 0;
        let tempDataObjArray = DataObjArray;

        for ( var i = 1; i < table.rows.length; i++ ) {
            var row = table.rows[i];
            for ( var j = 0; j < row.cells.length - 1; j++ ) {
                var cell = row.cells[j];
                let curModelID = cell.getAttribute('configModelID');
                for ( let n = startNum; n < tempDataObjArray.length; n++ ) {
                    if ( curModelID == tempDataObjArray[n].modelId ) {
                        if ( cell.getAttribute('configID') != tempDataObjArray[n].id.toString() ) {
                            var childObj = cell.firstChild;
                            if ( tempDataObjArray[n].value == '' ) {
                                childObj.value = tempDataObjArray[n].defaultValue;
                            } else {
                                childObj.value = tempDataObjArray[n].value;
                            }

                            cjSetting.selectOnChange(childObj);
                            cell.setAttribute('configID', tempDataObjArray[n].id.toString());
                            tempDataObjArray.splice(n, 1);
                        }
                        break;
                    }
                }
            }
        }
    } else if ( showType == 'user' ) {
        if (DataObjArray.length > 0) {
            for (var i = 0; i < DataObjArray.length; i++) {
                cjSetting.createNewRow(table);
            }

            for (var i = 1; i < table.rows.length; i++) {
                var row = table.rows[i];
                for (var j = 0; j < row.cells.length - 1; j++) {
                    var cell = row.cells[j];
                    var childObj = cell.firstChild;

                    switch (j) {
                    case 0:
                        childObj.value = DataObjArray[i-1].userName;
                        cell.setAttribute('configID', DataObjArray[i-1].userName);
                        break;

                    case 1:
                        childObj.value = DataObjArray[i-1].passwd;
                        break;

                    case 2:
                        childObj.value = DataObjArray[i-1].priv;
                        break;
                    }
                }
            }
        }
    }

    cjSetting.checkIsAdmin();
};


// 创建分支DIV函数
settingRequest.createDiv = function(request, param1) {
    let obj = JSON.parse(request);
    let mainDiv = document.getElementById('tab_content');

    // 清空主DIV中所有的子DIV
    while (mainDiv.firstChild) {
        mainDiv.removeChild(mainDiv.firstChild);
    }

    let subServiceArray = [];
    for (var i = 0; i < obj.data.length; i++) {
        if (cjSetting.findInArray(subServiceArray, obj.data[i].F_CONFIG_URL) == false) {
            subServiceArray.push(obj.data[i].F_CONFIG_URL);
        }
    }

    if (subServiceArray.length > 0) {
        for (var i = 0; i < subServiceArray.length; i++) {
            let div = document.createElement('div');
            let titleLabel = document.createElement('label');
            div.id = subServiceArray[i];
            div.style.marginBottom = '50px';
            div.style.marginLeft = 'auto';
            div.style.marginRight = 'auto';
            div.style.textAlign = 'left';

            titleLabel.textContent = settingService_init.showText[div.id.split('.')[4]];
            titleLabel.style.fontFamily = settingService_init.titleStyle.fontFamily;
            titleLabel.style.fontSize = settingService_init.titleStyle.fontSize;
            titleLabel.style.color = settingService_init.titleStyle.fontColor;
            titleLabel.style.fontWeight = settingService_init.titleStyle.fontWeight;

            mainDiv.appendChild(titleLabel);
            mainDiv.appendChild(div);

            let sqlCommand = 'select * from ' + 'T_570_SERVICE_MODEL' + ' where F_ITEM_AVAIL = 1 and F_CONFIG_URL = \'' + subServiceArray[i] + '\' order by F_ID';
            let url = {
                sql: sqlCommand,
            };

            AjaxServer.post(JSON.stringify(url), 'post', 'req.sql.', false, settingRequest.createGUI, '', subServiceArray[i]);
        }

        let btnToolLi = document.createElement('li');

        let saveAllButtonId = 'saveAll_button';
        let saveAllButton = cjSetting.createButton('保存所有', saveAllButtonId, '', btnToolLi, cjSetting.saveAllBtn_onClick);

        let saveToFileButtonId = 'saveToFile_button';
        let saveToFileButton = cjSetting.createButton('写入文件', saveToFileButtonId, '', btnToolLi, cjSetting.saveToFileBtn_onClick);

        saveAllButton.style.marginRight = '15px';
        saveToFileButton.style.marginRight = '15px';

        mainDiv.appendChild(btnToolLi);
    }
};


// 创建主体界面的函数
settingRequest.createGUI = function(request, currentUrl) {
    let sqlCommand = '';
    let objArray = new Array();
    let obj = JSON.parse(request);

    for (let j = 0; j < obj.data.length; j++) {
        let itemObj = ServiceItemClass.createNew('', obj.data[j].F_ID, obj.data[j].F_ITEM_NAME, obj.data[j].F_ITEM_LABEL, obj.data[j].F_ITEM_TYPE, obj.data[j].F_ITEM_MENU, '', obj.data[j].F_ITEM_DEFAULT_VALUE, obj.data[j].F_CONFIG_URL);
        objArray.push(itemObj);
    }

    // 如果从数据库中获取到有模版则进行界面切换，否则不切换
    if (objArray.length > 0) {
        let tmpArray = currentUrl.split('.');
        var currentService = tmpArray[4];

        // 创建新的主表格
        let tableId = currentUrl + '_base_table';
        let parentDivId = currentUrl;
        let table = cjSetting.createTable(tableId, parentDivId);
        table.setAttribute('CurrentService', currentService);

        cjTempStorage.saveArray(tableId + '_serviceObjArray', objArray);

        sqlCommand = 'select * from ' + 'T_570_SERVICE_DATA' + ' where F_CONFIG_URL = \'' + currentUrl + '\' order by F_ID';

        var serviceMap = settingService_init.map;

        if (serviceMap[currentService] == 'list') {
            cjSetting.showByList(objArray, table);
        } else if (serviceMap[currentService] == 'table' || serviceMap[currentService] == 'user') {
            cjSetting.showByTable(objArray, table);

            if ( serviceMap[currentService] == 'user' ) {
                sqlCommand = 'select * from ' + 'T_570_USER';
            }
        }

        let tabContent = document.getElementById(currentUrl);


        let toolLi = document.createElement('li');
        tabContent.appendChild(toolLi);

        let saveButtonId = currentUrl + '_saveButton';
        let saveButton = cjSetting.createButton('保存', saveButtonId, '', toolLi, cjSetting.saveBtn_onClick);

        cjSetting.allSaveButtonId.push(saveButtonId);

        let resultLabel = document.createElement('label');
        resultLabel.id = currentUrl + '_resultLabelId';
        resultLabel.style.marginLeft = '10px';
        resultLabel.style.fontSize = '10px';
        toolLi.appendChild(resultLabel);

        saveButton.setAttribute('CurrentUrl', currentUrl);
        saveButton.setAttribute('ResultLabelId', resultLabel.id);
        saveButton.setAttribute('RequestReturn', false);
    }

    // 组织JSON格式
    let url = {
        sql: sqlCommand,
    };

    AjaxServer.post(JSON.stringify(url), 'post', 'req.sql.', true, settingRequest.getDataAndFill, '', currentUrl + '|' + serviceMap[currentService]);
};

cjSetting.selectOnChange = function(e) {
    let obj = '';
    if ( e.currentTarget ) {
        obj = e.currentTarget;
    } else {
        obj = e.parentNode.parentNode.cells[0].firstChild;
    }

    let uidObj = obj.parentNode.parentNode.cells[1];
    let pwdObj = obj.parentNode.parentNode.cells[2];

    if ( obj.value == 2 ) {
        uidObj.firstChild.disabled = 'disabled';
        pwdObj.firstChild.disabled = 'disabled';
    } else {
        uidObj.firstChild.disabled = false;
        pwdObj.firstChild.disabled = false;
    }
};

// “添加”按钮的onclick响应函数
// 参数：e。触发的事件
cjSetting.addDbConnection = function(e) {
    let tableId = e.currentTarget.getAttribute('ParentTableId');
    let table = document.getElementById(tableId);
    cjSetting.createNewRow(table);
};

// “删除”按钮的onclick响应函数
// 参数：e。触发的事件
cjSetting.delDbConnection = function(e) {
    let needDelArray = cjTempStorage.loadArray('dataDeleteArray');
    if ( needDelArray == null ) {
        needDelArray = new Array();
    }

    let curObj = e.currentTarget;
    let curCell = curObj.parentNode;
    let curRow = curCell.parentNode;

    for ( let i = 0; i < curRow.cells.length - 1; i++ ) {
        let cell = curRow.cells[i];
        let dataId = cell.getAttribute('configID');
        if ( dataId && dataId != '' ) {
            needDelArray.push(dataId);
        }
    }

    let table = curRow.parentNode;
    table.removeChild(curRow);

    cjTempStorage.saveArray('dataDeleteArray', needDelArray);
};

// “保存”按钮的onclick响应函数
// 参数：e。触发的事件
cjSetting.saveBtn_onClick = function(e) {
    // if( cjSetting.messageBox("confirm","是否确定保存设置？") == false ){
    //    return false;
    // }

    let sqlArray = new Array();
    let needDelArray = cjTempStorage.loadArray('dataDeleteArray');

    let serviceMap = settingService_init.map;

    let sqlCommand = '';
    let isInArray;

    let currentUrl = e.currentTarget.getAttribute('CurrentUrl');
    let buttonId = e.currentTarget.id;

    let tableId = currentUrl + '_base_table';
    let table = document.getElementById(tableId);
    let tableRows = table.rows;

    let serviceDataObjArray = cjTempStorage.loadArray(tableId + '_serviceDataObjArray');

    let currentService = table.getAttribute('CurrentService');

    if (serviceMap[currentService] == 'user') {
        let userArrayOnSvr = [];
        for (var i = 0; i < serviceDataObjArray.length; i++) {
            userArrayOnSvr.push(serviceDataObjArray[i].userName);
        }

        for (var i = 1; i < tableRows.length; i++) {
            let rowId = tableRows[i].cells[0].getAttribute('configID');
            if (rowId && cjSetting.findInArray(userArrayOnSvr, rowId) == true) {
                for (var j = 0; j < tableRows[i].cells.length - 1; j++) {
                    var childObj = tableRows[i].cells[j].firstChild;
                    var childObjValue;
                    var sqlFieldName;

                    switch (j) {
                    case 0:
                        childObjValue = serviceDataObjArray[i - 1].userName;
                        sqlFieldName = 'F_USER_NAME';
                        break;

                    case 1:
                        childObjValue = serviceDataObjArray[i - 1].passwd;
                        sqlFieldName = 'F_PASSWORD';
                        break;

                    case 2:
                        childObjValue = serviceDataObjArray[i - 1].priv;
                        sqlFieldName = 'F_PRIVILEGE';
                        break;
                    }

                    if (childObj.value != childObjValue) {
                        if (sqlFieldName === 'F_PASSWORD') {
                            // 加密用户密码
                            childObj.value = $.des.doEncrypt(childObj.value, $.des.ENCRY_FIRST_KEY, $.des.ENCRY_SECOND_KEY, $.des.ENCRY_THIRD_KEY);
                        }
                        sqlCommand = 'update T_570_USER set ' + sqlFieldName + ' = \'' + childObj.value + '\' where F_USER_NAME = \'' + rowId + '\';';
                        sqlArray.push(sqlCommand);
                        sqlCommand = '';
                    }
                }
            } else {
                // 加密用户密码

                let passWd = tableRows[i].cells[1].firstChild.value;
                tableRows[i].cells[1].firstChild.value = $.des.doEncrypt(passWd, $.des.ENCRY_FIRST_KEY, $.des.ENCRY_SECOND_KEY, $.des.ENCRY_THIRD_KEY);
                sqlCommand = 'insert into T_570_USER (F_USER_NAME,F_PASSWORD,F_PRIVILEGE) values(\''
                    + tableRows[i].cells[0].firstChild.value + '\',\''
                    + tableRows[i].cells[1].firstChild.value + '\',\''
                    + tableRows[i].cells[2].firstChild.value + '\');';

                sqlArray.push(sqlCommand);
                sqlCommand = '';
            }
        }
    } else {
        for (var i = 0; i < tableRows.length; i++) {
            for (var j = 0; j < tableRows[i].cells.length; j++) {
                isInArray = false;
                let curCell = tableRows[i].cells[j];

                let dataModelId = curCell.getAttribute('configModelID');
                if (dataModelId && dataModelId != '' && dataModelId != 'null') {
                    var childObj = curCell.firstChild;

                    if (childObj && childObj.value != undefined) {
                        let dataId = curCell.getAttribute('configID');
                        for (let n = 0; n < serviceDataObjArray.length; n++) {
                            if (dataId == serviceDataObjArray[n].id) {
                                if (childObj.value != serviceDataObjArray[n].value) {
                                    sqlCommand = 'update T_570_SERVICE_DATA set F_VALUE = \'' + childObj.value + '\' where F_ID = ' + dataId + ';';
                                }

                                isInArray = true;
                                break;
                            }
                        }

                        if (isInArray == false) {
                            sqlCommand = 'insert into T_570_SERVICE_DATA (F_MODEL_ID,F_VALUE,F_CONFIG_URL) values(\'' + dataModelId + '\',\'' + childObj.value + '\',\'' + currentUrl + '\');';
                        }
                    }
                }

                if (sqlCommand != '') {
                    sqlArray.push(sqlCommand);
                    sqlCommand = '';
                }
            }
        }
    }

    if ( needDelArray != null && needDelArray.length > 0 ) {
        for (var i = 0; i < needDelArray.length; i++) {
            if (serviceMap[currentService] == 'user') {
                sqlCommand = 'delete from T_570_USER where F_USER_NAME = ' + needDelArray[i] + ';';
            } else {
                sqlCommand = 'delete from T_570_SERVICE_DATA where F_ID = ' + needDelArray[i] + ';';
            }
            sqlArray.push(sqlCommand);
            sqlCommand = '';
        }

        cjTempStorage.deleteArray('dataDeleteArray');
    }
    cjSetting.commitData(sqlArray, buttonId, true);
};

// “保存所有”按钮的onclick响应函数
// 参数：e。触发的事件
cjSetting.saveAllBtn_onClick = function(e) {
    for (let i = 0; i < cjSetting.allSaveButtonId.length; i++) {
        let button = document.getElementById(cjSetting.allSaveButtonId[i]);
        button.click();
    }
};

// “写入文件”按钮的onclick响应函数
// 参数：e。触发的事件
cjSetting.saveToFileBtn_onClick = function(e) {
    let curUrl = cjTempStorage.load('currentServiceUrl');
    AjaxServer.post(JSON.stringify(''), 'post', 'post.convert.exec.', true, settingRequest.saveToFileResult, settingService_init.prefix + curUrl, '');
};

// 提交数据的函数
// 参数：sqlArray。需提交的SQL语句的数组
//       async。AJAX是异步还是同步的控制，true为异步，false为同步
cjSetting.commitData = function(sqlArray, buttonId, async) {
    let saveToDbButton = document.getElementById(buttonId);
    let resultLabelId = saveToDbButton.getAttribute('ResultLabelId');
    let resultLabel = document.getElementById(resultLabelId);
    resultLabel.innerHTML = '';

    for ( let i = 0; i < sqlArray.length; i++ ) {
        let url = {
            sql: sqlArray[i],
        };
        AjaxServer.post(JSON.stringify(url), 'post', 'post.sql.exec.', async, settingRequest.saveToDbResult, '', buttonId);
    }

    let timerIdArray = [];
    if (sqlArray.length > 0) {
        let timerId = setTimeout(function() {
            let requestReturn = saveToDbButton.getAttribute('RequestReturn');
            if (requestReturn == 'false') {
                resultLabel.style.color = 'red';
                resultLabel.textContent = '连接超时！';
            }
        }, 5000);

        timerIdArray.push(timerId);
        cjTempStorage.saveArray('timerId', timerIdArray);
    } else {
        resultLabel.style.color = '#f60';
        resultLabel.textContent = '数据无修改,无需保存！';
    }
};

/*
 * 保存到数据库返回结果的回调函数
 * 参数：request。服务器返回的请求响应
 */
settingRequest.saveToDbResult = function(request, buttonId) {
    let data = request;
    let obj = JSON.parse(data);

    let timerIdArray = cjTempStorage.loadArray('timerId');
    if (timerIdArray != null) {
        for (let i = 0; i < timerIdArray.length; i++) {
            clearTimeout(timerIdArray[i]);
        }
    }

    let saveToDbButton = document.getElementById(buttonId);
    saveToDbButton.setAttribute('RequestReturn', 'true');
    let resultLabelId = saveToDbButton.getAttribute('ResultLabelId');

    let resultLabel = document.getElementById(resultLabelId);

    let resultText = '';
    let resultTextColor;
    if (obj.data >= 1) {
        resultText = '保存成功！';
        resultTextColor = 'green';
    } else {
        resultText = '保存失败！';
        resultTextColor = 'red';
    }

    resultLabel.style.color = resultTextColor;
    resultLabel.textContent = resultText;
};

/*
 * 从数据库导出到配置文件返回结果的回调函数
 * 参数：request。服务器返回的请求响应
 */
settingRequest.saveToFileResult = function(request, param1) {
    let data = request;
    let obj = JSON.parse(data);

    let result = parseInt(obj.data, 10);
    let messageText = '';
    if (result == 1) {
        messageText = '写入配置文件成功！';
    } else if (result == -1) {
        messageText = '连接后台数据库失败！';
    } else if (result == -2) {
        messageText = '从数据库中获取配置信息失败！';
    } else if (result == -3) {
        messageText = '打开文件失败！';
    }
    cjSetting.messageBox('alert', messageText);
};


// 检查是否管理员帐号登录
// 如果不是管理员，则没有修改其他用户的权限
cjSetting.checkIsAdmin = function() {
    let userNameValue = $.zcookie('userName');

    let userName = $.des.doDecrypt(userNameValue, $.des.ENCRY_FIRST_KEY, $.des.ENCRY_SECOND_KEY, $.des.ENCRY_THIRD_KEY);

    if (userName != 'admin') {
        let table = document.getElementById('base_table');

        for (let i = 0; i < table.rows.length; i++) {
            for (let j = 0; j < table.rows[i].cells.length; j++) {
                let childObj = table.rows[i].cells[j].firstChild;
                if ( childObj ) {
                    childObj.disabled = 'disabled';
                }
            }
        }

        let addbutton = document.getElementById('addbutton');
        let saveButton = document.getElementById('saveButton');

        addbutton.disabled = 'disabled';
        saveButton.disabled = 'disabled';
    }
};


// 消息提示框生成函数
// 参数：type。提示框的类型，是警告还是确认
//       text。提示框主体的内容
cjSetting.messageBox = function(type, text) {
    if ( type == 'alert' ) {
        alert(text);
    } else if ( type == 'confirm' ) {
        if ( confirm(text) == false ) {
            return false;
        } else {
            return true;
        }
    }
};

cjSetting.findInArray = function(array, elem) {
    if ( array == null || array.length == 0 ) {
        return false;
    }
    for ( let i = 0; i < array.length; i++ ) {
        if ( elem == array[i] ) {
            return true;
        }
    }

    return false;
};


