let templates = {
};

define && define(['jquery', 'jqGrid', 'jqGridConfig', 'panelConfig', 'action', 'uix-date', 'jqGridExtension', 'keyboard'], function($) {
    /**
     * 组件构造函数
     * @constructor
     */
    templates.Templates = function() {
        //执行sql
        this.loadSql = async function (sql) {
            let db = window.top.cjDb;
            let serverInfo = cacheOpt.get('server-config');
            let reqHost = serverInfo['server']['ipAddress'];
            let reqPort = serverInfo['server']['httpPort'];
            let reqParam = {
                reqHost: reqHost,
                reqPort: reqPort
            };
            return new Promise(function (resolve, reject) {
                db.load(sql, (e, v) => {
                    resolve(v);
                }, reqParam)
            })
        };
        // 获取用户登录名
        this.checkUser = function() {
            let user = sessionStorage.getItem('s_user');
            if (!user) {
                user = '未登录';
            }
            $('.header-user-name').append(user);
        };
        // 设置计时器
        this.setTimer = function() {
            let w;
            if (typeof(Worker)!=='undefined') {
                if (typeof(w) === 'undefined') {
                    w = new Worker('/common/cjs/components/time/timer.js');
                }
                let now
                w.onmessage = function(event) {
                    $('#header-login-state .header-time').html(event.data.local);
                    now = event.data.utc;
                };
                // this is debug code
                // let app = window.cc4k.app;
                // let pre = '';
                // setInterval(function () {
                //     if (pre === now) {
                //         app.sentHeartJumpEach(now, {"time":now,"state":"err"});
                //     } else {
                //         pre = now;
                //         app.sentHeartJumpEach(now, {"time":now,"state":"ok"});
                //     }
                //     app.registerReqHeartJumpCallback(function (resSession, resData) {
                //         console.info("ReqHeartJumpCallback.retrun - \n resSession: " + String(resSession) + "\nresData: " + JSON.stringify(resData));
                //     });
                // },5000)

            } else {
                alert('浏览器版本太低，请升级');
            }
        };
        // tab切换事件
        this.tabSwitch = function() {
            let index = document.querySelectorAll('.tabs-tab');
            let height = 0;
            let width = 0;
            for (let i = 0; i < index.length; i++) {
                if (i === 0) {
                    width = $('.tabIndex0').width();
                    height = $('.tabIndex0').height();
                } else {
                    $('.tabIndex' + i).width(width);
                    $('.tabIndex' + i).height(height);
                }
                $('#tabIndex' + i).click(function() {
                    $('#t-tab .tabs-tab').siblings('.tab-nav-active').removeClass('tab-nav-active');
                    $('#t-tab .tabs-panel').siblings('.tab-panel-active').removeClass('tab-panel-active');
                    $('#tabIndex' + i).addClass('tab-nav-active');
                    $('.tabIndex' + i).addClass('tab-panel-active');
                    $('#t-badge' + i).text('');
                });
            }
        };
        // 时间选择器设置
        this.setDate = function(data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].type === 'time') {
                    $('#dtp_input' + data[i].id).uixDate({
                        dateType: 'form_datetime', // form_datetime,form_date,form_time
                        readonly: false,
                        name: 'StartTime',
                        hideRemove: true,
                    });
                }
            }
        };
        // 调整页面大小
        this.resize = function() {
            let height = $(window).height() - $('#header').height() - $('#footer').height();
            $('#content').height(height);
            $(window).resize(this.debounce(function() {
                $('#content').height($(window).height() - $('#header').height() - $('#footer').height());
                let index = document.querySelectorAll('.tabs-tab');
                if (index) {
                    let height = 0;
                    let width = 0;
                    for (let i = 0; i < index.length; i++) {
                        if (i === 0) {
                            width = $('.tabIndex0').width();
                            height = $('.tabIndex0').height();
                        } else {
                            $('.tabIndex' + i).width(width);
                            $('.tabIndex' + i).height(height);
                        }
                    }
                }
            }, 100));
        };
        // 函数防抖
        this.debounce = function(fn, delay) {
            let timer = null;
            return function() {
                let context = this;
                let args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function() {
                    fn.apply(context, args);
                }, delay);
            };
        };
        // 调整表格大小
        this.tableResize = function(prop) {
            let tableId = prop.tbID;
            let parentBox = $('#gbox_' + tableId).parent();
            let gridBox = $('#' + tableId);
            gridBox.setGridWidth(parentBox.innerWidth() - 100);
            let height = parentBox.innerHeight() -
                $('#gbox_' + tableId + ' .ui-jqgrid-hdiv').outerHeight() -
                $('#' + prop.pagerID).outerHeight() -
                $('.toolbar').outerHeight() -
                25;
            if (parentBox.innerHeight() === 0) {
                height = 265;
            }
            gridBox.setGridHeight(height);
        };
        // 设置头部
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
            $('#header').empty();
            $('#header').append(html);
            this.checkUser();
            this.setTimer();
            $('#header-operation').append(components);
        };
        // 设置showPanel组件
        this.showPanel = function(html, style) {
            let div = '';
            if (style) {
                div = `<div id="show-panel" style="${style}"></div>`;
            } else {
                div = '<div id="show-panel"></div>';
            }
            if ($('#menu').length) {
                $('#menu').siblings().remove();
            } else {
                $('#show-panel').remove();
            }
            $('#content').append(div);
            $('#show-panel').append(html);
        };
        this.showPanelMultiColumn = function(html, style) {
            let div = '';
            if (style) {
                div = `<div id="showPanel-multiColumn" style="${style}"></div>`;
            } else {
                div = '<div id="showPanel-multiColumn"></div>';
            }

            $('#show-panel').append(div);
            $('#showPanel-multiColumn').append(html);
        };
        this.showPanelMultiLine = function(html, style) {
            let div = '';
            if (style) {
                div = `<div id="showPanel-multiLine" style="${style}"></div>`;
            } else {
                div = '<div id="showPanel-multiLine"></div>';
            }

            $('#show-panel').append(div);
            $('#showPanel-multiLine').append(html);
        };
        // 设置底部
        this.footer = function(html) {
            if (!html) {
                $('#footer').remove();
                this.resize();
            } else {
                let div = `<div id="footer-content">${html}</div>`;
                $('#footer-content').remove();
                $('#footer').append(div);
                this.resize();
            }
        };
        // 设置tab组件
        this.tab = function(html) {
            let div = '<div id="t-tab"></div>';
            if ($('#menu').length) {
                $('#menu').siblings().remove();
            } else {
                $('#t-tab').remove();
            }
            $('#content').append(div);
            $('#t-tab').append(html);
            this.tabSwitch();
        };
        // 表单功能按钮绑定
        this.btnBind = function(data, copyData, tbID, datas) {
            for (let i = 0; i < data.length; i++) {
                $('#' + data[i].id).unbind('click');
                $('#' + data[i].id).click(function() {
                    copyData = JSON.parse(sessionStorage.getItem('tablePriData'));
                    action.register(data[i], tbID, datas);
                });
            }
        };
        this.btnQueryBind = function(data) {
                $('.' + data.queryPanel.id+"-btn").unbind('click');
                $('.' + data.queryPanel.id+"-btn").click(function() {
                    let tbID = $('#' + data.tableProp.tbID);
                    let queryCfg = data.queryPanel.items;
                    let timeType;
                    for (let i = 0; i <queryCfg.length; i++) {
                        if (queryCfg[i].name === 'F_T') {
                            timeType = queryCfg[i].timeType || 'str';
                        }
                    }
                    $(document).off('jqGrid_gird_pager');
                    jqGridExtend.countNum(data.dataProp.loadSql, comAction.queryAction(data.queryPanel.id, timeType), data.dataProp.tableName, data.dataProp.group, Number(data.tableProp.showCount), data.tableProp.recordID);
                    jqGridExtend.paging(tbID, data.dataProp.loadSql, comAction.queryAction(data.queryPanel.id, timeType), data.dataProp.tableName, data.dataProp.group, data.dataProp.sort, Number(data.tableProp.showCount), data.tableProp.pagerID, data.tableProp.def);
                    jqGridExtend.pageBtn(tbID, data.dataProp.loadSql, data.dataProp.tableName, data.dataProp.sort, Number(data.tableProp.showCount), data.tableProp.pagerID, data.tableProp.recordID, data.tableProp.def);
                });
        };
        // 加载单表数据
        this.loadSingleTable = function(data) {
            $('.singleTable').width($('.singleTable').parent().width());
            $('.singleTable').height($('.singleTable').parent().height());
            let tbID = $('#' + data.tableProp.tbID);
            let copyData; // 表格原始数据
            let loadSql = '';
            let initSql = '';
            let group = null;
            let sort = null;
            let multi = data.tableProp.multi;
            let num = Number(data.tableProp.showCount);
            if (data.operationPanel !== undefined) {
                let operationData = data.operationPanel.items;
                if (operationData !== null) {
                    panelConfig.operationPanelInit(data.operationPanel.id, operationData);
                    this.btnBind(operationData, copyData, tbID, data);
                }
            }
            if (data.queryPanel) {
                let queryData = data.queryPanel.items;
                panelConfig.queryPanelInit(data.queryPanel.id, queryData);
                this.setDate(queryData);
                this.btnQueryBind(data);
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
                $(document).off('jqGrid_gird_' + data.tableProp.pagerID);
                jqGridConfig.multiSelectTableInit(tbID, data.tableProp.def, data.tableProp.pagerID);
            } else {
                $(document).off('jqGrid_gird_' + data.tableProp.pagerID);
                jqGridConfig.tableInit(tbID, data.tableProp.def, data.tableProp.pagerID);
            }
            this.tableResize(data.tableProp);
            jqGridExtend.countNum(loadSql, data.dataProp.filter, data.dataProp.tableName, group, num, data.tableProp.recordID);
            jqGridExtend.paging(tbID, initSql, data.dataProp.filter, data.dataProp.tableName, group, sort, num, data.tableProp.pagerID, data.tableProp.def);
            jqGridExtend.pageBtn(tbID, loadSql, data.dataProp.tableName, sort, num, data.tableProp.pagerID, data.tableProp.recordID, data.tableProp.def);
        };
        this.loadRtTable = async function(data) {
            $('.rtTable').width($('.rtTable').parent().width());
            $('.rtTable').height($('.rtTable').parent().height());
            let tbID = $('#' + data.tableProp.tbID);
            let multi = data.tableProp.multi;
            if (multi) {
                $(document).off('jqGrid_gird_' + data.tableProp.pagerID);
                jqGridConfig.multiSelectTableInit(tbID, data.tableProp.def, data.tableProp.pagerID);
            } else {
                $(document).off('jqGrid_gird_' + data.tableProp.pagerID);
                jqGridConfig.tableInit(tbID, data.tableProp.def, data.tableProp.pagerID);
            }
            this.tableResize(data.tableProp);
            let oTable = {};
            let aTable = [];
            let aDatas = await this.loadSql(data.dataProp.loadSql);
            let count = 0;
            let timer = setInterval(function () {
                let aRtData = window.rtData;  //700
                let jqGridTable = tbID;
                let oRtData = {};
                let oPreRtData = {};
                for(let i =0; i < aRtData.length; i++) {
                    oRtData[aRtData[i].code] = aRtData[i].value;
                }
                if (count === 0) {
                    for (let j = 0; j < aDatas.length; j++) {  //200
                        if (oRtData[aDatas[j].SignalUrl]) {
                            oTable['ID'] = j;
                            let temp = aDatas[j].SignalNo;
                            oTable['neNo'] = temp.toString(16);
                            oTable['code'] = aDatas[j].SignalUrl;
                            oTable['name'] = aDatas[j].SignalName;
                            oTable['value'] = oRtData[aDatas[j].SignalUrl];
                            aTable.push(oTable);
                            oTable = {};
                        }
                    }
                    oPreRtData = Object.assign({},oRtData);
                    $('#'+ data.tableProp.pagerID).text('共' + aTable.length + '条记录');
                    jqGridTable.jqGrid('clearGridData');
                    for (let j = 0; j < aTable.length; j++) {
                        jqGridTable.jqGrid('addRowData', j + 1, aTable[j]);
                    }
                } else {
                    let jsonName = sessionStorage.getItem('jsonName');
                    if (jsonName !== 'rtData') {
                        clearInterval(timer)
                    } else {
                        for (let j = 0; j < aDatas.length; j++) {  //200
                            if (oRtData[aDatas[j].SignalUrl] !== oPreRtData[aDatas[j].SignalUrl]) {
                                jqGridTable.jqGrid('setCell', j+1, 'value', oRtData[aDatas[j].SignalUrl]);
                            }
                        }
                        oPreRtData = Object.assign({},oRtData);
                    }
                }
                count++;
            },3000);
        };
        // 加载主从表数据
        this.loadAssociationTable = function(data) {
            let primaryTable = data.primaryTable;
            let secondaryTable = data.secondaryTable;
            if (primaryTable.tableProp.permutation) {
                if (primaryTable.tableProp.permutation === 'hori') {
                    $('.associationTable').width($('.associationTable').parent().width());
                    $('.associationTable').height($('.associationTable').parent().height()/2);
                } else {
                    $('.associationTable').parent().css('flex-direction', 'row');
                    $('.associationTable').parent().css('align-items', 'start');
                    $('.associationTable').width($('.associationTable').parent().width()/2);
                    $('.associationTable').height($('.associationTable').parent().height());
                }
            }
            let primaryID = $('#' + primaryTable.tableProp.tbID);
            let secondaryID = $('#' + secondaryTable.tableProp.tbID);
            let secondaryObj = {
                connection: secondaryTable.dataProp.connection,
                loadTBDataChild: function(sel) {
                    let secondarySql = secondaryTable.dataProp.loadSql + sel;
                    if (secondaryTable.dataProp.loadMulti) {
                        jqGridExtend.loadTable(secondaryTable.tableProp, secondarySql);
                    } else {
                        jqGridExtend.countNum(secondarySql, secondaryTable.dataProp.filter, secondaryTable.dataProp.tableName, group, num, secondaryTable.tableProp.recordID);
                        jqGridExtend.paging(secondaryID, secondarySql, secondaryTable.dataProp.filter, secondaryTable.dataProp.tableName, group, sort, num, secondaryTable.tableProp.pagerID, secondaryTable.tableProp.def);
                        jqGridExtend.pageBtn(secondaryID, secondarySql, secondaryTable.dataProp.tableName, sort, num, secondaryTable.tableProp.pagerID, secondaryTable.tableProp.recordID, secondaryTable.tableProp.def);
                    }
                },
            };
            let copyData; // 表格原始数据
            let loadSql = '';
            let initSql = '';
            let group = null;
            let sort = null;
            let primaryMulti = primaryTable.tableProp.multi;
            let secondaryMulti = secondaryTable.tableProp.multi;
            let num = Number(primaryTable.tableProp.showCount);
            if (primaryTable.operationPanel !== undefined) {
                let operationData = primaryTable.operationPanel.items;
                if (operationData !== null) {
                    panelConfig.operationPanelInit(primaryTable.operationPanel.id, operationData);
                    this.btnBind(operationData, copyData, primaryID, primaryTable.dataProp.tableName, primaryTable.tableProp.def);
                }
            }
            if (secondaryTable.operationPanel !== undefined) {
                let operationData = secondaryTable.operationPanel.items;
                if (operationData !== null) {
                    panelConfig.operationPanelInit(secondaryTable.operationPanel.id, operationData);
                    this.btnBind(operationData, copyData, secondaryID, secondaryTable.dataProp.tableName, secondaryTable.tableProp.def);
                }
            }
            if (primaryTable.queryPanel) {
                let queryData = primaryTable.queryPanel.items;
                panelConfig.queryPanelInit(primaryTable.queryPanel.id, queryData);
                this.setDate(queryData);
            }
            if (secondaryTable.queryPanel) {
                let queryData = secondaryTable.queryPanel.items;
                panelConfig.queryPanelInit(secondaryTable.queryPanel.id, queryData);
                this.setDate(queryData);
            }
            if (primaryTable.dataProp.loadSql) {
                loadSql = primaryTable.dataProp.loadSql;
            }
            if (primaryTable.dataProp.initSql) {
                initSql = primaryTable.dataProp.initSql;
            } else {
                initSql = primaryTable.dataProp.loadSql;
            }
            if (primaryTable.dataProp.sort) {
                sort = primaryTable.dataProp.sort;
            }
            if (primaryTable.dataProp.group) {
                group = primaryTable.dataProp.group;
            }

            if (primaryMulti) {
                jqGridConfig.multiSelectTableInit(primaryID, primaryTable.tableProp.def, primaryTable.tableProp.pagerID);
            } else {
                jqGridConfig.tableInit(primaryID, primaryTable.tableProp.def, primaryTable.tableProp.pagerID, secondaryObj);
            }
            if (secondaryMulti) {
                jqGridConfig.multiSelectTableInit(secondaryID, secondaryTable.tableProp.def, secondaryTable.tableProp.pagerID);
            } else {
                jqGridConfig.tableInit(secondaryID, secondaryTable.tableProp.def, secondaryTable.tableProp.pagerID);
            }
            this.tableResize(primaryTable.tableProp);
            this.tableResize(secondaryTable.tableProp);
            jqGridExtend.countNum(loadSql, primaryTable.dataProp.filter, primaryTable.dataProp.tableName, group, num, primaryTable.tableProp.recordID);
            jqGridExtend.paging(primaryID, initSql, primaryTable.dataProp.filter, primaryTable.dataProp.tableName, group, sort, num, primaryTable.tableProp.pagerID, primaryTable.tableProp.def);
            jqGridExtend.pageBtn(primaryID, loadSql, primaryTable.dataProp.tableName, sort, num, primaryTable.tableProp.pagerID, primaryTable.tableProp.recordID, primaryTable.tableProp.def);
        };
        // 设置单表
        this.singleTable = function(dataArr) {
            for (let i = 0; i < dataArr.length; i++) {
                this.loadSingleTable(dataArr[i]);
            }
        };
        this.rtTable = function(dataArr) {
            for (let i = 0; i < dataArr.length; i++) {
                this.loadRtTable(dataArr[i]);
            }
        };
        // 设置主从表
        this.associationTable = function(dataArr) {
            for (let i = 0; i < dataArr.length; i++) {
                this.loadAssociationTable(dataArr[i]);
            }
        };
    };

    templates.Templates.prototype.render = function(obj, flag) {
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
                this.showPanel(obj.showPanel.components, obj.showPanel.style);
                break;
            case 'showPanelMultiColumn':
                this.showPanelMultiColumn(obj.showPanelMultiColumn.components, obj.showPanelMultiColumn.style);
                break;
            case 'showPanelMultiLine':
                this.showPanelMultiLine(obj.showPanelMultiLine.components, obj.showPanelMultiLine.style);
                break;
            case 'footer':
                this.footer(obj.footer.components);
                break;
            case 'tab':
                this.tab(obj.tab.components);
                break;
            case 'singleTable':
                this.singleTable(obj.singleTable.components);
                break;
            case 'rtTable':
                this.rtTable(obj.rtTable.components);
                break;
            case 'associationTable':
                this.associationTable(obj.associationTable.components);
                break;
            default:
                break;
            }
        }
        if (obj.controller.length) {
            for (let i = 0; i < obj.controller.length; i++) {
                let script = document.createElement('script');
                script.type = 'text/javascript';
                script.src =obj.controller[i];
                document.getElementsByTagName('html')[0].appendChild(script);
            }
        }
        if (flag) {
            let keyBord = new keybord.Init();
            keyBord.create();
        }
    };
});
