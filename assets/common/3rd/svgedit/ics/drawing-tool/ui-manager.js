/**
 * Created by liuchaoyu on 2016-11-10.
 *
 * ui-manager.js
 *
 * 界面上的管理，
 */

var uiManager = {
    'version' : '1.0.0',

    'projManager' : {},
    'modManager' : {},
    'toolBtnManager' : {},
    'workAreaManager' : {},
    'propManager' : {},
    'moduleLibManager' : {},
    'baseFunction' : {},
    'cache' : {},
};


uiManager.projManager.newPage = function (treeObj) {

    var curProjId = dataInteraction.getCurProjectId();
    var retObj = dataInteraction.getAvailableIdAndTime('page');
    var name = dataInteraction.getAvailableName('page');

    var pageObj = new Page(retObj.id,name,curProjId,retObj.curTime,"","",[],"");

    dataInteraction.local.addPage(pageObj);

    var tree = uiDrawing.plugin.tree;

    var zTreeObj = (treeObj) ? treeObj : uiManager.projManager.zTreeObj;

    var parentNode = zTreeObj.getNodesByFilter(
        function (node) {
            return (node.id == curProjId);
        },
        true);

    var node = tree.newTreeNode(pageObj.id,name,null,null,null,pageObj.svg_path,null);

    tree.appendNode(zTreeObj,parentNode,node);
    tree.selectNode(zTreeObj,pageObj.id);

    this.updatePageBefore(zTreeObj);

};

uiManager.projManager.openPage = function (id) {
    var pageObj = dataInteraction.local.getPage(id);

    //var url = "../../editor/svg-editor.html";
    var url = "../svg-workarea/svg-workarea.html";
    var content = '<iframe id="frame_' + id + '" name="' + id + '" class="frame_panel" src="' + url + '?page_id=' + id + '"></iframe>';

    var tabObj = {
        id: id,
        title: pageObj.name,
        content: content,
        iconCls: null,
        //width:,
        //height:,
        closable: true,
        selected: true,
    };

    uiDrawing.plugin.tabs.newTab($('#main_tabs'),tabObj);

};


uiManager.projManager.removePage = function (treeObj) {

    //var selectedNode = treeObj.tree('getSelected');

    var nodes = treeObj.getSelectedNodes();
    var selectedNode = nodes[0];

    uiDrawing.plugin.tree.removeNode(treeObj,selectedNode);

    uiDrawing.plugin.tabs.closeTab($('#main_tabs'),selectedNode.text);

    var pageObj = dataInteraction.local.getPage(selectedNode.id);

    dataInteraction.local.removePage(pageObj);
};

uiManager.projManager.updatePageBefore = function (treeObj) {

    /** EasyUI */
    //var selectedNode = treeObj.tree('getSelected');
    //
    //if (!selectedNode.children) {
    //    treeObj.tree('beginEdit', selectedNode.target);
    //}

    var nodes = treeObj.getSelectedNodes();
    var selectedNode = nodes[0];
    if (!selectedNode.children) {
        treeObj.editName(selectedNode);
    }
};


uiManager.projManager.updatePageAfter = function (treeObj,node,newName) {

    var pageObjs = dataInteraction.local.getPages();

    //function reEditNode (tree) {
    //    //var orgAeFunc = tree.setting.callback.onRename;
    //    //tree.setting.callback.onRename = null;
    //
    //    //uiManager.projManager.updatePageBefore(tree);
    //
    //    tree.editName(node);
    //
    //    //setTimeout(function () {
    //    //    tree.setting.callback.onRename = orgAeFunc;
    //    //},10);
    //
    //}

    /** 非法字符集 */
    var illegalChars = ["*",","," "];

    if (cjString.isContain(newName,illegalChars) > -1) {

        var illegalStr = "";
        $.each(illegalChars,function (index,value) {
            illegalStr += "\"" + value + "\"、 ";
        });

        uiDrawing.dialog.message("不能含有 [" + illegalStr + "] 等特殊字符！！！",false);

        //treeObj.cancelEditName();

        //reEditNode(treeObj);

        return false;
    }

    if (node.name != newName && dataProcess.hasRepeatName(newName,pageObjs) == true) {

        uiDrawing.dialog.message("\"" + newName + "\"" + " 已存在，请使用其它名字",false);

        //treeObj.cancelEditName();

        //reEditNode(treeObj);

        return false;

    }
    else if (node.name == newName) {

        return true;
    }

    //uiDrawing.plugin.tree.updateNode(treeObj,node);

    var pageObj = dataInteraction.local.getPage(node.id);

    var oldName = pageObj.name;

    pageObj.name = newName;

    dataInteraction.local.updatePage(pageObj);

    uiDrawing.plugin.tabs.updTab($('#main_tabs'),oldName,{'title':newName});

    return true;

};


uiManager.modManager.loadTree = function (pageId) {

    var tree = uiDrawing.plugin.tree;

    var treeObj = $('#moduleTree');

    var page = dataInteraction.local.getPage(pageId);

    var frameWindow = document.getElementById('frame_' + pageId).contentWindow;

    if (frameWindow.svgWorkArea == undefined) {
        return false;
    }

    var svgContentNode = frameWindow.svgWorkArea.getSVGContentNode();

    var buildUpTreeData = uiManager.modManager.buildUpTreeData = function (parent) {

        var subElems = parent.children(':not(defs)');

        var childNodes = [];

        for (var i = 0; i < subElems.length; i++) {

            var elem = subElems[i];

            if (elem.nodeName == 'g') {
                var node = buildUpTreeData($(elem));
            }
            else {
                if (cjString.isContain(elem.id,'hide-') == -1) {
                    var node = tree.newTreeNode(elem.id, elem.id, null, null, null, null, null);
                }
                else {
                    var node = undefined;
                }

            }

            if (node) {
                childNodes.push(node);
            }

        }

        var parentNode = tree.newTreeNode(parent[0].id, parent[0].id, null, null, null, null, childNodes);

        return parentNode;
    }

    var svgRootNode = buildUpTreeData($(svgContentNode));

    var treeRootNode = tree.newTreeNode(pageId, page.name, null, null, null, null, svgRootNode.children);

    var treeData = [treeRootNode];

    var treeParam = {
        setting:{
            view:{
                showLine: false,
                selectedMulti:false,
                expandSpeed: 0
            },
            callback: {
                onRightClick: function (event, treeId, treeNode) {

                },
                onClick: function (event, treeId, treeNode) {

                    frameWindow.svgWorkArea.setSelectElem(treeNode.id);

                }
            }
        },

        nodes:treeData,
        extSetting:{
            expandAll: true,
        }
    };


    //var treeParam = {
    //    data: treeData,
    //    animate: true,
    //    lines: false,
    //    onDblClick: function (node) {
    //        //if (node.children && node.children.length > 0) {
    //        //    treeObj.tree('expand', node.target);
    //        //}
    //        ////var url = node["target_url"];
    //        //var id = node["id"];
    //        //if (id != undefined && id != null && id.length > 0) {
    //        //    uiManager.projManager.openPage(id);
    //        //}
    //    },
    //
    //    onAfterEdit: function (node) {
    //
    //        //uiManager.projManager.updatePageAfter(treeObj,node);
    //
    //    },
    //
    //    onContextMenu: function (e, node) {
    //        e.preventDefault();
    //
    //        //treeObj.tree('select', node.target);
    //        //
    //        //$('#tree_menu').menu('show', {
    //        //    left: e.pageX,
    //        //    top: e.pageY
    //        //});
    //
    //    }
    //
    //};

    //todo 待解决，如何判断SVG CONTENT没改变的时候，模块树不刷新
    //function isSvgContentChange () {
    //
    //    var nodes = uiDrawing.plugin.tree.getNodes(uiManager.modManager.zTreeObj);
    //
    //    return false;
    //}

    uiManager.modManager.clearTree(treeObj);

    uiManager.modManager.zTreeObj = uiDrawing.plugin.tree.init(treeObj,treeParam);

};


uiManager.modManager.addItem = function (id) {

    var mainTab = $('#main_tabs');

    var tab = mainTab.tabs('getSelected');

    var opts = tab.panel('options');

    var pageId = opts.id;

    var pageName = opts.title;

    var frameWindow = document.getElementById('frame_' + pageId).contentWindow;

    var elemNode = frameWindow.svgWorkArea.getElem(id);

    var newNode = uiManager.modManager.buildUpTreeData($(elemNode));

    var zParentNode = uiDrawing.plugin.tree.getNodes(uiManager.modManager.zTreeObj,'single',pageId);

    var zNodes = uiManager.modManager.zTreeObj.addNodes(zParentNode,newNode);

    uiManager.modManager.zTreeObj.expandNode(zNodes[0],true,true);

};


uiManager.modManager.removeItem = function (id) {

    var node = uiDrawing.plugin.tree.getNodes(uiManager.modManager.zTreeObj,'single',id);

    uiManager.modManager.zTreeObj.removeNode(node);

};



uiManager.modManager.selectItem = function (id) {

    uiDrawing.plugin.tree.selectNode(uiManager.modManager.zTreeObj,id);

};

uiManager.modManager.unSelectItem = function () {

    uiDrawing.plugin.tree.unSelectNode(uiManager.modManager.zTreeObj);

};


uiManager.modManager.clearTree = function () {

    var treeObj;
    if (arguments[0]) {
        treeObj = arguments[0];
    }
    else {
        treeObj = $('#moduleTree');
    }

    var treeParam = {
        data: [],
        animate: true,
        lines: false,
    };

    uiDrawing.plugin.tree.init(treeObj,treeParam);

};




uiManager.toolBtnManager.clickSave = function () {

    /** 保存前提示弹窗 */
    var msg_r = uiDrawing.dialog.message("保存所有页面，是否继续？",true);

    if (!msg_r) return false;


    var curProjId = dataInteraction.getCurProjectId();

    var pageObjs = dataInteraction.local.getPages(curProjId);

    for (var i = 0; i < pageObjs.length; i++) {

        var pageObj = pageObjs[i];

        if (pageObj.isChange == true) {

            var frame = document.getElementById('frame_' + pageObj.id);

            if (frame) {
                var frameWindow = document.getElementById('frame_' + pageObj.id).contentWindow;
                frameWindow.subPageFunc.base.save();
            }
            else {
                mainPageFunc.base.save(pageObj);
            }

        }

    }

};

uiManager.toolBtnManager.btnTrigger = function (btnId) {

    $('#' + btnId).click();

};


uiManager.toolBtnManager.clickNew = function () {
    uiManager.projManager.newPage();
};


uiManager.toolBtnManager.clickSelect = function () {

    document.body.setAttribute('action_type', 'select');

    uiManager.moduleLibManager.cancelSelectModule();

};

uiManager.toolBtnManager.clickDelete = function () {

    var mainTab = $('#main_tabs');

    var tab = mainTab.tabs('getSelected');

    var opts = tab.panel('options');

    var pageId = opts.id;

    var frame = document.getElementById('frame_' + pageId);

    if (frame) {
        var frameWindow = frame.contentWindow;

        frameWindow.svgWorkArea.deleteSelectedElems();
    }

};

uiManager.toolBtnManager.clickCopy = function () {

    var mainTab = $('#main_tabs');

    var tab = mainTab.tabs('getSelected');

    var opts = tab.panel('options');

    var pageId = opts.id;

    var frame = document.getElementById('frame_' + pageId);

    if (frame) {
        var frameWindow = frame.contentWindow;

        var selectedElemNodes = frameWindow.svgWorkArea.copyElems();

        var _cache = {
            'type' : 'page',
            'id' : pageId,
            'data' : selectedElemNodes
        };


        uiManager.cache.pushInClipBoard(_cache);
    }

};

uiManager.toolBtnManager.clickPaste = function () {

    var cache = uiManager.cache.popOutClipBoard();

    var mainTab = $('#main_tabs');

    var tab = mainTab.tabs('getSelected');

    var opts = tab.panel('options');

    var pageId = opts.id;

    var frame = document.getElementById('frame_' + pageId);

    if (frame) {

        var frameWindow = frame.contentWindow;
        if (cache.type == 'page') {

            var _cache = {
                'src' : cache.id,
                'dest' : pageId,
                'data' : cache.data
            };

            frameWindow.svgWorkArea.pasteElems(_cache);

        }
    }

};



uiManager.toolBtnManager.actions = function () {

    var tbm = uiManager.toolBtnManager;

    var tool_buttons = [
        {sel: '#save_tool', fn: tbm.clickSave, evt: 'click', key: ['ctrl+S', true]},
        {sel: '#new_tool', fn: tbm.clickNew, evt: 'click', key: ['ctrl+N', true]},
        {sel: '#select_tool', fn: tbm.clickSelect, evt: 'click', key: []},
        {sel: '#delete_tool', fn: tbm.clickDelete, evt: 'click', key: ['Del', true]},
        {sel: '#copy_tool', fn: tbm.clickCopy, evt: 'click', key: ['ctrl+C', true]},
        {sel: '#paste_tool', fn: tbm.clickPaste, evt: 'click', key: ['ctrl+V', true]},
    ];

    return {
        setAll: function () {
            $.each(tool_buttons, function(i, opts) {
                var btn;
                if (opts.sel) {
                    btn = $(opts.sel);
                    if (btn.length == 0) {return true;} // Skip if DOM does not exist
                    if (opts.evt) {
                        //if (svgedit.browser.isTouch() && opts.evt === 'click') {
                        //    opts.evt = 'mousedown';
                        //}
                        btn[opts.evt](opts.fn);

                        //btn.bind(opts.evt,opts.fn);
                    }
                }
            });
        }
    }

};

function loadActions() {
    var actions = uiManager.toolBtnManager.actions();
    actions.setAll();
}


function btnClassInit () {
    $('.push_button').mousedown(function() {
        if (!$(this).hasClass('disabled')) {
            $(this).addClass('push_button_pressed').removeClass('push_button');
        }
    }).mouseout(function() {
        $(this).removeClass('push_button_pressed').addClass('push_button');
    }).mouseup(function() {
        $(this).removeClass('push_button_pressed').addClass('push_button');
    });


    $('.tool_button').click(function () {
        $(this).addClass('tool_button_current').removeClass('tool_button');
    });
    $('.tool_button_current').click(function () {
        $(this).removeClass('tool_button_current').addClass('tool_button');
    });

}


uiManager.workAreaManager.hasChange = function (pageId) {

    var pageObj = dataInteraction.local.getPage(pageId);

    var mainTab = $('#main_tabs');

    var tab = mainTab.tabs('getSelected');

    var opts = tab.panel('options');

    var orgTitle = opts.title;

    if (cjString.isContain(orgTitle,"*") == -1) {

        var newTitle = orgTitle + " *";

        mainTab.tabs('setTabTitle',{
            tab: tab,
            title:newTitle
        });
    }

};


uiManager.workAreaManager.clearChangeStatus = function (pageId) {

    var pageObj = dataInteraction.local.getPage(pageId);

    var mainTab = $('#main_tabs');

    var title = pageObj.name + " *";

    var tab = mainTab.tabs('getTabById',pageId);

    var newTitle = pageObj.name;

    mainTab.tabs('setTabTitle',{
        tab: tab,
        title:newTitle
    });

};

uiManager.propManager.load = function (pageId,id) {

    var propertyGridObj = uiManager.propManager.propObj;

    var propertyData = dataInteraction.local.getPropertyData(pageId,id);

    var standredPropertys;
    var _shapeType = id.split('-')[0];
    if (_shapeType == 'm') {
        standredPropertys = extendConfig.propertyOptions.module;
    }
    else if (_shapeType == 'e') {
        standredPropertys = extendConfig.propertyOptions.elem;
    }

    var _propertys = [];
    if (propertyData == null) {

        for (var i = 0; i < standredPropertys.length; i++) {

            var prop = new Property(standredPropertys[i].propertyName,standredPropertys[i].propertyValue,standredPropertys[i].group);

            if (prop.name == 'id') {
                prop.value = id;
            }

            _propertys.push(prop);
        }

    }
    else {

        function buildUpProperty (name,attrName) {

            var prop;
            $.each(standredPropertys, function (index, stdProp) {

                if (stdProp.propertyName[attrName] == name) {
                    prop = stdProp;
                    return false;
                }

            });

            return prop;

        }

        for (var i = 0; i < propertyData.length; i++) {

            var stdProp = undefined;

            if (propertyData[i].name != '') {

                stdProp = buildUpProperty(propertyData[i].name,'name');

            }

            if (stdProp == undefined) {

                stdProp = buildUpProperty(propertyData[i].title,'title');
            }

            if (stdProp == undefined) {

                stdProp = {
                    propertyName: {
                        name: '',
                        title: propertyData[i].title,
                    },
                    propertyValue:{
                        type:'text',
                    },
                    group:{
                        title:propertyData[i].group,
                    },
                }

            }

            var prop = new Property(stdProp.propertyName,stdProp.propertyValue,stdProp.group);

            prop.value = propertyData[i].value;

            _propertys.push(prop);
        }

    }

    //uiManager.propManager.save(pageId);

    uiManager.propManager.clear();

    uiDrawing.plugin.propertyGrid.load(propertyGridObj,_propertys);


};

uiManager.propManager.save = function (pageId) {

    var propertyGridObj = uiManager.propManager.propObj;
    var propertyData = uiDrawing.plugin.propertyGrid.getData(propertyGridObj);

    if (propertyData) {
        var propertyObj = {
            'propertyData': propertyData
        };

        $.each(propertyData, function (index, prop) {

            if (prop.name == 'id') {
                propertyObj.id = prop.value;

                return false;
            }

        });

        dataInteraction.local.setPropertyData(pageId, propertyObj);
    }
};

uiManager.propManager.clear = function () {

    var propertyGridObj = uiManager.propManager.propObj;

    uiDrawing.plugin.propertyGrid.clear(propertyGridObj);

};


uiManager.moduleLibManager.getModuleGroups = function () {

    var modPanels = $('.accordion_panel');

    var modGroups = [];

    $.each(modPanels, function (index, p) {

        modGroups.push($(p).attr('name'));

    });

    return modGroups;
};

uiManager.moduleLibManager.getSelectedModule = function () {

    var selectedShape = $('.lib_shape_press');

    if (selectedShape.length == 0) {
        return null;
    }

    var selectedModule = {};

    selectedModule.id = selectedShape[0].id;
    selectedModule.svg_path = selectedShape[0].getAttribute('shape_svg_path');
    selectedModule.xlink_href = selectedShape[0].getAttribute('xlink_href');
    selectedModule.svg_dom = selectedShape.data('svg_dom');

    return selectedModule;
};

uiManager.moduleLibManager.setSelectModule = function () {

    document.body.setAttribute('action_type','add-module');

    $('.tool_button_current').removeClass('tool_button_current').addClass('tool_button');

};

uiManager.moduleLibManager.cancelSelectModule = function () {

    var selectedShape = $('.lib_shape_press');

    if (selectedShape.length > 0) {
        selectedShape.removeClass('lib_shape_press').addClass('lib_shape_no_press');
    }

};

uiManager.moduleLibManager.addEventListener = function () {

    $.each($('.lib_shape'), function (i,p) {

        var shape = $(p);
        shape.mousedown(function (e) {

            var path = p.getAttribute('shape_svg_path');

            uiManager.moduleLibManager.setSelectModule();

            cjFile.hiddenIn('xml','../' + path, function (error, data) {

                if (data) {

                    //todo 以后要考虑多种情况出现
                    var svg;
                    if (data.children.length > 1) {
                        $.each(data.children, function (index,child) {
                            if (child.tagName == 'svg') {
                                svg = child;
                            }
                        });

                    }
                    else if (data.children.length == 1) {
                        if (data.children[0].tagName == 'svg') {
                            svg = data.children[0];
                        }
                    }

                    shape.data('svg_dom',svg);

                }

            });

        });

    })


};


uiManager.cache.pushInClipBoard = function (cache) {
    this.clipBoard = cache;
};

uiManager.cache.popOutClipBoard = function () {

    var _cache = {
        'type' : this.clipBoard.type,
        'id' : this.clipBoard.id,
        'data' : []
    };

    for (var i = 0; i < this.clipBoard.data.length; i++) {
        var cloneNode = this.clipBoard.data[i].cloneNode(true);
        _cache.data.push(cloneNode);
    }

    return _cache;
};