/**
 * Created by liuchaoyu on 2016-12-02.
 */

var uiDrawing = {
    version : '1.0.0',
    dialog: {},

    plugin:{
        tree:{},
        tabs:{},
        menu:{},
        propertyGrid:{},
    },

};


uiDrawing.dialog.message = function (msgStr, isConfirm) {

    if (isConfirm == true) {
        return confirm(msgStr);
    }
    else {
        alert(msgStr);
    }
};



/**
 * 创建树
 * @param treeObj : 目标jQuery对象
 * @param treeParam : 树的参数对象
 *
 * treeParam :
 * {
 *      data:[],                 //树的列表
 *      animate:true,            //是否需要动画
 *      lines:false,             //是否显示线
 *
 *
 *
 * }
 */
uiDrawing.plugin.tree.init = function (treeObj,treeParam) {

    var setting = treeParam.setting;
    var zNodes = treeParam.nodes;
    var extSetting = treeParam.extSetting;

    var zTreeObj = $.fn.zTree.init(treeObj, setting, zNodes);

    if (extSetting && extSetting.expandAll) {
        zTreeObj.expandAll(extSetting.expandAll);
    }

    return zTreeObj;
};

uiDrawing.plugin.tree.newTreeNode = function (id, text, iconCls, state, checked, target_url, children) {

    /** EasyUI 树节点的对象 */
    //var nodeObj = {
    //    'id' : id,
    //    'text' : text,
    //    'iconCls' : iconCls,
    //    'state' : state,
    //    'checked' : checked,
    //    'target_url' : target_url,
    //    'children' : children
    //};

    var nodeObj = {
        'id': id,
        'name': text,
        'icon': iconCls,
        'target_url': target_url,
        'children': children
    };

    return nodeObj;
};

uiDrawing.plugin.tree.appendNode = function (zTreeObj,parentNode,node) {

    //treeObj.tree('append', {
    //    parent: parent.target,
    //    data: [node]
    //});

    zTreeObj.addNodes(parentNode, -1, node);
};

uiDrawing.plugin.tree.removeNode = function (zTreeObj,node) {

    //treeObj.tree('remove', node.target);

    zTreeObj.removeNode(node,true);
};

uiDrawing.plugin.tree.updateNode = function (zTreeObj,node) {

    //treeObj.tree('update', {
    //    target: node.target,
    //    text: node.text
    //});

    zTreeObj.updateNode(node);
};

uiDrawing.plugin.tree.getNodes = function (zTreeObj,mode,id) {

    if (mode == 'all') {
        return zTreeObj.getNodes();
    }
    else if (mode == 'selected') {
        return zTreeObj.getSelectedNodes();
    }
    else if (mode == 'single') {
        var node = zTreeObj.getNodesByFilter(
            function (node) {
                return (node.id == id);
            },
            true);

        return node;
    }

};


uiDrawing.plugin.tree.selectNode = function (zTreeObj,id) {
    var selectedNode = uiDrawing.plugin.tree.getNodes(zTreeObj,'selected');
    if (selectedNode.length == 0 || (selectedNode[0] && selectedNode[0].id != id)) {

        var node = uiDrawing.plugin.tree.getNodes(zTreeObj,'single',id);
        zTreeObj.selectNode(node);

    }
};

uiDrawing.plugin.tree.unSelectNode = function (zTreeObj,id) {

    function cancelSelect (node) {
        if (zTreeObj) {
            if (node) {
                zTreeObj.cancelSelectedNode(node);
            }
            else{
                var selectedNodes = zTreeObj.getSelectedNodes();
                if (selectedNodes.length > 0) {
                    zTreeObj.cancelSelectedNode();
                }
            }
        }
    }

    if (id) {
        var node = zTreeObj.getNodesByFilter(
            function (node) {
                return (node.id == id);
            },
            true);

        cancelSelect(node);
    }
    else{
        cancelSelect();
    }
};

/**
 * 创建标签页界面
 * @param tabObj : 目标jQuery对象
 * @param paramsObj : 参数对象
 */
uiDrawing.plugin.tabs.initTabs = function (tabObj,paramsObj) {

    var params = {};

    for (var attr in paramsObj) {
        params[attr] = paramsObj[attr];
    }

    tabObj.tabs(params);
};

uiDrawing.plugin.tabs.newTab = function (tabObj,newTab) {

    if (tabObj.tabs('isExist',newTab.id)) {
        tabObj.tabs('selectById', newTab.id);
    }
    else {
        tabObj.tabs('add',
            {
                id: newTab.id,
                title: newTab.title,
                content: newTab.content,
                iconCls: null,
                //width:,
                //height:,
                closable: newTab.closable,
                selected: newTab.isSelected,
            }
        );
    }
};

uiDrawing.plugin.tabs.updTab = function (tabObj,oldTabTitle,newTab) {

    if (tabObj.tabs('exists',oldTabTitle)) {

        var tab = tabObj.tabs('getTab',oldTabTitle);

        tabObj.tabs('setTabTitle',{
            tab: tab,
            title:newTab.title
        });

    }

};

uiDrawing.plugin.tabs.getSelectedTabId = function (tabObj) {

    var pp = tabObj.tabs('getSelected');

    return pp.panel('options').id;

};

uiDrawing.plugin.tabs.closeTab = function (tabObj,tabTitle) {

    tabObj.tabs('close',tabTitle);

};


uiDrawing.plugin.propertyGrid.init = function (pgObj,paramObj) {

    var param = {};

    for (var attr in paramObj) {
        param[attr] = paramObj[attr];
    }

    pgObj.propertygrid(param);

    var gridPanel = pgObj.datagrid('getPanel');

    return gridPanel;
};

uiDrawing.plugin.propertyGrid.appendRow = function (pgObj,row) {

    pgObj.propertygrid('appendRow',row);

};

uiDrawing.plugin.propertyGrid.deleteRow = function (pgObj,index) {

    pgObj.datagrid('deleteRow',index);
    pgObj.datagrid('reload');

};

uiDrawing.plugin.propertyGrid.setValue = function (pgObj, index, dataObj) {

    var gridPanel = pgObj.datagrid('getPanel');

    var rows = gridPanel.find('tr[datagrid-row-index = "' + index.toString() + '"]');

    rows.each(function (index,row) {

        var cell = $(row).children('td[field="value"]');

        if (cell.length == 1) {
            var _div = cell.children('div:first');
            _div.text(dataObj.value);
        }

    });

};

uiDrawing.plugin.propertyGrid.getValue = function (pgObj, index) {

    var row = pgObj.datagrid('getRows')[index];
    if (row) {
        return row;
    }

};

uiDrawing.plugin.propertyGrid.clear = function (pgObj) {

    var rows = pgObj.datagrid('getRows');
    if (rows.length > 0) {
        pgObj.datagrid('loadData', {total: 0, rows: []});
    }

};

uiDrawing.plugin.propertyGrid.load = function (pgObj, propertys) {

    propertys.map(function (prop) {

        var row = {
            name:prop.name,
            title:prop.title,
            value:prop.value,
            group:prop.group,
            type:prop.type
        };

        if (prop.editable) {
            row.editor = {
                type:prop.type,
                options:prop.options
            }
        }

        uiDrawing.plugin.propertyGrid.appendRow(pgObj,row);

    });

};

uiDrawing.plugin.propertyGrid.getData = function (pgObj) {

    var rows = pgObj.datagrid('getRows');

    if (rows.length && rows.length > 0) {

        var data = [];

        for (var i = 0; i < rows.length; i++) {

            var prop = {};
            for (var attr in rows[i]) {
                if (attr != 'editor') {
                    prop[attr] = rows[i][attr];
                }
            }

            data.push(prop);

        }

        return data;
    }

    return null;

};

