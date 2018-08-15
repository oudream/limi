/**
 * Created by nielei on 2018/6/25.
 */
let analysis = {

};
'use strict';
define(['jquery', 'global', 'async', 'modal', 'action', 'cjcommon', 'cjstorage', 'cjdatabaseaccess', 'cjajax', 'utils', 'cache'], function($, g, async) {
    analysis.Analysis = function() {
        let serverInfo = cacheOpt.get('server-config');
        this.oTemplates = {};
        this.db = window.top.cjDb;
        this.gReqParam = {
            reqHost: serverInfo['server']['ipAddress'],
            reqPort: serverInfo['server']['httpPort'],
        };

        this.analysisTemplate = function(template) {
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
                additional['next'] = '#';
            }
            if (!additional.action) {
                additional['action'] = '';
            }
            return additional;
        };
        this.analysisDataSource = function(templates, dataSource, additional) {
            for (let i = 0; i < templates.length; i++) {
                let aValue = [];
                if (dataSource[templates[i]].type) {
                    switch (dataSource[templates[i]].type) {
                    case 'const':
                        aValue = dataSource[templates[i]].value;
                        break;
                    default:
                        aValue = null;
                        break;
                    }
                    this.oTemplates[templates[i]]['value'] = aValue;
                }
                if ((dataSource[templates[i]].components)) {
                    this.oTemplates[templates[i]]['components'] = this.analysisComponents(dataSource[templates[i]].components, additional);
                }
                if (templates[i] === 'tab') {
                    this.oTemplates[templates[i]]['components'] = this.analysisTab(dataSource[templates[i]].tabPanel, aValue, additional);
                }
                if (templates[i] === 'table') {
                    this.oTemplates[templates[i]]['components'] = this.analysisTable(dataSource[templates[i]]);
                }
            }
        };
        this.analysisComponents = function(components, additional) {
            let html = '';
            for (let i =0; i < components.length; i++) {
                let aValue = [];
                let aClass = [];
                switch (components[i].type) {
                case 'const':
                    aValue = components[i].value;
                    if (components[i].class) {
                        aClass = components[i].class;
                    }
                    break;
                default:
                    break;
                }
                switch (components[i].componentType) {
                case 'text':
                    html += this.createText(aValue, aClass, additional);
                    break;
                case 'input':
                    html += this.createInput(aValue, aClass, additional, components[i].attr);
                    break;
                case 'btn':
                    html += this.createBtn(aValue, aClass, additional);
                    break;
                case 'menu':
                    html += this.createMenu(aValue, aClass, additional);
                    break;
                case 'rt-text':
                    html += this.createRtText(aValue, aClass, additional);
                    break;
                case 'table':
                    html = this.createTable(components[0].prop);
                    break;
                default:
                    break;
                }
            }
            return html;
        };
        this.analysisInputAttr = function(attr, value, cla, styles) {
            let label = '';
            let icon = '';
            let input = '';
            if (attr.label) {
                label = `<label for="${cla}">${value}</label>`;
            }
            if (attr.icon) {
                icon = `<span class="input-icon">
                            <svg class="icon input-${attr.icon}" aria-hidden="true">
                                 <use xlink:href="#${attr.icon}"></use>
                            </svg>
                        </span>`;
            }
            switch (attr.type) {
            case 'text':
                input = `<input type="text" id="${cla}" class="t-input ${cla}" placeholder="${value}" style="${styles}"/>`;
                break;
            case 'password':
                input = `<input type="password" id="${cla}" class="t-input ${cla}" placeholder="${value}" style="${styles}"/>`;
                break;
            case 'num':
                input = `<input type="number" id="${cla}" class="t-input ${cla}" placeholder="${value}" style="${styles}"/>`;
                break;
            default:
                input = `<input type="text" id="${cla}" class="t-input ${cla}" placeholder="${value}" style="${styles}"/>`;
                break;
            }
            return label + icon + input;
        };
        this.analysisTab = function(aTabPanel, aVal, additional) {
            let li = '';
            let tabContent = '';
            let div = '';
            for (let i = 0; i < aVal.length; i++) {
                if (i === 0) {
                    li += `<li class="tabs-tab tab-nav-active" id="tabIndex${i}">${ aVal[i] }<span class="t-badge"></span></li>`;
                } else {
                    li += `<li class="tabs-tab" id="tabIndex${i}">${ aVal[i] }<span class="t-badge">5</span></li>`;
                }
            }
            for (let i = 0; i < aTabPanel.length; i++) {
                tabContent = this.analysisComponents(aTabPanel[i].components, additional);
                if (i === 0) {
                    div += `<div class="tabs-panel tab-panel-active tabIndex${i}">` + tabContent + '</div>';
                } else {
                    div += `<div class="tabs-panel tabIndex${i}">` + tabContent + '</div>';
                }
            }
            return '<ul class="tabs-nav">' + li + '</ul><div class="tabs-content">' + div + '</div>';
        };
        this.analysisTable = function(dataObj) {
            return dataObj;
        };

        this.createText = function(aVal, aClass, additional) {
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
            return span;
        };
        this.createInput = function(aVal, aClass, additional, attr) {
            let input = '';
            let div = '';
            for (let i = 0; i < aVal.length; i++) {
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
            return div;
        };
        this.createBtn = function(aVal, aClass, additional) {
            let btn = '';
            for (let i = 0; i < aVal.length; i++) {
                if (aClass[i]) {
                    if (additional[aClass[i]]) {
                        let oAdditional = this.analysisAdditional(additional[aClass[i]]);
                        let sAdditional = JSON.stringify(oAdditional).replace(/"/g, '&quot;');
                        let style = this.analysisStyle(oAdditional.style);
                        btn += `<a href="${oAdditional.next}" class="t-btn ${aClass[i]}" style="${style}" onclick="action.register(${sAdditional})">${aVal[i]}</a>`;
                    } else {
                        btn += `<a class="t-btn">${aVal[i]}</a>`;
                    }
                }
            }
            return '<div style="display: flex; margin-top: 30px;">' + btn + '</div>';
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
                        menu += `<div class="t-icon-menu">
                                    <svg class="icon t-icon-menu" aria-hidden="true">
                                        <use xlink:href="#icon-menu"></use>
                                    </svg>
                                 </div>`;
                    }
                }
            }
            $.getJSON('/ics/' + projectName + '/config/menu/menu.json', function(data) {
                // todo 增加二级菜单
                let arr = data.data;
                let menuContent = '';
                for (let i = 0; i < arr.length; i++) {
                    menuContent += `<li><a href="${arr[i].url}"><svg class="icon t-icon-menuContent" aria-hidden="true">
                                        <use xlink:href="#icon-${arr[i].icon}"></use>
                                    </svg>${arr[i].name}</a></li>`;
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
                            span += `<div class="${aClass[i]}" style="${style}"><span>${arr[0]}</span><span class="rt-${aClass[i]}" style="${rtStyle}">10</span><span>${arr[1]}</span></div>`;
                        } else {
                            span += `<div class="${aClass[i]}" style="${style}"><span>${arr[0]}</span><span class="rt-${aClass[i]}" style="${rtStyle}"></span></div>`;
                        }
                    } else {
                        if (arr[1]) {
                            span += `<div class="${aClass[i]}"><span>${arr[0]}</span><span class="rt-${aClass[i]}"></span><span>${arr[1]}</span></div>`;
                        } else {
                            span += `<div class="${aClass[i]}"><span>${arr[0]}</span><span class="rt-${aClass[i]}"></span></div>`;
                        }
                    }
                }
            }
            return span;
        };
        this.createTable = function(prop) {
            return `<div class='toolbar' id = '${prop.operationID}'>
                             <span class='r' id='${prop.recordID}'></span>
                    </div>
                    <table id='${prop.tbID}' class='table'>
                    </table>
                    <div id='${prop.pagerID}'></div>`;
        };
    };

    analysis.Analysis.prototype.analysisJson = function(data) {
        if (data.templates.length > 0) {
            this.analysisTemplate(data.templates);
            this.analysisDataSource(data.templates, data.dataSource, data.additional);
        } else {
            console.log('json配置错误！');
        }
        return this.oTemplates;
    };
});
