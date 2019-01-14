/**
 * Created by nielei on 2018/6/25.
 */
let analysis = {

};
'use strict';
define(['jquery', 'global', 'modal', 'action', 'cjcommon', 'cjstorage', 'cjdatabaseaccess', 'cjajax', 'utils', 'cache'], function($, g) {
    analysis.Analysis = function() {
        let serverInfo = cacheOpt.get('server-config');
        this.oTemplates = {};
        this.aController = [];
        this.loadSql = async function(sql) {
            let db = window.top.cjDb;
            let reqParam = {
                reqHost: serverInfo['server']['ipAddress'],
                reqPort: serverInfo['server']['httpPort'],
            };
            return new Promise(function(resolve, reject) {
                db.load(sql, (e, v) => {
                    if (e) {
                        reject(e);
                    } else {
                        resolve(v);
                    }
                }, reqParam);
            });
        };

        this.analysisTemplate = async function(template) {
            for (let i = 0; i < template.length; i++) {
                this.oTemplates[template[i]] = {};
            }
        };
        this.analysisStyle = function(style) {
            let styles = JSON.stringify(style);
            styles = styles.replace(/,/g, ';');
            styles = styles.replace(/"/g, '');
            styles = styles.replace(/{/g, '');
            styles = styles.replace(/}/g, '');

            return styles;
        };
        this.analysisAdditional = function(additional) {
            if (!additional.style) {
                additional['style'] = '';
            }
            if (!additional.next) {
                additional['next'] = 'javascript:void(0)';
            }
            if (!additional.action) {
                additional['action'] = '';
            }
            return additional;
        };
        this.analysisDataSource = async function(templates, dataSource, additional) {
            for (let i = 0; i < templates.length; i++) {
                let aValue = [];
                if (dataSource[templates[i]].style){
                    this.oTemplates[templates[i]]['style'] = this.analysisStyle(dataSource[templates[i]].style);
                } else {
                    this.oTemplates[templates[i]]['style'] = {};
                }
                if (dataSource[templates[i]].type) {
                    switch (dataSource[templates[i]].type) {
                    case 'const':
                        aValue = dataSource[templates[i]].value;
                        break;
                    // case 'sql':
                    //     let value = loadSql(dataSource[templates[i]].value);
                    //     aValue = value;
                    //     break;
                    default:
                        aValue = null;
                        break;
                    }
                    this.oTemplates[templates[i]]['value'] = aValue;
                }
                if ((dataSource[templates[i]].components)) {
                    this.oTemplates[templates[i]]['components'] = await this.analysisComponents(dataSource[templates[i]].components, additional);
                }
                if (templates[i] === 'tab') {
                    this.oTemplates[templates[i]]['components'] = await this.analysisTab(dataSource[templates[i]].tabPanel, aValue, additional);
                }
                if (templates[i] === 'singleTable') {
                    this.oTemplates[templates[i]]['components'] = await this.analysisSingleTable(dataSource[templates[i]]);
                }
                if (templates[i] === 'rtTable') {
                    this.oTemplates[templates[i]]['components'] = await this.analysisRtTable(dataSource[templates[i]]);
                }
                if (templates[i] === 'associationTable') {
                    this.oTemplates[templates[i]]['components'] = await this.analysisAssociationTable(dataSource[templates[i]]);
                }
            }
        };
        this.analysisComponents = async function(components, additional) {
            let html = '';
            for (let i =0; i < components.length; i++) {
                let aValue = [];
                let aClass = [];
                let aID = [];
                let aController = [];
                let sCustomClass = ''
                if (components[i].customClass) {
                    sCustomClass = components[i].customClass;
                }
                switch (components[i].type) {
                case 'const':
                    aValue = components[i].value;
                    if (components[i].class) {
                        aClass = components[i].class;
                    }
                    if (components[i].controller) {
                        aController = components[i].controller;
                    }
                    aValue.forEach(() => {
                        aID.push(new Date().getTime());
                    })
                    break;
                case 'sql':
                    let value = await this.loadSql(components[i].value);
                    value.forEach((item)=>{
                        aValue.push(item.value)
                        if (item.id) {
                            aID.push(item.id)
                            aClass.push('sql_btn')
                        }
                        if (components[i].controller) {
                            aController = components[i].controller;
                        }
                    })
                    break;
                case 'session':
                    let sessionData = JSON.parse(sessionStorage.getItem(components[i].sessionName));
                    if (!(components[i].condition)) {
                        sessionData.forEach(item =>{
                            aValue.push(item[components[i].value]);
                            if (item.id) {
                                aID.push(item.id)
                            }
                            if (components[i].class) {
                                aClass.push(components[i].class);
                            } else if (item.class) {
                                aClass.push(item.class)
                            } else {
                                aClass.push('session_class')
                            }
                            if (components[i].controller) {
                                aController = components[i].controller;
                            }

                        })
                    } else {
                        let v = '';
                        if (components[i].condition.value.startsWith('@')) {
                            let str = components[i].condition.value.slice(1);
                            v = sessionStorage.getItem(str);
                            sessionData.forEach(item =>{
                                if (item[components[i].condition.key] === v) {
                                    aValue.push(item[components[i].value]);
                                    if (item.id) {
                                        aID.push(item.id)
                                    }
                                    if (components[i].class) {
                                        aClass.push(components[i].class)
                                    } else if (item.class) {
                                        aClass.push(item.class)
                                    } else {
                                        aClass.push('session_class')
                                    }
                                }
                                if (components[i].controller) {
                                    aController = components[i].controller;
                                }
                            })
                        } else {
                            sessionData.forEach(item =>{
                                if (item[components[i].condition.key] === components[i].condition.value) {
                                    aValue.push(item[components[i].value]);
                                    if (item.id) {
                                        aID.push(item.id)
                                    }
                                    if (components[i].class) {
                                        aClass.push(components[i].class)
                                    } else if (item.class) {
                                        aClass.push(item.class)
                                    } else {
                                        aClass.push('session_class')
                                    }
                                    if (components[i].controller) {
                                        aController = components[i].controller;
                                    }
                                }
                            })
                        }
                    }
                    break;
                default:
                    break;
                }
                switch (components[i].componentType) {
                case 'text':
                    html += this.createText(aValue, aClass, additional);
                    break;
                case 'multiColText':
                    html += this.createMultiColText(aValue, aClass, additional);
                    break;
                case 'input':
                    html += this.createInput(aValue, aClass, additional, components[i].attr);
                    break;
                case 'btn':
                    html += this.createBtn(aValue, aClass, additional, aID, sCustomClass);
                    break;
                case 'svg':
                    html += this.createSvg(aValue, aClass, additional, aController);
                    break;
                case 'iframe':
                    html += this.createIframe(aValue, aClass, additional, aController);
                    break;
                case 'menu':
                    html += this.createMenu(aValue, aClass, additional);
                    break;
                case 'rt-text':
                    html += this.createRtText(aValue, aClass, additional);
                    break;
                case 'singleTable':
                    html = this.createTable(components[0].prop, components[0].componentType);
                    break;
                case 'rtTable':
                    html = this.createTable(components[0].prop, components[0].componentType);
                    break;
                case 'associationTable':
                    html = this.createTable(components[0].prop, components[0].componentType);
                    break;
                case 'step':
                    html += this.createStep(components);
                    break;
                case 'url':
                    html += this.createUrl(aValue);
                    break;
                case 'js':
                    this.createJs(aValue);
                    break;
                default:
                    break;
                }
            }
            return html;
        };
        this.createUrl = function(aValue){
            let html='';
            // html =`<script> window.location = "${aValue}" </script>`;
            return html;
        };
        this.createJs = function(url){
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            document.getElementsByTagName('head')[0].appendChild(script);
        };
        this.analysisInputAttr = function(attr, value, cla, styles) {
            let label = '';
            let icon = '';
            let input = '';
            let readonly = '';
            let sClass = '';
            let sIcon = '';
            if (attr.label) {
                label = `<label for="${cla}" style="font-size: 24px">${value}</label>`;
                sClass = 'label-input';
                sIcon = 'label-icon';
            }
            if (attr.readonly) {
                readonly = 'readonly';
            }
            if (attr.icon) {
                icon = `<span class="input-icon ${sIcon}">
                            <svg class="icon input-${attr.icon}" aria-hidden="true">
                                 <use xlink:href="#${attr.icon}"></use>
                            </svg>
                        </span>`;
            }
            if (!attr.name) {
                attr['name'] = 'no';
            }
            switch (attr.type) {
            case 'text':
                input = `<input type="text" name="${attr.name}" id="${cla}" class="t-input ${cla} ${sClass}" ${readonly} placeholder="${value}" style="${styles}"/>`;
                break;
            case 'password':
                input = `<input type="password" name="${attr.name}" id="${cla}" class="t-input ${cla} ${sClass}" ${readonly} placeholder="${value}" style="${styles}"/>`;
                break;
            case 'num':
                input = `<input type="number" name="${attr.name}" id="${cla}" class="t-input ${cla} ${sClass}" ${readonly} placeholder="${value}" style="${styles}"/>`;
                break;
            case 'const':
                input = `<input type="text" name="${attr.name}" id="${cla}" value="${value}" class="t-input ${cla} ${sClass}" ${readonly}  style="${styles}"/>`;
                break;
            case 'ordinary':
                input = `<input type="text" name="${attr.name}" id="${cla}" class="t-input ${cla} ${sClass}" ${readonly}  style="${styles}"/>`;
                break;
            case 'hidden':
                input = `<input type="text" name="${attr.name}" id="${cla}" class="t-input ${cla} ${sClass}" style="display: none"/>`;
                break;
            case 'select':
                input = `<select name="${attr.name}" id="${cla}" class="t-input ${cla} ${sClass}">`;
                let select = '';
                let aValue = [];
                let aName = [];
                if (attr.session) {
                    let sessionData = JSON.parse(sessionStorage.getItem(attr.session));
                    if (!(attr.condition)) {
                        sessionData.forEach((item) =>{
                            aValue.push(item[attr.value[1]]);
                            aName.push(item[attr.value[0]]);
                        })
                    } else {
                        let v = '';
                        if (attr.condition.value.startsWith('@')) {
                            let str = attr.condition.value.slice(1);
                            v = sessionStorage.getItem(str);
                            sessionData.forEach((item) =>{
                                if (item[attr.condition.key] === v) {
                                    aValue.push(item[attr.value[1]]);
                                    aName.push(item[attr.value[0]]);
                                }
                            })
                        } else {
                            sessionData.forEach((item) =>{
                                if (item[attr.condition.key] === attr.condition.value) {
                                    aValue.push(item[attr.value[1]]);
                                    aName.push(item[attr.value[0]]);
                                }
                            })
                        }
                    }
                }
                for (let i = 0; i < aValue.length; i++) {
                    select += `<option value="${aValue[i]}">${aName[i]}</option>`
                }
                input = input + select + '</select>';
                break;
            default:
                input = `<input type="text" name="${attr.name}" id="${cla}" class="t-input ${cla} ${sClass}" ${readonly} placeholder="${value}" style="${styles}"/>`;
                break;
            }
            return label + icon + input;
        };
        this.analysisTab = async function(aTabPanel, aVal, additional) {
            let li = '';
            let tabContent = '';
            let div = '';
            for (let i = 0; i < aVal.length; i++) {
                if (i === 0) {
                    li += `<li class="tabs-tab tab-nav-active" id="tabIndex${i}">${ aVal[i] }<span class="t-badge" id="t-badge${i}"></span></li>`;
                } else {
                    li += `<li class="tabs-tab" id="tabIndex${i}">${ aVal[i] }<span class="t-badge" id="t-badge${i}"></span></li>`;
                }
            }
            for (let i = 0; i < aTabPanel.length; i++) {
                tabContent = await this.analysisComponents(aTabPanel[i].components, additional);
                if (i === 0) {
                    div += `<div class="tabs-panel tab-panel-active tabIndex${i}">` + tabContent + '</div>';
                } else {
                    div += `<div class="tabs-panel tabIndex${i}">` + tabContent + '</div>';
                }
            }
            return '<ul class="tabs-nav">' + li + '</ul><div class="tabs-content">' + div + '</div>';
        };
        this.analysisSingleTable = function(dataObj) {
            return dataObj;
        };
        this.analysisRtTable = function(dataObj) {
            return dataObj;
        };
        this.analysisAssociationTable = function(dataObj) {
            return dataObj;
        };

        this.createText = function(aVal, aClass, additional) {
            let span = '';
            for (let i = 0; i < aVal.length; i++) {
                if (aVal[i] === '@hidden') {
                    span += `<span class="t-span" id="${aClass[i]}" style="display: none">${aVal[i]}</span>`;
                } else {
                    if (aClass[i]) {
                        if (additional[aClass[i]]) {
                            let oAdditional = this.analysisAdditional(additional[aClass[i]]);
                            let style = this.analysisStyle(oAdditional.style);
                            span += `<span id="${aClass[i]}" class="t-span ${aClass[i]}" style="${style}">${aVal[i]}</span>`;
                        } else {
                            span += `<span id="${aClass[i]}" class="t-span">${aVal[i]}</span>`;
                        }
                    }
                }
            }
            return span;
        };
        this.createMultiColText = function(aVal, aClass, additional) {
            let span = '';
            for (let i = 0; i < aVal.length; i++) {
                if (aClass[i]) {
                    if (additional[aClass[i]]) {
                        let oAdditional = this.analysisAdditional(additional[aClass[i]]);
                        let style = this.analysisStyle(oAdditional.style);
                        span += `<span class="t-span ${aClass[i]}" style="${style}">${aVal[i]}</span>`;
                    } else {
                        span += `<span class="t-span">${aVal[i]}</span>`;
                    }
                }
            }
            return `<div class="multi-line">${span}</div>`;
        };
        this.createInput = function(aVal, aClass, additional, attr) {
            let input = '';
            let div = '';
            let inline = false;
            for (let i = 0; i < aVal.length; i++) {
                if (attr[i].inline) {
                    inline = true;
                }
                if (aClass[i]) {
                    if (additional[aClass[i]]) {
                        let oAdditional = this.analysisAdditional(additional[aClass[i]]);
                        let style = this.analysisStyle(oAdditional.style);
                        input = this.analysisInputAttr(attr[i], aVal[i], aClass[i], style);
                        div += '<div class="input-container">' + input + '</div>';
                    } else {
                        input = this.analysisInputAttr(attr[i], aVal[i], aClass[i], '');
                        div += '<div class="input-container">' + input + '</div>';
                    }
                }
            }
            if (inline) {
                return '<form id="form" class="form-inline">' + div + '</form>';
            } else{
                return '<form id="form">' + div + '</form>';
            }

        };
        this.createBtn = function(aVal, aClass, additional, aID, sCustomClass) {
            let btn = '';
            for (let i = 0; i < aVal.length; i++) {
                if (aClass[i]) {
                    if (additional[aClass[i]]) {
                        let oAdditional = this.analysisAdditional(additional[aClass[i]]);
                        let sAdditional = JSON.stringify(oAdditional).replace(/"/g, '&quot;');
                        let style = this.analysisStyle(oAdditional.style);
                        btn += `<a id="${aID[i]}" href="${oAdditional.next}" class="t-btn ${aClass[i]}" style="${style}" onclick="action.register(${sAdditional})">${aVal[i]}</a>`;
                    } else {
                        btn += `<a id="${aID[i]}" class="t-btn ${aClass[i]}" href="javascript:void(0)">${aVal[i]}</a>`;
                    }
                } else {
                    btn += `<a id="${aID[i]}" class="t-btn" href="javascript:void(0)">${aVal[i]}</a>`;
                }
            }
            if (sCustomClass) {
                return `<div class="${sCustomClass}" style="display: flex; flex-wrap: wrap; margin-top: 30px;">` + btn + `</div>`;

            } else {
                return '<div style="display: flex; flex-wrap: wrap; margin-top: 30px;">' + btn + '</div>';
            }
        };
        this.createSvg = function(aVal, aClass, additional, aController) {
            let svg = '';
            for (let i = 0; i < aVal.length; i++) {
                // let projectName = sessionStorage.getItem('projectName');
                let url = `/common/chtml/template/datashow/svg_show.html?svg=${aVal[i]}`;
                // sessionStorage.setItem('tbName', aVal[i]);
                if (aClass[i]) {
                    if (additional[aClass[i]]) {
                        let oAdditional = this.analysisAdditional(additional[aClass[i]]);
                        let obj = {
                            "action": oAdditional.action,
                            "event": oAdditional.event
                        }
                        let sAdditional = JSON.stringify(obj).replace(/"/g, '&quot;');
                        let style = this.analysisStyle(oAdditional.style);
                        url += `!${sAdditional}`;
                        svg += `<iframe src="${url}" id="${aClass[i]}" class="${aClass[i]}" style="height: 100%;width: 100%;${style}"/>`;
                    } else {
                        svg += `<iframe src="${url}" id="${aClass[i]}" class="${aClass[i]}" style="height: 100%;width: 100%" />`;
                    }
                }
                // this.aController.push(aController[i]);
            }
            return svg;
        };
        this.createIframe = function(aVal, aClass, additional, aController) {
            let ifame = '';
            for (let i = 0; i < aVal.length; i++) {
                // let projectName = sessionStorage.getItem('projectName');
                let url = `${aVal[i]}`;
                // sessionStorage.setItem('tbName', aVal[i]);
                if (aClass[i]) {
                    if (additional[aClass[i]]) {
                        let oAdditional = this.analysisAdditional(additional[aClass[i]]);
                        let style = this.analysisStyle(oAdditional.style);
                        ifame += `<iframe src="${url}" id="${aClass[i]}" class="${aClass[i]}" style="height: 100%;width: 100%;${style}"/>`;
                    } else {
                        ifame += `<iframe src="${url}" id="${aClass[i]}" class="${aClass[i]}" style="height: 100%;width: 100%" />`;
                    }
                }
                // this.aController.push(aController[i]);
            }
            return ifame;
        };
        this.createMenu = function(aVal, aClass, additional) {
            let menu = '';
            for (let i = 0; i < aVal.length; i++) {
                if (aClass[i]) {
                    if (additional[aClass[i]]) {
                        let oAdditional = this.analysisAdditional(additional[aClass[i]]);
                        let sAdditional = JSON.stringify(oAdditional).replace(/"/g, '&quot;');
                        let style = this.analysisStyle(oAdditional.style);
                        menu += `<div class="tpl-icon-menu" style="${style}" onclick="action.register(${sAdditional})">
                                    <svg class="icon t-icon-menu" aria-hidden="true">
                                        <use xlink:href="#icon-menu"></use>
                                    </svg>
                                 </div>`;
                    } else {
                        menu += `<div class="tpl-icon-menu">
                                    <svg class="icon t-icon-menu" aria-hidden="true">
                                        <use xlink:href="#icon-menu"></use>
                                    </svg>
                                 </div>`;
                    }
                }
            }
            if (aVal.length === 2) {
                menu += `<div class="tpl-icon-${aVal[1]}">
                                    <svg class="icon t-icon-${aVal[1]}" aria-hidden="true">
                                        <use xlink:href="#icon-${aVal[1]}"></use>
                                    </svg>
                                 </div>`;
            }
            $.getJSON('/ics/' + projectName + '/config/menu/menu.json', function(data) {
                // todo 增加二级菜单
                let arr = data.data;
                let menuContent = '';
                for (let i = 0; i < arr.length; i++) {
                    if (!arr[i].type){
                        menuContent += `<li><a href="${arr[i].url}" onclick="$('#content #menu').hide()"><svg class="icon t-icon-menuContent" aria-hidden="true">
                                        <use xlink:href="#icon-${arr[i].icon}"></use>
                                    </svg>${arr[i].name}</a></li>`;
                    } else {
                        menuContent += `<li><a onclick="$('#content #menu').hide();action.register(${arr[i].action})"><svg class="icon t-icon-menuContent" aria-hidden="true">
                                        <use xlink:href="#icon-${arr[i].icon}"></use>
                                    </svg>${arr[i].name}</a></li>`;
                    }
                }
                let html = `<div id="menu" style="display: none;">
                            <ul>` + menuContent + `
                            </ul>
                        </div>`;
                $('#content').append(html);
            });
            return menu;
        };
        this.createRtText = function(aVal, aClass, additional) {
            let span = '';
            for (let i = 0; i < aVal.length; i++) {
                let arr = aVal[i].split('|');  // 分隔单位
                if (aClass[i]) {
                    if (additional[aClass[i]]) {
                        let oAdditional = this.analysisAdditional(additional[aClass[i]]);
                        let style = this.analysisStyle(oAdditional.style);
                        if (!oAdditional['.rtStyle']) {
                            oAdditional['.rtStyle'] = '';
                        }
                        let rtStyle = this.analysisStyle(oAdditional.rtStyle);
                        if (arr[1]) {
                            // todo delete 10
                            span += `<div class="${aClass[i]}" style="${style}"><span>${arr[0]}</span><span id="rt-${aClass[i]}" class="rt-${aClass[i]}" style="${rtStyle}">10</span><span>${arr[1]}</span></div>`;
                        } else {
                            span += `<div class="${aClass[i]}" style="${style}"><span>${arr[0]}</span><span id="rt-${aClass[i]}" class="rt-${aClass[i]}" style="${rtStyle}"></span></div>`;
                        }
                    } else {
                        if (arr[1]) {
                            span += `<div class="${aClass[i]}"><span>${arr[0]}</span><span id="rt-${aClass[i]}" class="rt-${aClass[i]}"></span><span>${arr[1]}</span></div>`;
                        } else {
                            span += `<div class="${aClass[i]}"><span>${arr[0]}</span><span id="rt-${aClass[i]}" class="rt-${aClass[i]}"></span></div>`;
                        }
                    }
                }
            }
            return span;
        };
        this.createTable = function(prop, type) {
            let operation = '';
            let query = '';
            let div = '';
            for (let i = 0; i < prop.length; i++) {
                if (prop[i].operationID) {
                    operation = `<div class='toolbar' id = '${prop[i].operationID}'>
                             <span class='r' id='${prop[i].recordID}'></span>
                    </div>`;
                }
                if (prop[i].queryID) {
                    query = `<form id="${prop[i].queryID}" class="query"></form>`;
                }
                div += `<div class="${type}">` + operation + query + `
                    <table id='${prop[i].tbID}' class='table'>
                    </table>
                    <div id='${prop[i].pagerID}'></div>` + '</div>';
            }

            return div;
        };
        this.createStep = function(components) {
            let stages = [];
            for (let i = 0; i < components.length; i++) {
                if (components[i].componentType === 'step') {
                    stages.push(components[i].stages);
                }
            }
            let step = '';
            for (let i= 0; i < stages[0].length; i++) {
                let stepContent = '';
                for (let j = 0; j < stages[0][i].value.length; j++) {
                    if (j !== stages[0][i].value.length - 1) {
                        stepContent += `<div class="steps-item steps-status-wait ${stages[0][i].id}-${j}">
                                            <div class="steps-tail">

                                            </div>
                                            <div class="steps-step">
                                                <div class="steps-head">
                                                    <svg class="icon steps-icon-${j + 1}" aria-hidden="true">
                                                        <use xlink:href="#icon-${j + 1}"></use>
                                                    </svg>
                                                </div>
                                                <div class="steps-main">
                                                    <span>${stages[0][i].value[j]}</span>
                                                </div>
                                             </div>
                                         </div>`;
                    } else {
                        stepContent += `<div class="${stages[0][i].id}-${j}">
                                            <div class="steps-step">
                                                <div class="steps-head">
                                                    <svg class="icon steps-icon-${j + 1}" aria-hidden="true">
                                                        <use xlink:href="#icon-${j + 1}"></use>
                                                    </svg>
                                                </div>
                                                <div class="steps-main">
                                                    <span>${stages[0][i].value[j]}</span>
                                                </div>
                                            </div>
                                        </div>`;
                    }
                }
                step += `<div id="${stages[0][i].id}" class="step ${stages[0][i].class}">` + stepContent + '</div>';
            }
            return '<div class="steps">' + step + '</div>';
        };
    };

    analysis.Analysis.prototype.analysisJson = async function(data) {
        if (data.templates.length > 0) {
           await this.analysisTemplate(data.templates);
           await this.analysisDataSource(data.templates, data.dataSource, data.additional);
        } else {
            console.log('json配置错误！');
        }
        this.oTemplates.controller = this.aController;
        return this.oTemplates;
    };
});
