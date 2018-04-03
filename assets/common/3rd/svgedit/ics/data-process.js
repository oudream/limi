/**
 * Created by liuchaoyu on 2016-10-28.
 */

var dataProcess = {
    'version' : '1.0.0',
    'svgText' : {},
};

dataProcess.getPagesByProj = function (projId) {

    var pageList = dataInteraction.local.getPages();

    var pages = [];

    if (pageList != undefined && pageList != null && pageList.length > 0) {
        for (var i = 0; i < pageList.length; i++) {
            if (pageList[i].proj == projId) {
                pages.push(pageList[i]);
            }
        }
    }

    return pages;
};

dataProcess.getIdByName = function (name,type,projName) {

    var id;
    var list;
    if (type == 'proj') {
        list = dataInteraction.local.getProjects();
    }
    else if (type == 'page') {
        var projId = dataProcess.getIdByName(projName,'proj');
        list = dataProcess.getPagesByProj(projId);
    }

    for (var i = 0; i < list.length; i++) {
        if (list[i].name == name) {
            id = list[i].id;
            break;
        }
    }

    return id;
};

dataProcess.getNameById = function (id,type) {
    var name;
    var list;
    if (type == 'proj') {
        list = dataInteraction.local.getProjects();
    }
    else if (type == 'page') {
        list = dataInteraction.local.getPages();
    }

    for (var i = 0; i < list.length; i++) {
        if (list[i].id == id) {
            name = list[i].name;
            break;
        }
    }

    return name;
};

dataProcess.hasRepeatName = function (name, array) {

    if (array == undefined || array.length == 0) {
        return false;
    }

    for (var i = 0; i < array.length; i++) {
        if (array[i].name == name) {
            return true;
        }
    }

    return false;

};

dataProcess.svgText.stringify = function (svgText) {

    return svgText.replace(/[\r\n]/g,"<br>");

};

dataProcess.svgText.parse = function (svgText) {

    return svgText.replace(/<br>/g,"\r\n");

};
