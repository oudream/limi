/**
 * Created by liuchaoyu on 2016-12-01.
 */

var tree = {};


$(function () {

    startInit();
    toolLeftInit();
    toolRightInit();
    toolTopInit();
    workAreaInit();

    loadActions();
    btnClassInit();

    eventInit();

    loadEndInit();
});


var startInit = function () {

    /** 根据项目ID从后台下载页数据 */
    var projId = cjCommon.getUrlParam('proj_id');
    dataInteraction.db.downloadPages(projId,dataInteraction.pageDownloadReturn);

    dataInteraction.setCurProjectId(projId);

    dataInteraction.local.setModules('Simulated_dev',['car','traffic_light','train_carriage']);

    loadConfig();
};

var loadEndInit = function () {

    document.body.setAttribute('action_type', 'select');
    $('#select_tool').mousedown();

    positionAdjust();
};


var loadConfig = function () {

    var curConfig = mainPageFunc.base.loadConfig();
    if (cjCommon.isEmptyObject(curConfig) == true) {
        curConfig = cjCommon.clone(extendConfig.defaultConfig);

        mainPageFunc.base.saveConfig(curConfig);
    }

    mainPageFunc.base.setConfig(curConfig);
};

var eventInit = function () {

    uiManager.moduleLibManager.addEventListener();

};


var toolLeftInit = function () {

    var tabs = uiDrawing.plugin.tabs;

    function toolLeftTopInit () {

        var tabParams = {
            border : false,
            plain : true,
            fit : true,
            tabPosition : 'bottom',
            tabHeight: 25,
            tabWidth: 'auto',
            onSelect : function () {

            },
        };

        tabs.initTabs($('#list_tabs'),tabParams);
        tree.menu.initMenu($('#tree_menu'));

    }

    function toolLeftBotInit () {

        var leftBotTool = $('#left_bot_tools');
        var propertyPanel = $('#left_bot_tools #property_panel');
        var settingPropGrid = $('#setting_property_grid');

        propertyPanel.css('height',parseFloat(leftBotTool.css('height')));

        var settingPropColumns = [[
            {field:'title',title:'属性',width:100,align:'left',fixed:true,sortable:false,resizable:true},
            {field:'value',title:'值',width:100,align:'left',sortable:false,resizable:true}
        ]];

        var pgParam = {
            url: '',
            showGroup: true,
            scrollbarSize: 0,
            striped:true,
            fit:true,
            columns:settingPropColumns,

            onClickCell: function (index, field, value) {

                $(this).datagrid('beginEdit', index);
                var ed = $(this).datagrid('getEditor', {index:index,field:'value'});

                if (ed){
                    var t = $(ed.target);
                    var input = t.data('textbox') ? t.textbox('textbox') : t;
                    input.focus();
                }

                var currentEdatagrid = $(this);
                $('.datagrid-editable .textbox,.datagrid-editable .datagrid-editable-input,.datagrid-editable .textbox-text').bind('keydown', function(e){
                    var code = e.keyCode || e.which;
                    if(code == 13){
                        $(currentEdatagrid).datagrid('acceptChanges');
                        $(currentEdatagrid).datagrid('endEdit', index);

                        var pageId = uiDrawing.plugin.tabs.getSelectedTabId($('#main_tabs'));

                        uiManager.propManager.save(pageId);
                    }
                });

            }
        };

        var gridPanel = uiDrawing.plugin.propertyGrid.init(settingPropGrid,pgParam);

        uiManager.propManager.propObj = settingPropGrid;

        cjEvent.resize($('#left_tools'),function () {

            cjExtEasyui.datagrid.adjustColWidth(propertyPanel,'value',(parseInt(propertyPanel.css('width'),10) - 100 - 27));

            settingPropGrid.datagrid('resize');

            var width = $('.datagrid-view2 .datagrid-btable').css('width');
            $('.datagrid-group').css('width',width);
        });

    }


    toolLeftTopInit();
    toolLeftBotInit();

};

var toolRightInit = function () {

    var rightTool = $('#right_tools');
    var libAccordion = $('#lib_accordion');

    libAccordion.accordion({
        fit:true,
    });


    var panels = libAccordion.find('.accordion_panel');
    $.each(panels, function (index,p) {

        var modules = dataInteraction.local.getModules($(p).attr('name'));

        if (modules && modules.length > 0) {
            for (var i = 0; i < modules.length; i++) {

                var shapeDiv = cjCommon.createElement('div', {id:'lib_shape_' + modules[i], className: 'lib_shape'}, $(p).children());

                shapeDiv.addClass('lib_shape_no_press');

                var svg = document.createElementNS(svgedit.NS.SVG, 'svg');

                svg.setAttribute('width', '78px');
                svg.setAttribute('height', '78px');

                shapeDiv[0].appendChild(svg);

                var use_el = document.createElementNS(svgedit.NS.SVG, 'use');
                use_el.id = modules[i];

                //use_el.setAttribute('transform',"translate(5 5) scale(0.95)");

                //use_el.setAttribute('x','0');
                //use_el.setAttribute('y','0');
                var href = 'image/lib/' + $(p).attr('name') + '/' + modules[i] + '.svg#' + modules[i];
                var path = 'image/lib/' + $(p).attr('name') + '/' + modules[i] + '.svg';
                use_el.setAttributeNS(svgedit.NS.XLINK, 'xlink:href', '../' + href);
                svg.appendChild(use_el);

                shapeDiv[0].setAttribute('xlink_href',href);
                shapeDiv[0].setAttribute('shape_svg_path',path);

                shapeDiv.bind('mousedown', function (e) {

                    var clickShapeId = e.currentTarget.id;
                    var curShape = $('.lib_shape_press');

                    if (curShape.length > 0) {

                        if (clickShapeId == curShape.attr('id')) {
                            return;
                        }
                        else {
                            curShape.addClass('lib_shape_no_press').removeClass('lib_shape_press');
                        }

                    }

                    $(e.currentTarget).removeClass('lib_shape_no_press').addClass('lib_shape_press');

                });

            }
        }


    });



};

var toolTopInit = function () {

    (function toolBarInit (){

        var toolTop = $('#top_tools');

        var toolNew = $('#new_tool');
        var toolSave = $('#save_tool');
        var toolOpen = $('#open_tool');
        var toolSelect = $('#select_tool');
        var toolDelete = $('#delete_tool');
        var toolCopy = $('#copy_tool');
        var toolPaste = $('#paste_tool');
        var toolUndo = $('#undo_tool');
        var toolRedo = $('#redo_tool');


        cjCommon.createElement('div', {'className': 'btn-icon icon-new'}, toolNew);
        cjCommon.createElement('div', {'className': 'btn-icon icon-save'}, toolSave);
        cjCommon.createElement('div', {'className': 'btn-icon icon-open'}, toolOpen);
        cjCommon.createElement('div', {'className': 'btn-icon icon-select'}, toolSelect);
        cjCommon.createElement('div', {'className': 'btn-icon icon-delete'}, toolDelete);
        cjCommon.createElement('div', {'className': 'btn-icon icon-copy'}, toolCopy);
        cjCommon.createElement('div', {'className': 'btn-icon icon-paste'}, toolPaste);
        cjCommon.createElement('div', {'className': 'btn-icon icon-undo'}, toolUndo);
        cjCommon.createElement('div', {'className': 'btn-icon icon-redo'}, toolRedo);


    })();

};

var workAreaInit = function () {

    var tabParams = {
        border : false,
        plain : true,
        fit : true,
        tabPosition : 'top',
        tabHeight: 'auto',
        tabWidth: 'auto',

        onContextMenu: function (e, title,index) {
            e.preventDefault();




        },

        onSelect: function (title,index) {

            var name;
            if (cjString.isContain(title,'*') > -1) {
                name = title.replace(' *',"");
            }
            else {
                name = title;
            }

            var curProjId = dataInteraction.getCurProjectId();

            var projName = dataProcess.getNameById(curProjId,'proj');

            var id = dataProcess.getIdByName(name,'page',projName);

            uiManager.modManager.loadTree(id);
        },

        onBeforeClose : function(title,index){
            var target = this;

            var opts = $(target).tabs('options');

            var curTab = $(target).tabs('getTab',index);

            var tabOpts = curTab.panel('options');

            var pageObj = dataInteraction.local.getPage(tabOpts.id);

            if (pageObj.isChange == false) {
                return true;
            }

            var r = uiDrawing.dialog.message("\"" + pageObj.name + "\"页面修改未保存，关闭页面将会丢失，是否继续关闭？",true);

            if (r){
                var bc = opts.onBeforeClose;
                opts.onBeforeClose = function(){};  // allowed to close now
                $(target).tabs('close',index);
                opts.onBeforeClose = bc;  // restore the event function

                pageObj.isChange = false;
                pageObj.optType = [];
                pageObj.optRec = [];

                uiManager.modManager.clearTree();
                uiManager.propManager.clear();

                window.parent.dataStorage.cache.updateElement(pageObj);
            }
            return false;	// prevent from closing
        },
    };

    uiDrawing.plugin.tabs.initTabs($('#main_tabs'),tabParams);


};


var positionAdjust = function () {

    var mainDiv = $('#main_div');

    var toolTop = $('#top_tools');

    var toolLeft = $('#left_tools');

    var toolLeftTop = $('#left_top_tools');

    var workArea = $('#work_area');

    var pageTree = $('#pageTree');
    var moduleTree = $('#moduleTree');

    var tabPanel = $('#list_tabs .tabs-panels');


    tabPanel.bind('resize', function () {
        pageTree.css('height',parseInt(this.css('height')) - parseInt(pageTree.css('padding')) * 2);
    });

    toolLeft.css('height',parseInt(mainDiv.css('height')) - parseInt(toolTop.css('height')) - 7);
    workArea.css('height',parseInt(toolLeft.css('height')));

    pageTree.css('height',parseInt(tabPanel.css('height')) - parseInt(pageTree.css('padding')) * 2);
    moduleTree.css('height',parseInt(pageTree.css('height')));

    $(window).resize();

};



tree.menu = {

    initMenu: function (menuObj) {

        var _this = this;
        menuObj.menu({
            animate: true,
            hideOnUnhover: false,

            onClick: function (item) {
                if (item.id == 'menu_new') {
                    var treeId = item.target.getAttribute('parent_id');
                    var zTreeObj = $.fn.zTree.getZTreeObj(treeId);
                    _this.newPage(zTreeObj);
                }
                else if (item.id == 'menu_rename') {

                    var treeId = item.target.getAttribute('parent_id');
                    var zTreeObj = $.fn.zTree.getZTreeObj(treeId);
                    _this.renamePage(zTreeObj);
                }
                else if (item.id == 'menu_delete') {

                    var treeId = item.target.getAttribute('parent_id');
                    var zTreeObj = $.fn.zTree.getZTreeObj(treeId);
                    _this.deletePage(zTreeObj);
                }
            },

        });

    },

    newPage: function (treeObj) {
        uiManager.projManager.newPage(treeObj);
    },

    renamePage: function (treeObj) {

        uiManager.projManager.updatePageBefore(treeObj);

    },

    deletePage: function (treeObj) {

        uiManager.projManager.removePage(treeObj);

    }
};
