/**
 * Created by liuchaoyu on 2016-12-02.
 */

var subPageFunc = {
    'version' : '1.0.0',
    'base' : {},
    'svgCanvas' : {
        canvas : svgWorkArea.canvas,
        privateFunc:undefined,
    },
    'uiShow' : {},
    'actions': {},
};

subPageFunc.base.save = function () {

    //var curPageId = dataInteraction.getCurPageId();
    //if (curPageId == pageObj.id) {
    //    pageObj.svg_text = window.svgCanvas.getSvgString();
    //}
    //
    //var frame_document = $('#frame_' + pageObj.id)[0].contentDocument;
    //
    //pageObj.svg_text = frame_document.getElementById('curPage_id')

    var curPageId = svgWorkArea.curPageId;

    var pageObj = window.parent.dataInteraction.local.getPage(curPageId);

    pageObj.svg_text = svgWorkArea.getSvgString();

    var curUTC = window.parent.cjTime.now();

    pageObj.updateTime = (curUTC.toString()).substr(0, 10);

    var index = cjCommon.findInArray(pageObj.optType,'new');

    if (index >= 0) {
        window.parent.dataInteraction.db.insertPage(pageObj, function (retData) {
            //todo 判断sql语句运行后返回是否成功

            pageObj.isChange = false;
            pageObj.optType = [];
            pageObj.optRec = [];

            window.parent.dataStorage.cache.updateElement(pageObj);

            window.parent.uiManager.workAreaManager.clearChangeStatus(pageObj.id);

            return 1;
        });
    }

    index = cjCommon.findInArray(pageObj.optType,'del');

    if (index >= 0) {
        window.parent.dataInteraction.db.deletePage(pageObj.id, function (retData) {
            //todo 判断sql语句运行后返回是否成功

            window.parent.dataStorage.cache.removeElement(pageObj,'page_list');

            return 1;
        });
    }

    window.parent.dataInteraction.db.updatePage(pageObj, function (retData) {
        //todo 判断sql语句运行后返回是否成功

        pageObj.isChange = false;
        pageObj.optType = [];
        pageObj.optRec = [];

        window.parent.dataStorage.cache.updateElement(pageObj);

        window.parent.uiManager.workAreaManager.clearChangeStatus(pageObj.id);

        return 1;
    });


    return -1;
};

subPageFunc.base.pageChange = function () {

    var pageId = svgWorkArea.curPageId;
    var pageObj = window.parent.dataInteraction.local.getPage(pageId);

    window.parent.dataInteraction.local.updatePage(pageObj);

    window.parent.uiManager.workAreaManager.hasChange(pageId);
};


//subPageFunc.actions.data = function () {
//
//    var actions = subPageFunc.actions;
//
//    var tool_buttons = [
//
//        {sel: '#tool_group_elements', fn: actions.clickGroup, evt: 'click', key: ['G', true]},
//        {sel: '#tool_ungroup', fn: actions.clickUnGroup, evt: 'click'},
//        {sel: '#tool_unlink_use', fn: actions.clickUnGroup, evt: 'click'},
//
//        {sel: 'a[href="#group"]', fn: actions.clickGroup, evt: 'click'},
//        {sel: 'a[href="#ungroup"]', fn: actions.clickUnGroup, evt: 'click'},
//    ];
//
//    return {
//        setAll: function () {
//            $.each(tool_buttons, function(i, opts) {
//                var btn;
//                if (opts.sel) {
//                    btn = $(opts.sel);
//                    if (btn.length == 0) {return true;} // Skip if DOM does not exist
//                    if (opts.evt) {
//                        //if (svgedit.browser.isTouch() && opts.evt === 'click') {
//                        //    opts.evt = 'mousedown';
//                        //}
//                        btn[opts.evt](opts.fn);
//
//                        //btn.bind(opts.evt,opts.fn);
//                    }
//                }
//            });
//
//        }
//    }
//};
//
////todo 待解决，在组合的时候没有改变ID
//subPageFunc.actions.clickGroup = function () {
//    subPageFunc.svgCanvas.setIdPrefix('m--_');
//    alert('测试');
//};
//
//subPageFunc.actions.clickUnGroup = function () {
//    subPageFunc.svgCanvas.setIdPrefix('e-yx-_');
//};
//
//subPageFunc.actions.load = function () {
//    var actions = subPageFunc.actions.data();
//    actions.setAll();
//};
//
//
//subPageFunc.svgCanvas.getSVGContentNode = function () {
//    return svgWorkArea.canvas.svgContent.node();
//};
//
//subPageFunc.svgCanvas.getSelectedElements = function () {
//    var selectedElems = this.canvas.getSelectedElems();
//    if (selectedElems.length == 0 || selectedElems[0] == null) {
//        return [];
//    }
//    else {
//        return selectedElems;
//    }
//
//};
//
//subPageFunc.svgCanvas.getElem = function (id) {
//
//    var svgCanvas = this.canvas;
//
//    var shapeElem = svgCanvas.getElem(id);
//
//    return shapeElem;
//};
//
//subPageFunc.svgCanvas.selectElem = function (id) {
//
//    this.canvas.clearSelection(true);
//
//    try {
//        var elem = subPageFunc.svgCanvas.getElem(id);
//        this.canvas.addToSelection([elem], true);
//    }
//    catch (err) {
//        console.log('运行错误：' + err.message);
//    }
//    var selectedElem = subPageFunc.svgCanvas.getSelectedElements();
//};
//
//subPageFunc.svgCanvas.setIdPrefix = function (prefix) {
//
//    var svgCanvas = window.svgCanvas;
//
//
//    /** 设置图形ID前缀 */
//    var curDrawing = svgCanvas.getCurrentDrawing();
//    curDrawing.idPrefix = prefix;
//};
//
//subPageFunc.svgCanvas.eventListener = function () {
//
//    var svgCanvas = this.canvas;
//
//    var svgRoot = svgCanvas.getRootElem();
//    var svgContent = svgCanvas.getContentElem();
//
//    function addModuleToCanvas (e) {
//
//        var selectedModule = window.parent.uiManager.moduleLibManager.getSelectedModule();
//
//        if (selectedModule == null) {
//
//            var selectedElems = subPageFunc.svgCanvas.getSelectedElements();
//
//            var selectedElemsid = [];
//            if (selectedElems.length > 0) {
//                for (var i = 0; i < selectedElems.length; i++) {
//                    selectedElemsid.push(selectedElems[i].id);
//                }
//                svgCanvas.clearSelection();
//
//                //for (var i = 0; i < selectedElemsid.length; i++) {
//                //    var elem = subPageFunc.svgCanvas.getElem(selectedElemsid[i]);
//                //
//                //    svgedit.recalculate.recalculateDimensions(elem);
//                //
//                //    svgCanvas.addToSelection([elem]);
//                //}
//
//            }
//
//            return;
//        }
//
//        var x = e.pageX;
//        var y = e.pageY;
//
//        var viewBox = [0,0,128,64];
//        var canvasw = svgContent.getAttribute('width');
//        var canvash = svgContent.getAttribute('height');
//
//        //if (innerh > innerw) {
//        if ((canvash) > viewBox[3]) {
//            var ts = 'scale(' + viewBox[3]/(canvash) + ')';
//        }
//        else {
//            var ts = 'scale(' + (canvash/3)/viewBox[3] + ')';
//        }
//
//        //} else {
//        //    ts = 'scale(' + (canvash/3)/vb[2] + ')';
//        //}
//
//        ts = 'translate(' + 0 + ' -' + 0 + ') ' + ts;
//
//        var use_el = document.createElementNS(svgedit.NS.SVG, 'use');
//
//        subPageFunc.svgCanvas.setIdPrefix('m--_');
//
//        var href = '../ics/' + selectedModule.xlink_href;
//        use_el.id = svgCanvas.getNextId();
//        use_el.setAttributeNS(svgedit.NS.XLINK, 'xlink:href', href);
//
//        svgCanvas.getCurrentDrawing().getCurrentLayer().appendChild(use_el);
//
//        svgCanvas.clearSelection();
//        use_el.setAttribute('transform', ts);
//        svgedit.recalculate.recalculateDimensions(use_el);
//
//        svgCanvas.addToSelection([use_el]);
//
//        window.parent.uiManager.moduleLibManager.cancelSelectModule();
//    }
//
//
//
//    var bindEvent = [
//        {'elem':$(svgRoot), 'evt':'mouseup','fn':addModuleToCanvas},
//
//    ];
//
//
//    $.each(bindEvent, function (i, opt) {
//
//        var elem = opt.elem;
//
//        elem.bind(opt.evt,opt.fn);
//
//    });
//
//
//
//
//
//
//};
//
//
//subPageFunc.uiShow.propertyAndModTree = function (id) {
//
//    if (id) {
//
//        if (!subPageFunc.uiShow.curSelectedItemId || subPageFunc.uiShow.curSelectedItemId != id) {
//            window.parent.uiManager.modManager.selectItem(id);
//
//            var curPageId = svgWorkArea.curPageId;
//            window.parent.uiManager.propManager.load(curPageId, id);
//
//            subPageFunc.uiShow.curSelectedItemId = id;
//        }
//
//    }
//    else {
//        window.parent.uiManager.modManager.unSelectItem();
//
//        window.parent.uiManager.propManager.clear();
//    }
//
//};