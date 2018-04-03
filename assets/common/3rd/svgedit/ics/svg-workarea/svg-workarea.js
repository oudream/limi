/**
 * Created by liuchaoyu on 2017-01-09.
 */

var svgWorkArea = {
    version:'1.0.0',
    curPageId : '',
    curConfig : {},
    actions:{},
};


$(function () {

    init();

    var svgDrawing = $('#svg_drawing');
    var html = $('html');

    var w = parseInt(svgWorkArea.curConfig.page_width,10);    //parseInt(html.css('width'),10);
    var h = parseInt(svgWorkArea.curConfig.page_height,10);     //parseInt(html.css('height'),10);

    var canvas = svgCanvas.init('svg_drawing', {id:'svgRoot',size: [w, h]});

    canvas.addSvgIdPrefix(['m--_','e-yx-_','e-yc-_','e-yw-_','hide--_']);

    svgWorkArea.canvas = canvas;

    svgWorkArea.actions.setAll();

    svgCanvas.select.init(canvas);

    svgCanvas.select.getSelectorManager(canvas).addResizeAndRotateFunc(function (res) {
        if (res.opt == 'resize' && res.eventStage == 'drag-start') {
            window.parent.document.body.setAttribute('action_type','resize');
            subPageFunc.base.pageChange();
        }
        else if (res.opt == 'rotate' && res.eventStage == 'drag-start') {
            window.parent.document.body.setAttribute('action_type','rotate');
            subPageFunc.base.pageChange();
        }
        else if (res.eventStage == 'drag-stop') {
            window.parent.document.body.setAttribute('action_type','select');
        }
    });

    window.parent.uiManager.modManager.loadTree(svgWorkArea.curPageId);

});

function init() {

    //var body = $('body');
    //
    //body.css('height',(parseInt($('html').css('height'),10) - parseInt(body.css('margin'),10) * 2));

    pageDataInit();

    svgWorkArea.curConfig = window.parent.mainPageFunc.base.getConfig();

}

svgWorkArea.actions.eventListener = function () {

    function clickAction (e) {

        var actionType = window.parent.document.body.getAttribute('action_type');

        switch (actionType) {
            case 'select':
                selectElement(e);
                break;
            case 'multiSelect':
                multiSelectElement(e);
                break;
            case 'resize':

                break;
            case 'add-module':
                addModuleToCanvas(e);
                break;
            default:

        }

    }

    function addModuleToCanvas (e) {

        var selectedModule = window.parent.uiManager.moduleLibManager.getSelectedModule();

        if (selectedModule == null) {

            return;
        }

        var svgDom = selectedModule.svg_dom;

        var svgViewBox = svgDom.getAttribute('viewBox');
        var svgId = svgDom.children[0].id;
        var svgElems = svgDom.children[0].children;

        var isModule = false;
        var midType = 'yx';
        for (var i = 0; i < svgElems.length; i++) {
            if (svgElems[i].tagName == 'g') {
                isModule = true;
            }
            else {
                midType = svgElems[i].id.split("-")[1];
            }
        }

        var idPerfix = isModule ? 'm--_' : 'e-' + midType + '-_';

        var elemId = svgWorkArea.canvas.getSvgId(idPerfix);
        var _groupAttr = {
            elemType : 'svg:g',
            elemParent : svgWorkArea.canvas.svgContent,
            elemAttr : {
                'id' : elemId
            }
        };

        var _group = svgCanvas.action.addSvgShape(svgWorkArea.canvas,_groupAttr, function (res) {
            if ( res.eventStage == 'drag-start') {
                if (res.opt == 'move') {
                    window.parent.document.body.setAttribute('action_type','move');
                }
                //svgWorkArea.canvas.clearSelection();
            }
            else if (res.eventStage == 'drag') {
                $.each(svgWorkArea.canvas.selectedElemIds, function (index, _id) {
                    svgWorkArea.canvas.selectorManager.selectorMap[_id].resize();
                });

                subPageFunc.base.pageChange();
            }
            else if (res.eventStage == 'drag-stop') {
                if (res.opt == 'move') {
                    window.parent.document.body.setAttribute('action_type','select');
                }
            }
        });

        for (var i = 0; i < svgElems.length; i++) {

            if (svgElems[i].id == 'static_shape') {

                var symbolId = svgId + '_' + svgElems[i].id;

                var _symbol = svgWorkArea.canvas.defs().select('#' + symbolId).node();
                if (_symbol == null) {
                    var symbol = svgWorkArea.canvas.defs().append('svg:symbol')
                        .attr({
                            'id': symbolId,
                            'viewBox': svgViewBox,
                            'preserveAspectRatio': "xMinYMin"
                        });

                    var symbolChild = svgElems[i].children;
                    for (var n = symbolChild.length; n > 0; n--) {
                        symbol.node().appendChild(symbolChild[0]);
                    }
                }

                _group.append('svg:use')
                    .attr({
                        'id': svgWorkArea.canvas.getSvgId('hide--_'),
                        'x': 0,
                        'y': 0,
                        'xlink:href':'#' + symbolId
                    });

            }
            else if (svgElems[i].id == 'dynamic_shape') {

                $.each(svgElems[i].children, function (index, child) {

                    var attrObj = window.parent.cjCommon.getAllAttrOfElem(child);

                    attrObj.id = (function () {
                        var idPrefix = 'e-' + attrObj.id.split("-")[1] + '-_';
                        return svgWorkArea.canvas.getSvgId(idPrefix);
                    })();

                    _group.append('svg:' + child.tagName)
                        .attr(attrObj);

                });

            }
        }

        var ts = 'scale(0.1)';

        var vb = (function () {
            var _vb = [];
            $.each(svgViewBox.split(" "), function (index,str) {
                _vb.push(parseFloat(str));
            });

            return _vb;
        })();

        var svg_root = svgWorkArea.canvas.svgRoot.node();
        var canvasw = parseFloat(svg_root.getAttribute('width'));
        var canvash = parseFloat(svg_root.getAttribute('height'));

        /** 暂时停用，使用width和height代替scale进行尺寸变换
        if (vb[2] > vb[3]) {
            ts = 'scale(' + vb[2]/(canvasw) + ')';
        }
        else {
            ts = 'scale(' + (vb[3])/(canvash) + ')';
        }
         */

        var fixedPos = svgCanvas.utilities.getFixPos({x:e.pageX,y:e.pageY});

        var ts_move = 'rotate(0) matrix(1,0,0,1,' + fixedPos.x + ',' + fixedPos.y + ')';
        //var ts_move = 'translate(' + fixedPos.x + ' ' + fixedPos.y + ')';

        _group.select('use')
            .attr({
                'x':0,
                'y':0,
                'width':vb[2],
                'height':vb[3],
                //'transform': ts
            });

        var bbox = svgCanvas.utilities.getElemBox(_group.node());

        _group.attr({
                'transform': ts_move,
                'org-width': bbox.width,
                'org-height': bbox.height
            });
        //var use = {
        //    elemType:'svg:use',
        //    elemAttr:{
        //        id: svgWorkArea.canvas.getSvgId('m--_'),
        //        x:'0',
        //        y:'0',
        //        transform: ts,
        //    }
        //};

        //use.elemAttr['xlink:href'] = '../' + selectedModule.xlink_href;

        //var svgRoot = d3.select('#svgRoot');

        svgWorkArea.addElement(_group.node().id);
        svgWorkArea.setSelectElem(_group.node().id);
    }

    function selectElement (e) {

        try {

            var mouse_target = e.target;

            var selectElemId;
            if (mouse_target.tagName == 'svg') {
                selectElemId = null;
            }
            else if (mouse_target.tagName == 'use') {
                selectElemId = mouse_target.parentNode.id;
            }
            else {
                selectElemId = mouse_target.id;
            }

            svgWorkArea.setSelectElem(selectElemId);

        }
        catch (err) {
            console.log('运行错误：' + err.message);
        }
    }

    function multiSelectElement (e) {

        try {

            var mouse_target = e.target;

            window.parent.document.body.setAttribute('action_type','select');

        }
        catch (err) {
            console.log('运行错误：' + err.message);
        }
    }


    var bindEvent = [
        {'elem':$('#' + svgWorkArea.canvas.svgRootId), 'evt':'mouseup','fn':clickAction},

    ];

    return bindEvent;
};

svgWorkArea.actions.setAll = function () {

    var actions = svgWorkArea.actions.eventListener();


    $.each(actions, function (i, opt) {

        var elem = opt.elem;

        elem.bind(opt.evt,opt.fn);

    });

};


svgWorkArea.getCanvas = function () {
    return this.canvas;
};

svgWorkArea.addElement = function (id) {

    window.parent.uiManager.modManager.addItem(id);

    subPageFunc.base.pageChange();

};

svgWorkArea.deleteElements = function (ids) {

    for (var i = 0; i < ids.length; i++) {

        var _elem = {
            'id' : ids[i],
            'parent' : this.canvas.svgContent.node()
        };

        svgCanvas.action.removeSvgShape(this.canvas,_elem);
        window.parent.uiManager.modManager.removeItem(ids[i]);
    }

    subPageFunc.base.pageChange();
};


svgWorkArea.setSelectElem = function (id) {

    this.canvas.clearSelection();

    if (id != null) {
        this.canvas.addToSelection([id]);

    }

    svgWorkArea.propertyShowAndModTree(id);

    window.parent.uiManager.toolBtnManager.btnTrigger('select_tool');

};


svgWorkArea.getSelectedElems = function () {

    return this.canvas.getSelectedElements();
};


svgWorkArea.deleteSelectedElems = function () {

    var selectedElemIds = this.canvas.getSelectedElementIds();

    this.canvas.clearSelection();

    svgWorkArea.deleteElements(selectedElemIds);
};


svgWorkArea.copyElems = function () {

    var selectedElemNodes = [];
    var _selectedElems = this.getSelectedElems();
    for (var i = 0; i < _selectedElems.length;i++) {
        var newNode = _selectedElems[i].cloneNode(true);
        selectedElemNodes.push(newNode);
    }

    return selectedElemNodes;

};

svgWorkArea.pasteElems = function (cache) {

    var src = cache.src;
    var dest = cache.dest;
    var elemNodes = cache.data;
    var canvas = this.canvas;
    var svgContentNode = canvas.svgContent.node();
    var elemIds = [];

    function updateAttrData (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            var _node = nodes[i];

            var _prefix = _node.id.split("_")[0];

            var newId = canvas.getSvgId(_prefix + '_');
            _node.id = newId;

            if (_node.tagName == 'g') {
                elemIds.push(_node.id);
                svgContentNode.appendChild(_node);

                svgCanvas.action.addSvgShape(canvas,_node, function (res) {
                    if ( res.eventStage == 'drag-start') {
                        if (res.opt == 'move') {
                            window.parent.document.body.setAttribute('action_type','move');
                        }
                        //svgWorkArea.canvas.clearSelection();
                    }
                    else if (res.eventStage == 'drag') {
                        $.each(svgWorkArea.canvas.selectedElemIds, function (index, _id) {
                            svgWorkArea.canvas.selectorManager.selectorMap[_id].resize();
                        });
                    }
                    else if (res.eventStage == 'drag-stop') {
                        if (res.opt == 'move') {
                            window.parent.document.body.setAttribute('action_type','select');
                        }
                    }
                });
            }

            if (src == dest) {
                if (_node.tagName == 'g') {

                    var ts = _node.getAttribute('transform');
                    var _offset = {x:50,y:50};
                    var newTs = svgCanvas.math.updateMoveTransform(ts,_offset);
                    _node.setAttribute('transform',newTs);
                }
            }
            else {
                if (_node.tagName == 'use') {
                    var _href = _node.getAttribute('href');
                    var _symbol = canvas.defs().select(_href).node();
                    if (_symbol == null) {
                        var frameWindow = window.parent.frames['frame_' + src].contentWindow;
                        var _defs = frameWindow.svgWorkArea.getCanvas().defs();
                        var srcSymbol = _defs.select(_href).node();

                        var cloneSymbol = srcSymbol.cloneNode(true);
                        canvas.defs().node().appendChild(cloneSymbol);

                    }
                }
            }

            var _childrenNodes = _node.children;
            if (_childrenNodes.length > 0) {
                updateAttrData(_childrenNodes);
            }

            if (_node.tagName == 'g') {
                svgWorkArea.addElement(_node.id);
            }

        }
    }

    updateAttrData(elemNodes);

    canvas.clearSelection();
    canvas.addToSelection(elemIds);

};



svgWorkArea.getElem = function (id) {

    return svgWorkArea.canvas.getElem(id);
};

svgWorkArea.getSVGContentNode = function () {
    return svgWorkArea.canvas.svgContent.node();
};

svgWorkArea.getSvgString = function () {
    return svgWorkArea.canvas.svgToString(svgWorkArea.canvas.svgContent.node(),0);
};




svgWorkArea.propertyShowAndModTree = function (id) {

    if (id) {

        if (!svgWorkArea.curSelectedItemId || svgWorkArea.curSelectedItemId != id) {
            window.parent.uiManager.modManager.selectItem(id);

            var curPageId = svgWorkArea.curPageId;
            window.parent.uiManager.propManager.load(curPageId, id);

            svgWorkArea.curSelectedItemId = id;
        }

    }
    else {
        window.parent.uiManager.modManager.unSelectItem();

        window.parent.uiManager.propManager.clear();

        svgWorkArea.curSelectedItemId = undefined;
    }


};