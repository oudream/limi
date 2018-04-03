/**
 * Created by liuchaoyu on 2016-10-28.
 *
 * data-interaction.js
 *
 * 数据交互相关（针对后台数据库）
 */

var dataInteraction = {
    'version' : '1.0.0',
    'db': {},
    'local': {},
};



dataInteraction.db.downloadProjs = function (fn_callback) {

    var callback;
    if (fn_callback == undefined) {
        callback = dataInteraction.projDownloadReturn;
    }
    else {
        callback = fn_callback;
    }

    var sqlCommand = extendConfig.sql.projs_down;

    cjNetwork.sql.downloadData.apply(this,[sqlCommand,callback]);

};

dataInteraction.db.downloadPages = function (projId,fn_callback) {

    var sqlCommand = cjString.format(extendConfig.sql.pages_down,projId);

    cjNetwork.sql.downloadData.apply(this,[sqlCommand,fn_callback])

};


dataInteraction.db.insertProj = function (dataObj,fn_callback) {

    var sqlCommand = cjString.format(extendConfig.sql.insert_proj,dataObj.id,"",dataObj.name,"1",dataObj.updateTime,"0","");

    cjNetwork.sql.uploadData.apply(this,[sqlCommand,fn_callback]);

};

dataInteraction.db.insertPage = function (dataObj,fn_callback) {

    var svgText = dataProcess.svgText.stringify(dataObj.svg_text);

    var sqlCommand = cjString.format(extendConfig.sql.insert_page,dataObj.id,dataObj.proj,dataObj.name,svgText,dataObj.svg_path,"1",dataObj.updateTime,"0","");

    cjNetwork.sql.uploadData.apply(this,[sqlCommand,fn_callback]);

};


dataInteraction.db.updatePage = function (dataObj,fn_callback) {

    var svgText = dataProcess.svgText.stringify(dataObj.svg_text);

    var propertyListText = JSON.stringify(dataObj.property_list);

    var sqlCommand = cjString.format(extendConfig.sql.update_page,dataObj.proj,dataObj.name,svgText,dataObj.svg_path,propertyListText,dataObj.property_path,dataObj.updateTime,dataObj.id);

    cjNetwork.sql.uploadData.apply(this,[sqlCommand,fn_callback]);
};


dataInteraction.db.deleteProj = function (id,fn_callback) {
    //var sqlCommand = cjString.format(extendConfig.sql.delete_proj,id);

};

dataInteraction.db.deletePage = function (id,fn_callback) {
    var sqlCommand = cjString.format(extendConfig.sql.delete_page,id);

    cjNetwork.sql.uploadData.apply(this,[sqlCommand,fn_callback]);
};


dataInteraction.projDownloadReturn = function (retData) {

    var projs = [];
    var projsId = [];

    for (var i = 0; i < retData.length; i++) {
        var proj = new Project(retData[i].F_ID,retData[i].F_NAME,retData[i].F_UPDATE_TIME);

        projs.push(proj);
        projsId.push(retData[i].F_ID);

        cjTempStorage.saveObj(retData[i].F_ID,proj);
    }

    cjTempStorage.saveArray('project_list',projsId);

    initProjTree(projs);

};

dataInteraction.pageDownloadReturn = function (retData) {

    var curProjId = dataInteraction.getCurProjectId();
    var curProjObj = dataInteraction.local.getProject(curProjId);

    var tree = uiDrawing.plugin.tree;

    var pagesId = [];
    var nodes = [];

    for (var i = 0; i < retData.length; i++) {

        var svg_text = dataProcess.svgText.parse(retData[i].F_SVG_TEXT);

        var propertyList = (function () {
            if (retData[i].F_PROPERTY_LIST != '') {
                var jsonStr = (retData[i].F_PROPERTY_LIST).replace(/'([^']*)'/g, '"$1"');
                return JSON.parse(jsonStr);
            }
            else {
                return [];
            }
        })();

        var page = new Page(retData[i].F_ID,retData[i].F_NAME,retData[i].F_PID,retData[i].F_UPDATE_TIME,svg_text,retData[i].F_SVG_PATH,propertyList,retData[i].F_PROPERTY_PATH);

        var node = tree.newTreeNode(page.id, page.name, null, null, null, page.svg_path, null);

        pagesId.push(retData[i].F_ID);

        nodes.push(node);

        cjTempStorage.deleteObj(retData[i].F_ID);
        cjTempStorage.saveObj(retData[i].F_ID,page);
    }

    cjTempStorage.saveArray('page_list',pagesId);

    var projNode = tree.newTreeNode(curProjId,curProjObj.name,null,closed,null,null,nodes);

    var treeData = [projNode];

    var treeObj = $('#pageTree');

    var treeParam = {
        setting:{
            view:{
                showLine: false,
                selectedMulti:false,
            },
            callback: {
                onDblClick: function (event, treeId, treeNode) {
                    if (treeNode.children && treeNode.children.length > 0) {
                        treeNode.open = true
                    }
                    var id = treeNode.id;
                    if (id != undefined && id != null && id.length > 0) {
                        uiManager.projManager.openPage(id);
                    }
                },

                onRightClick: function (event, treeId, treeNode) {
                    //e.preventDefault();

                    if (treeNode) {
                        var zTreeObj = $.fn.zTree.getZTreeObj(treeId);
                        zTreeObj.selectNode(treeNode);
                    }

                    var treeMenu = $('#tree_menu');
                    var domNew = $('#menu_new')[0];
                    var domRename = $('#menu_rename')[0];
                    var domDelete = $('#menu_delete')[0];

                    treeMenu.menu('show', {
                        left: event.pageX,
                        top: event.pageY
                    });

                    if (treeNode == null) {
                        treeMenu.menu('disableItem', domRename);
                        treeMenu.menu('disableItem', domDelete);
                    }
                    else{
                        treeMenu.menu('enableItem', domRename);
                        treeMenu.menu('enableItem', domDelete);
                    }

                    domNew.setAttribute('parent_id',treeId);
                    domRename.setAttribute('parent_id',treeId);
                    domDelete.setAttribute('parent_id',treeId);
                },

                beforeRename: function (treeId, treeNode, newName, isCancel) {

                    if (!isCancel) {
                        var zTreeObj = $.fn.zTree.getZTreeObj(treeId);
                        return uiManager.projManager.updatePageAfter(zTreeObj, treeNode, newName);
                    }

                },

                beforeRemove: function (treeId, treeNode) {

                    var zTreeObj = $.fn.zTree.getZTreeObj(treeId);

                    var messageStr = "确定要删除 \" " + treeNode.name + " \" ?";

                    var r = uiDrawing.dialog.message(messageStr,true);

                    if (r) {
                        //todo 以后加入日志记录

                        return true;
                    }
                    else{
                        return false;
                    }

                },

            }
        },
        nodes:treeData,
        extSetting:{
            expandAll: true,
        }
    };

    uiManager.projManager.zTreeObj = tree.init(treeObj,treeParam);
};

//dataInteraction.projUploadReturn = function (retData) {

//};

//dataInteraction.pageUploadReturn = function (retData) {

//};



dataInteraction.getAvailableIdAndTime = function (type) {

    if (!type) {
        return null;
    }

    var curUTC = cjTime.now();

    var checkRepetitive = function (type, list) {

        var tempId = type + "." + curUTC.toString();
        var isContinue = true;

        while (isContinue) {

            var hasFound = false;
            for (var i = 0; i < list.length; i++) {
                if (list[i].id == tempId) {
                    hasFound = true;
                    tempId = type + "." + (curUTC + 1).toString();
                    break;
                }
            }

            if (hasFound == false) {
                isContinue = false;
            }
        }

        return tempId;
    };

    var availableId;

    if (type == "proj") {

        var projs = dataInteraction.local.getProjects();

        availableId = checkRepetitive(type,projs);

    }
    else if (type == "page") {

        var pages = dataInteraction.local.getPages();

        availableId = checkRepetitive(type,pages);

    }

    return {'id' : availableId ,'curTime' : (curUTC.toString()).substr(0, 10)};
};

dataInteraction.getAvailableName = function (type) {

    if (!type) {
        return null;
    }

    var checkRepetitive = function (type, list) {

        var map = {proj:'项目',page:'页'};

        var tempName = '新建' + map[type];
        var isContinue = true;

        while (isContinue) {

            var hasFound = false;
            for (var i = 0; i < list.length; i++) {
                if (list[i].name == tempName) {
                    hasFound = true;
                    tempName = tempName + "-(副本)";
                    break;
                }
            }

            if (hasFound == false) {
                isContinue = false;
            }
        }

        return tempName;
    };

    var availableName;

    if (type == "proj") {

        var projs = dataInteraction.local.getProjects();

        availableName = checkRepetitive(type,projs);

    }
    else if (type == "page") {

        var pages = dataInteraction.local.getPages();

        availableName = checkRepetitive(type,pages);

    }

    return availableName;

};



dataInteraction.local.addProject = function (obj) {
    dataStorage.cache.addElement(obj, 'project_list');
    dataInteraction.db.insertProj(obj);
};

dataInteraction.local.removeProject = function (obj) {
    dataStorage.cache.removeElement(obj, 'project_list');
};

dataInteraction.local.addPage = function (obj) {

    obj.isChange = true;
    obj.optType.push('new');

    dataStorage.cache.addElement(obj, 'page_list');

};

dataInteraction.local.updatePage = function (obj,isCache) {
    obj.isChange = true;
    obj.optType.push('upd');

    if (isCache == undefined || (isCache && isCache == true)) {
        dataStorage.cache.updateElement(obj);
    }
};

dataInteraction.local.removePage = function (obj) {

    obj.isChange = true;
    obj.optType.push('del');

    dataStorage.cache.updateElement(obj);

    //removeElement(obj, 'page_list');

};


dataInteraction.local.getProject = function (projId) {
    return cjTempStorage.loadObj(projId);
};


dataInteraction.local.getProjects = function () {
    var projsId = cjTempStorage.loadArray('project_list');

    var projs = [];
    for (var i = 0; i < projsId.length; i++) {

        var proj = cjTempStorage.loadObj(projsId[i]);
        projs.push(proj);

    }

    return projs;
};


dataInteraction.local.getPage = function (pageId) {
    return cjTempStorage.loadObj(pageId);
};

dataInteraction.local.getPages = function () {

    var pages = [];
    if (arguments.length == 0) {
        var pagesId = cjTempStorage.loadArray('page_list');

        for (var i = 0; i < pagesId.length; i++) {

            var page = cjTempStorage.loadObj(pagesId[i]);
            pages.push(page);

        }
    }
    else {
        pages = dataProcess.getPagesByProj(arguments[0]);
    }

    return pages;
};


dataInteraction.local.setModules = function (moduleGroup,moduleIds) {

    var modGroups = uiManager.moduleLibManager.getModuleGroups();

    var modules = dataInteraction.local.modules = {};

    modules[moduleGroup] = moduleIds;

};

dataInteraction.local.getModules = function (moduleGroup) {

    var modules = dataInteraction.local.modules;

    return modules[moduleGroup];

};

dataInteraction.local.addModule = function (moduleGroup,moduleId) {

    var modules = dataInteraction.local.modules;

    var modGroup = modules[moduleGroup];

    if (modGroup == undefined) {
        modGroup = [];
    }

    modGroup.push(moduleId);
};

dataInteraction.local.removeModule = function (moduleGroup, moduleId) {

    var modules = dataInteraction.local.modules;

    var modGroup = modules[moduleGroup];

    cjArray.remove(modGroup,moduleId);

};



dataInteraction.local.getPropertyData = function (pageId,id) {

    var pageObj = dataInteraction.local.getPage(pageId);

    var propertyList = pageObj.property_list;

    for (var i = 0; i < propertyList.length; i++) {
        if (propertyList[i].id == id) {
            return propertyList[i].propertyData;
        }
    }

    return null;
};


dataInteraction.local.setPropertyData = function (pageId, propertysObj) {

    var pageObj = dataInteraction.local.getPage(pageId);

    var propertyList = pageObj.property_list == "" ? [] : pageObj.property_list;

    var isExist = false;
    for (var i = 0; i < propertyList.length; i++) {
        if (propertyList[i].id == propertysObj.id) {
            propertyList[i].propertyData = propertysObj.propertyData;
            isExist = true;
        }
    }
    if (isExist == false) {
        propertyList.push(propertysObj);
    }

    pageObj.property_list = propertyList;

    dataInteraction.local.updatePage(pageObj,true);

};


dataInteraction.setCurProjectId = function (proj_id) {
    cjTempStorage.save('cur_project',proj_id);
};

dataInteraction.getCurProjectId = function () {
    return cjTempStorage.load('cur_project');
};

dataInteraction.setCurPageId = function (page_id) {
    cjTempStorage.save('cur_page',page_id);
};

dataInteraction.getCurPageId = function () {
    return cjTempStorage.load('cur_page');
};


