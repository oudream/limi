/**
 * Created by liuchaoyu on 2016-11-17.
 *
 * data-storage.js
 *
 */

var dataStorage = {
    'svg' : {},
    'cache' : {},
    'undo' : {}
};


dataStorage.save = function (pageId) {
    if (pageId && pageId.length > 0) {

        var curPage = dataInteraction.local.getPage(pageId);

        dataStorage.svg.save.apply(curPage);

        dataStorage.undo.save.apply(curPage);

        dataStorage.cache.updateElement(curPage);

        return true;
    }

    return false;
};

dataStorage.load = function (pageId) {
    if (pageId && pageId.length > 0) {

        var curPage = dataInteraction.local.getPage(pageId);

        dataStorage.svg.load.apply(curPage);

        dataStorage.undo.load.apply(curPage);

        return true;
    }

    return false;
};

//todo 待修改
dataStorage.svg.save = function () {

    var svgString = window.svgCanvas.getSvgString();

    this.svg_text = svgString;

};

dataStorage.svg.load = function () {

    var pageObj = this;

    window.svgCanvas.setSvgString(pageObj.svg_text);
};


dataStorage.cache.addElement = function (obj, key) {
    var array = cjTempStorage.loadArray(key);

    array.push(obj.id);

    cjTempStorage.saveObj(obj.id,obj);
    cjTempStorage.saveArray(key,array);

};

dataStorage.cache.removeElement = function (obj, key) {
    var array = cjTempStorage.loadArray(key);

    for (var i = 0; i < array.length; i++) {
        if (obj.id == array[i]) {
            array.splice(i,1);
        }
    }

    cjTempStorage.deleteObj(obj.id);
    cjTempStorage.saveArray(key,array);

};

dataStorage.cache.updateElement = function (obj) {
    cjTempStorage.saveObj(obj.id,obj);
};


dataStorage.undo.save = function () {

    var undoMgr = window.svgCanvas.undoMgr;
    var gUndoStacks = window.icsCommon.undoStacks;

    if (undoMgr.getUndoStackSize() > 0) {
        gUndoStacks[this.id] = cjCommon.clone(undoMgr.undoStack);
        //gUndoStacks[this.id] = undoMgr.undoStack;
    }
};

dataStorage.undo.load = function () {

    var undoMgr = window.svgCanvas.undoMgr;
    var gUndoStacks = window.icsCommon.undoStacks;

    var pageObj = this;

    undoMgr.resetUndoStack();

    if (cjCommon.hasProperty(gUndoStacks,pageObj.id) == true) {

        undoMgr.undoStack = cjCommon.clone(gUndoStacks[pageObj.id]);
        //undoMgr.undoStack = gUndoStacks[pageObj.id];
        undoMgr.undoStackPointer = undoMgr.undoStack.length;
    }

};