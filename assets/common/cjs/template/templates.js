let templates = {
};

define && define(['jquery', 'jqGrid', 'jqGridConfig', 'panelConfig', 'jqGridExtension'], function($) {
    /**
     * 组件构造函数
     * @constructor
     */
    templates.Templates = function() {
        this.checkUser = function() {
            let user = sessionStorage.getItem('s_user');
            if (!user) {
                user = '未登录';
            }
            $('.header-user-name').append(user);
        };
        this.setTimer = function() {
            let w;
            if (typeof(Worker)!=='undefined') {
                if (typeof(w) === 'undefined') {
                    w = new Worker('/common/cjs/components/time/timer.js');
                }
                w.onmessage = function(event) {
                    $('#header-login-state .header-time').html(event.data);
                };
            } else {
                alert('浏览器版本太低，请升级');
            }
        };
        this.tabSwitch = function() {
            let index = document.querySelectorAll('.tabs-tab');
            for (let i = 0; i < index.length; i++) {
                $('#tabIndex' + i).click(function() {
                    $('#t-tab .tabs-tab').siblings('.tab-nav-active').removeClass('tab-nav-active');
                    $('#t-tab .tabs-panel').siblings('.tab-panel-active').removeClass('tab-panel-active');
                    $('#tabIndex' + i).addClass('tab-nav-active');
                    $('.tabIndex' + i).addClass('tab-panel-active');
                });
            }
        };
        this.resize = function() {
            let height = $(window).height() - $('#header').height() - $('#footer').height();
            $('#content').height(height);
            $(window).resize(function() {
                $('#content').height($(window).height() - $('#header').height() - $('#footer').height());
            });
        };
        this.tableResize = function(tbID) {
            let tableId = tbID;
            let parentBox = $('#gbox_tbList').parent();
            let gridBox = $('#' + tableId);
            gridBox.setGridWidth(parentBox.innerWidth() - 100);
            let height = parentBox.innerHeight() -
                $('#gbox_' + tableId + ' .ui-jqgrid-hdiv').outerHeight() -
                $('#pager').outerHeight() -
                $('.toolbar').outerHeight() -
                100;
            if (parentBox.innerHeight() === 0) {
                height = 265;
            }
            gridBox.setGridHeight(height);
        };
        this.header = function(msg, components) {
            let html = `<div id="header-operation">

                        </div>
                        <div id="header-title">
                            ${msg}
                        </div>
                        <div id="header-login-state">
                            <div class="header-user-photo">
                                <svg class="icon header-user-icon" aria-hidden="true">
                                     <use xlink:href="#icon-user"></use>
                                </svg>
                            </div>
                            <div class="header-user-inf">
                                <div class="header-user-name"></div>
                                <div class="header-time"></div>
                            </div>
                        </div>`;
            $('#header').append(html);
            this.checkUser();
            this.setTimer();
            $('#header-operation').append(components);
        };
        this.showPanel = function(html) {
            let div = '<div id="show-panel"></div>';
            $('#content').append(div);
            $('#show-panel').append(html);
        };
        this.footer = function(html) {
            let div = `<div id="footer-content">${html}</div>`;
            $('#footer').append(div);
            this.resize();
        };
        this.tab = function(html) {
            let div = '<div id="t-tab"></div>';
            $('#content').append(div);
            $('#t-tab').append(html);
            this.tabSwitch();
        };
        this.loadTable = function(data) {
            let tbID = $('#' + data.tableProp.tbID);
            let copyData; // 表格原始数据
            let loadSql = '';
            let initSql = '';
            let group = null;
            let sort = null;
            let multi = data.tableProp.multi;
            let operationData = data.operationPanel.items;
            let num = Number(data.tableProp.showCount);
            if (data.operationPanel !== undefined) {
                if (operationData !== null) {
                    panelConfig.operationInit(data.operationPanel.id, operationData);
                    // btnBind(operationData);
                }
            }
            if (data.dataProp.loadSql) {
                loadSql = data.dataProp.loadSql;
            }
            if (data.dataProp.initSql) {
                initSql = data.dataProp.initSql;
            } else {
                initSql = data.dataProp.loadSql;
            }
            if (data.dataProp.sort) {
                sort = data.dataProp.sort;
            }
            if (data.dataProp.group) {
                group = data.dataProp.group;
            }

            if (multi) {
                jqGridConfig.multiSelectTableInit(tbID, data.tableProp.def, data.tableProp.pagerID);
            } else {
                jqGridConfig.tableInit(tbID, data.tableProp.def, data.tableProp.pagerID);
            }
            this.tableResize(data.tableProp.tbID);
            jqGridExtend.countNum(loadSql, data.dataProp.filter, data.dataProp.tableName, group, num, data.tableProp.recordID);
            jqGridExtend.paging(tbID, initSql, data.dataProp.filter, data.dataProp.tableName, group, sort, num, data.tableProp.pagerID, data.tableProp.def);
            jqGridExtend.pageBtn(tbID, loadSql, data.dataProp.tableName, sort, num, data.tableProp.pagerID, data.tableProp.recordID, data.tableProp.def);
        };
        this.table = function(dataArr) {
            for (let i = 0; i < dataArr.length; i++) {
                this.loadTable(dataArr[i]);
            }
        };
    };

    templates.Templates.prototype.render = function(obj) {
        this.resize();
        let aNames = [];
        for (let key in obj) {
            aNames.push(key);
        }
        for (let i = 0; i < aNames.length; i++) {
            switch (aNames[i]) {
            case 'header':
                this.header(obj.header.value[0], obj.header.components);
                break;
            case 'showPanel':
                this.showPanel(obj.showPanel.components);
                break;
            case 'footer':
                this.footer(obj.footer.components);
                break;
            case 'tab':
                this.tab(obj.tab.components);
                break;
            case 'table':
                this.table(obj.table.components);
                break;
            default:
                break;
            }
        }
    };
});
