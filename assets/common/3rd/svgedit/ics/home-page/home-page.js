/**
 * Created by liuchaoyu on 2016-11-11.
 */

var buttonResponse = {
    'click' : {}
};


var ui = {
    'open_proj_tab': {}
};


$(function () {

    var mainTab = $('#main-tabs');

    mainTab.tabs({
        border: false,
        plain: true,
        fit: true,
        tabPosition: 'left',
        headerWidth: 70,


        onSelect:function(title){
            var tab = mainTab.tabs('getSelected');
            var index = mainTab.tabs('getTabIndex',tab);

            if (index == 1) {
                btnDisabled('viewer_open_btn',false);
            }
            else {
                btnDisabled('viewer_open_btn',true);
            }
        }

    });

    var options = mainTab.tabs('tabs');

    for (var i = 0; i < options.length; i++) {
        addTabContentByIndex(i);
    }


    $('.panel-body').css({
        'width' : $('.panel').css('width'),
        'height' : $('.panel').css('height')
    })


    btnDisabled('viewer_open_btn',true);

    setBotBtnResp();

    dataInteraction.db.downloadProjs();

});


function btnDisabled (btnId,isDisabled) {
    if (isDisabled == true) {
        $('#' + btnId).attr('disabled', 'disabled');
    }
    else {
        $('#' + btnId).attr('disabled', false);
    }
};


var addTabContentByIndex = function (index) {

    switch (index) {
        case 0 :
            tabContentOfNewProjOption();
            break;
        case 1 :
            tabContentOfOpenProjOption();
            break;
        case 2 :
            break;
    }

};

var tabContentOfNewProjOption = function () {

    var newProjInput = $('#new_proj_name_input');
    var promptLabel = $('#new_proj_prompt_bar');

    var edtBtn = $('#editor_open_btn');

    newProjInput.bind('input', function (evt) {

        var name = newProjInput.val();
        if (name == "") {
            promptLabel.text("");
            edtBtn.attr('disabled','disabled');
        }
        else {

            var projs = dataInteraction.local.getProjects();

            if (dataProcess.hasRepeatName(name,projs) == false) {
                promptLabel.text("可使用");
                promptLabel.css('color','green');
                edtBtn.attr('disabled',false);
            }
            else {
                promptLabel.text("该名字已存在");
                promptLabel.css('color','red');
                edtBtn.attr('disabled','disabled');
            }
        }
    });

};

var tabContentOfOpenProjOption = function () {


};


var setBotBtnResp = function () {

    var openEditBtn = $('#editor_open_btn');
    var openViewBtn = $('#viewer_open_btn');
    var cancelBtn = $('#cancel_btn');


    openEditBtn.bind('click',buttonResponse.click.openEditor_btn);


};


var initProjTree = function (data) {

    var nodes = [];
    for (var i = 0; i < data.length; i++) {
        var node = ui.open_proj_tab.tree.newNode(data[i].id, data[i].name, null, closed, null, null, null);
        nodes.push(node);
    }

    var rootNode = ui.open_proj_tab.tree.newNode('root_id','项目列表',null,closed,null,null,nodes);

    var treeData = [rootNode];

    var treeParam = {
        setting:{
            view:{
                showLine: false,
                selectedMulti:false,
            },
            callback: {
                onDblClick: function (event, treeId, treeNode) {

                },

                onRightClick: function (event, treeId, treeNode) {
                    //e.preventDefault();

                },
            }
        },
        nodes:treeData,
        extSetting:{
            expandAll: true,
        }
    };

    ui.open_proj_tab.tree.zTreeObj = ui.open_proj_tab.tree.init($('#projTree'),treeParam);

    //todo 调整树形图的尺寸


};


buttonResponse.click.openEditor_btn = function () {

    var mainTab = $('#main-tabs');
    var tab = mainTab.tabs('getSelected');
    var index = mainTab.tabs('getTabIndex',tab);

    var html;

    if (index == 0) {

        var newProjName = $('#new_proj_name_input').val();

        var obj = dataInteraction.getAvailableIdAndTime("proj");

        var newProj = new Project(obj.id, newProjName, obj.curTime);

        dataInteraction.local.addProject(newProj);

        html = "../drawing-tool/drawing-tool.html?proj_id=" + obj.id;

    }
    else if (index == 1) {

        var nodes = ui.open_proj_tab.tree.zTreeObj.getSelectedNodes();

        var selectedNode = nodes[0];

        html = "../drawing-tool/drawing-tool.html?proj_id=" + selectedNode.id;

    }

    gotoHtml(html);

};




ui.open_proj_tab.tree = {

    init: function (treeObj,treeParam) {

        var setting = treeParam.setting;
        var zNodes = treeParam.nodes;
        var extSetting = treeParam.extSetting;

        var zTreeObj = $.fn.zTree.init(treeObj, setting, zNodes);

        if (extSetting && extSetting.expandAll) {
            zTreeObj.expandAll(extSetting.expandAll);
        }

        return zTreeObj;
    },

    openPage: function (url) {

    },

    newNode: function (id, text, iconCls, state, checked, target_url, children) {
        var nodeObj = {
            'id': id,
            'name': text,
            'icon': iconCls,
            'target_url': target_url,
            'children': children
        };

        return nodeObj;
    },

    zTreeObj:undefined,
};


function gotoHtml (html) {
    window.location.href = html;
}






function  addTabElem (tabObj,isSelected) {

    $('#main-tabs').tabs('add',
        {
            id: tabObj.id,
            title: tabObj.title,
            content:tabObj.content,
            iconCls:null,
            width:tabObj.width,
            height:tabObj.height,
            closable:false,
            selected:isSelected
        }
    );

}

var buildUpTabData = function () {

    var titles = ['新建项目','打开项目','导入项目'];
    var ids = ['new_proj','open_proj','input_proj'];

    var objs = [];
    for (var i = 0; i < titles.length; i++) {

        var obj = {};

        obj.id = ids[i];
        obj.title = titles[i];
        obj.content = titles[i];
        obj.width = parseInt($('.panel').css('width'),10);
        obj.height = parseInt($('.panel').css('height'),10);

        objs.push(obj);
    }

    return objs;
};

