/**
 * Created by liuchaoyu on 2017-01-09.
 *
 * svg-canvas.js
 */


var svgCanvas = {
    'version':'1.0.0',
    'Canvas':{},
    'action':{},
    'shape':{},
    'select':{},
    'utilities':{},
    'math':{},
    'elemManager':{},
    'evtManager':{},
};



svgCanvas.init = function (containerId,config) {

    var size = config.size;

    var svg = d3.select('#' + containerId)
        .append('svg:svg')
        .attr({
            'id':config.id,
            'width':size[0],
            'height':size[1]
        });

    var svgContent = svg.append('svg:svg')
        .attr({
            'id':'svg_content'
        });

    //svg.append('svg:svg')
    //    .attr({
    //        'id':'selectorGroupManager'
    //    });


    svgContent.append('svg:defs');

    //var svg = SVG(containerId).size(size[0], size[1]);

    //svg.attr('id','svgRoot');

    return new svgCanvas.Canvas(svgContent,config.id);
};

svgCanvas.Canvas = function (svg,id) {

    this.svgContent = svg;

    this.svgRoot = d3.select(this.svgContent.node().parentNode);

    this.svgRootId = id;

    this.selectorManager = {};

    this.elemIds = [];

    this.selectedElemIds = [];

    this.svgIds = {};

    this.undoStack = [];

    this.redoStack = [];

    this.current_zoom = 1;

    this.NS = {
        HTML: 'http://www.w3.org/1999/xhtml',
        MATH: 'http://www.w3.org/1998/Math/MathML',
        SE: 'http://svg-edit.googlecode.com',
        SVG: 'http://www.w3.org/2000/svg',
        XLINK: 'http://www.w3.org/1999/xlink',
        XML: 'http://www.w3.org/XML/1998/namespace',
        XMLNS: 'http://www.w3.org/2000/xmlns/' // see http://www.w3.org/TR/REC-xml-names/#xmlReserved
    };

    this.selectRectInit();

};

svgCanvas.Canvas.prototype.defs = function () {

    return this.svgContent.select('defs');

};

svgCanvas.Canvas.prototype.getRoot = function () {

    return this.svgRoot;
};


svgCanvas.Canvas.prototype.addSvgIdPrefix = function (idPrefixs) {

    for (var i = 0; i < idPrefixs.length; i++) {

        var idPrefix = idPrefixs[i];

        this.svgIds[idPrefix] = new svgCanvas.shape.SvgId(idPrefix);

    }

};

svgCanvas.Canvas.prototype.getSvgId = function (idPrefix) {

    var svgIdObj = this.svgIds[idPrefix];

    return svgIdObj.getNextId(this);

};

svgCanvas.Canvas.prototype.addElemId = function (elemId) {

    if (this.elemIds.indexOf(elemId) == -1) {
        this.elemIds.push(elemId);
    }

};

svgCanvas.Canvas.prototype.removeElemId = function (elemId) {

    var index = this.elemIds.indexOf(elemId);
    if (index > -1) {
        this.elemIds.splice(index, 1);
    }

};

svgCanvas.Canvas.prototype.getElemIds = function () {

    return this.elemIds;

};

svgCanvas.Canvas.prototype.clear = function () {

    for (var i = 0; i < this.elemIds.length; i++) {

        svgCanvas.action.removeSvgShape(this.svgContent.node(),this.elemIds[i]);

    }

    this.elemIds = [];

    //todo 考虑是否要清空<defs>标签中的symbol

};

svgCanvas.Canvas.prototype.getElem = function (id) {

    var svgContent = this.svgContent.node();

    if (svgContent.querySelector) {
        // querySelector lookup
        return svgContent.querySelector('#' + id);
    }
    // jQuery lookup: twice as slow as xpath in FF
    return $(svgContent).find('[id=' + id + ']')[0];

};

svgCanvas.Canvas.prototype.getSelectedElementIds = function () {

    return this.selectedElemIds;
};

svgCanvas.Canvas.prototype.getSelectedElements = function () {

    var selectedElems = [];
    for (var i = 0; i < this.selectedElemIds.length; i++) {
        var elem = this.getElem(this.selectedElemIds[i]);
        selectedElems.push(elem);
    }

    return selectedElems;
};


svgCanvas.Canvas.prototype.addToSelection = function (elemIds) {

    var selectorMgr = this.selectorManager;

    var isShowGrip = true;
    if (elemIds.length > 1 || this.selectedElemIds.length > 0) {
        isShowGrip = false;
    }
    for (var i = 0; i < elemIds.length; i++) {
        if (this.selectedElemIds.indexOf(elemIds[i]) == -1) {

            this.selectedElemIds.push(elemIds[i]);
            var selector = selectorMgr.requestSelector(elemIds[i]);

            if (elemIds[i].indexOf('e-') > -1) {
                isShowGrip = false
            }
        }

        selector.showGrips(isShowGrip);
    }

};

svgCanvas.Canvas.prototype.cancelSelection = function (elemIds) {

    var selectorMgr = this.selectorManager;

    for (var i = 0; i < elemIds.length; i++) {

        var index = this.selectedElemIds.indexOf(elemIds[i]);
        if (index > -1) {

            selectorMgr.releaseSelector(elemIds[i]);

            this.selectedElemIds.splice(index,1);

        }

    }

};

svgCanvas.Canvas.prototype.clearSelection = function () {

    var selectorMgr = this.selectorManager;

    for (var i = 0; i < this.selectedElemIds.length; i++) {
        selectorMgr.releaseSelector(this.selectedElemIds[i]);
    }

    this.selectedElemIds = [];

};

svgCanvas.Canvas.prototype.getCurrentZoom = function () {

    return this.current_zoom;
};

svgCanvas.Canvas.prototype.setCurrentZoom = function (zoom) {

    this.current_zoom = zoom;
};

svgCanvas.Canvas.prototype.setNS = function (NS) {

    var t;
    for (t in NS) {
        this.NS[t] = NS[t];
    }

};

// return the svgedit.NS with key values switched and lowercase
svgCanvas.Canvas.prototype.getReverseNS = function() {'use strict';
    var reverseNS = {};
    $.each(this.NS, function(name, URI) {
        reverseNS[URI] = name.toLowerCase();
    });
    return reverseNS;
};


svgCanvas.Canvas.prototype.getResolution = function() {
//		var vb = svgcontent.getAttribute('viewBox').split(' ');
//		return {'w':vb[2], 'h':vb[3], 'zoom': current_zoom};

    var svgRootNode = this.svgRoot.node();
    var width = svgRootNode.getAttribute('width')/this.current_zoom;
    var height = svgRootNode.getAttribute('height')/this.current_zoom;

    return {
        'w': width,
        'h': height,
        'zoom': this.current_zoom
    };
};

svgCanvas.Canvas.prototype.selectRectInit = function () {

    var canvas = this;

    $('body').append('<div id=\'select_rect\'></div>');

    var selectRect = $('#select_rect');
    var selRectDom = selectRect[0];

    selectRect.css(
        {
            'position': 'absolute',
            'background-color': '#2b81af',
            'left':0,
            'top':0,
            'width':0,
            'height':0,
            'visibility': 'hidden',
            'opacity': 0.5,
            'zIndex':1000
        }
    );

    var downPos = {},
        upPos = {},
        downPress = false,
        isMultiSelect = false;


    var moveFunc = function (event) {

        var evt = window.event || event;

        if (event.button == 0) {
            if (downPress) {

                isMultiSelect = true;
                window.parent.document.body.setAttribute('action_type','multiSelect');

                selectRect.css('visibility', 'visible');

                var curX = (evt.pageX || evt.clientX);
                var curY = (evt.pageY || evt.clientY);

                var rWidth = Math.abs(curX - downPos.x);
                var rHeight = Math.abs(curY - downPos.y);

                var _left = Math.min(downPos.x, curX);
                var _top = Math.min(downPos.y, curY);

                selectRect.css('left', _left);
                selectRect.css('top', _top);

                selectRect.css({
                    'width': rWidth,
                    'height': rHeight
                });

                var selBox = svgCanvas.utilities.getElemBox(selRectDom);
                var _l = selBox.left, _t = selBox.top,
                    _w = selBox.width, _h = selBox.height;

                for (var i = 0; i < canvas.elemIds.length; i++) {

                    var _elemDom = $('#' + canvas.elemIds[i])[0];

                    var bbox = svgCanvas.utilities.getElemBox(_elemDom);

                    if (bbox.left >= _l && bbox.left + bbox.width <= _l + _w && bbox.top >= _t && bbox.top + bbox.height <= _t + _h) {

                        if (canvas.selectedElemIds.indexOf(canvas.elemIds[i]) == -1) {
                            canvas.addToSelection([canvas.elemIds[i]]);
                        }
                    }
                    else {
                        if (canvas.selectedElemIds.indexOf(canvas.elemIds[i]) > -1) {
                            canvas.cancelSelection([canvas.elemIds[i]]);
                        }
                    }

                }

            }
        }

        clearEventBubble(evt);

    };

    var downFunc = function (event) {

        if (event.button == 0) {

            var actionType = window.parent.document.body.getAttribute('action_type');
            if (event.target.tagName == 'svg' && event.target.id == 'svgRoot' && actionType == 'select') {
                downPress = true;
                downPos.x = (event.pageX || event.clientX);
                downPos.y = (event.pageY || event.clientY);

                //todo 将加入ctrl键追加选择
                canvas.clearSelection();

            }

        }

        clearEventBubble(event);

    };

    var upFunc = function (event) {

        if (downPress) {
            downPress = false;

            if (isMultiSelect) {
                isMultiSelect = false;

                upPos.x = event.pageX;
                upPos.y = event.pageY;

                selectRect.css('visibility','hidden');

                window.parent.document.body.setAttribute('action_type','select');

            }

        }

    };

    svgCanvas.evtManager.mousedown(document,downFunc);
    svgCanvas.evtManager.mousemove(document,moveFunc);
    svgCanvas.evtManager.mouseup(document,upFunc);

};


svgCanvas.shape.SvgId = function (idPrefix,startIndex) {

    this.prefix = idPrefix || 'svg_';

    this.index = startIndex || 1;

};

svgCanvas.shape.SvgId.prototype.setIdPrefix = function (idPrefix) {

    this.prefix = idPrefix;

};

svgCanvas.shape.SvgId.prototype.getIdPrefix = function () {

    return this.prefix;

};

svgCanvas.shape.SvgId.prototype.setIndex = function (startIndex) {

    this.index = startIndex;

};

svgCanvas.shape.SvgId.prototype.getId = function () {

    return this.prefix + (this.index).toString();

};


svgCanvas.shape.SvgId.prototype.getNextId = function (canvas) {

    var oldObjNum = this.index;

    var id = this.getId();
    while (canvas.getElem(id)) {

        this.index++;
        id = this.getId();

    }

    return id;

};


svgCanvas.action.addSvgShape = function (canvas,elemAttrObj,callback) {

    var targetElem;
    if (elemAttrObj.elemParent && elemAttrObj.elemType && elemAttrObj.elemAttr) {
        var parent = elemAttrObj.elemParent;
        var elemType = elemAttrObj.elemType;
        var elemAttr = elemAttrObj.elemAttr;

        var elem = parent.append(elemType)
            .attr(elemAttr);

        targetElem = elem.node();
    }
    else {
        targetElem = elemAttrObj;
    }

    var lastPos = {
        x:0,
        y:0,
        fixX:0,
        fixY:0
    };

    var relDis = {};

    var orgTs = '',
        isMultiMove = false;

    var dragAttr = {
        'start': function (event,ui) {

            if (event.target.id.indexOf('e-') > -1) {
                return true;
            }

            var fixedPos = svgCanvas.utilities.getFixPos({x:event.pageX,y:event.pageY});
            lastPos.x = fixedPos.x;
            lastPos.y = fixedPos.y;

            if (canvas.selectedElemIds.length > 1) {
                isMultiMove = true;
            }

            for (var i = 0; i < canvas.selectedElemIds.length; i++) {

                var _elemId = canvas.selectedElemIds[i];
                var _elemDom = canvas.getElem(_elemId);
                var _elemBox = svgCanvas.utilities.getElemBox(_elemDom);

                relDis[_elemId] = {
                    'x' : _elemBox.left - lastPos.x,
                    'y' : _elemBox.top - lastPos.y
                };
            }

            //var centerX = event.target.getAttribute('center-x');
            //var centerY = event.target.getAttribute('center-y');
            //var boxAngle = event.target.getAttribute('box-angle');
            //boxAngle = boxAngle ? boxAngle : 0;
            orgTs = event.target.getAttribute('transform');

            //var rTs = 'rotate(' + boxAngle + ',' + centerX + ',' + centerY + ')';
            //var newTs = svgCanvas.math.calcRotateTransform(orgTs,rTs);
            //
            //event.target.setAttribute('transform',newTs);

            /**var bbox = svgCanvas.utilities.getElemBox(event.target);*/

            //event.target.setAttribute('transform',orgTs);

            /**lastPos.fixX = bbox.left - lastPos.x;
            lastPos.fixY = bbox.top - lastPos.y;*/

            callback({id:event.target.id,opt:'move',eventStage:'drag-start'});
        },
        'drag': function (event,ui) {

            var fixedPos = svgCanvas.utilities.getFixPos({x:event.pageX,y:event.pageY});
            //var moveX = fixedPos.x + lastPos.fixX;
            //var moveY = fixedPos.y + lastPos.fixY;

            //var boxAngle = event.target.getAttribute('box-angle');
            if (isMultiMove) {

                //
                //lastPos.x = moveX;
                //lastPos.y = moveY;

            }

            for (var i = 0; i < canvas.selectedElemIds.length; i++) {

                var _elem;

                var _elemId = canvas.selectedElemIds[i];

                if (_elemId.indexOf('e-') > -1) {
                    continue;
                }

                if (_elemId != event.target.id) {
                    _elem = canvas.getElem(_elemId);
                }
                else {
                    _elem = event.target;
                }

                var moveX = fixedPos.x + relDis[_elemId].x;
                var moveY = fixedPos.y + relDis[_elemId].y;

                var newTs = svgCanvas.math.rebuildTransform(_elem,{x:moveX,y:moveY});

                _elem.setAttribute('transform',newTs);
            }

            //var centerX = event.target.getAttribute('center-x');
            //var centerY = event.target.getAttribute('center-y');
            //boxAngle = boxAngle ? boxAngle : 0;

            callback({id:event.target.id,opt:'move',eventStage:'drag'});

        },
        'stop': function (event, ui) {

            var fixedPos = svgCanvas.utilities.getFixPos({x:event.pageX,y:event.pageY});

            //var moveX = fixedPos.x + lastPos.fixX;
            //var moveY = fixedPos.y + lastPos.fixY;
            //lastPos.x = moveX;
            //lastPos.y = moveY;

            if (isMultiMove) {

                //var _dis_x = moveX - lastPos.x;
                //var _dis_y = moveY - lastPos.y;

            }

            for (var i = 0; i < canvas.selectedElemIds.length; i++) {
                var _elem;

                var _elemId = canvas.selectedElemIds[i];

                if (_elemId.indexOf('e-') > -1) {
                    continue;
                }

                if (_elemId != event.target.id) {
                    _elem = canvas.getElem(_elemId);
                }
                else {
                    _elem = event.target;
                }

                var moveX = fixedPos.x + relDis[_elemId].x;
                var moveY = fixedPos.y + relDis[_elemId].y;

                var boxAngle = _elem.getAttribute('box-angle');
                var centerX = _elem.getAttribute('center-x');
                var centerY = _elem.getAttribute('center-y');
                boxAngle = boxAngle ? boxAngle : 0;

                var ts = svgCanvas.math.rebuildTransform(_elem,{x:moveX,y:moveY});

                var rTs = 'rotate(' + boxAngle + ',' + centerX + ',' + centerY + ')';
                var newTs = svgCanvas.math.calcRotateTransform(ts,rTs);
                _elem.setAttribute('transform',newTs);
            }

            callback({id:event.target.id,opt:'move',eventStage:'drag-stop'});

        }

    };

    svgCanvas.evtManager.drag(targetElem,dragAttr);

    //todo 将加入元素列表管理，用于框选元素
    canvas.addElemId(targetElem.id);

    return elem;
};

svgCanvas.action.removeSvgShape = function (canvas,elem) {

    var parent = elem.parent;
    var id = elem.id;

    d3.select('#' + parent.id)
        .select('#' + id)
        .remove();

    canvas.removeElemId(id);

};

svgCanvas.select.Selector = function (id, elemId, manager) {

    // this is the selector's unique number
    this.id = id;

    // this is a flag used internally to track whether the selector is being used or not
    this.locked = true;

    this.manager = manager;

    // this holds a reference to the element for which this selector is being used
    this.selectedElement = d3.select('#' + elemId).node();

    var _selectorGroup = d3.select('#selectorGroupManager')
        .append('svg:g')
        .attr({
            'id':('selectorGroup' + id)
        });

    this.selectorGroup = _selectorGroup.node();

    var _selectorRect = _selectorGroup.append('svg:rect')
        .attr({
            'id': ('selectedBox' + this.id),
            'fill': 'none',
            'stroke': '#22C',
            'stroke-width': '1',
            'stroke-dasharray': '5,5',
            // need to specify this so that the rect is not selectable
            'style': 'pointer-events:none'
        });

    this.selectorRect = _selectorRect.node();

    // this holds a reference to the grip coordinates for this selector
    this.gripCoords = {
        'nw': null,
        'n' : null,
        'ne': null,
        'e' : null,
        'se': null,
        's' : null,
        'sw': null,
        'w' : null
    };

    this.reset(this.selectedElement);

};

svgCanvas.select.Selector.prototype.reset = function(e) {
    this.locked = true;
    this.selectedElement = e;
    this.resize();
    this.selectorGroup.setAttribute('display', 'inline');
};

svgCanvas.select.Selector.prototype.resize = function() {
    var selectedBox = this.selectorRect,
        mgr = this.manager,
        selectedGrips = mgr.selectorGrips,
        selectedGripsRef = mgr.selectorGripsRef,
        selected = this.selectedElement,
        sw = selected.getAttribute('stroke-width'),
        angle = selected.getAttribute('box-angle'),
        scale_x = selected.getAttribute('box-scale-x'),
        scale_y = selected.getAttribute('box-scale-y');
        //current_zoom = this.svgFactory.getCurrentZoom();

    angle = angle ? angle : 0;
    scale_x = scale_x ? scale_x : 1;
    scale_y = scale_y ? scale_y : 1;

    mgr.selectorGripsGroup.setAttribute('cur-selected-elem-id',selected.id);
    mgr.rotateGrip.setAttribute('cur-selected-elem-id',selected.id);

    var centerX,centerY,
        boxWidth,boxHeight,
        bbox;

    var orgTs = selected.getAttribute('transform');

    if (angle != 0) {

        centerX = selected.getAttribute('center-x');
        centerY = selected.getAttribute('center-y');

        var rTs = 'rotate(0' + ',' + (centerX) + ',' + (centerY) + ')';

        var newTs = svgCanvas.math.calcRotateTransform(orgTs,rTs);
        selected.setAttribute('transform',newTs);

    }

    bbox = svgCanvas.utilities.getElemBox(selected);

    if (orgTs) {
        selected.setAttribute('transform', orgTs);
    }

    centerX = bbox.left + bbox.width /2;
    centerY = bbox.top + bbox.height /2;
    boxWidth = bbox.width;
    boxHeight = bbox.height;

    selected.setAttribute('center-x', centerX);
    selected.setAttribute('center-y', centerY);
    selected.setAttribute('box-width', boxWidth);
    selected.setAttribute('box-height', boxHeight);

    selectedBox.setAttribute('x', bbox.left);
    selectedBox.setAttribute('y', bbox.top);
    selectedBox.setAttribute('width', bbox.width);
    selectedBox.setAttribute('height', bbox.height);


    var _radius = parseFloat(selectedGrips['n'].getAttribute('r'));

    var nwCoords = [bbox.left,bbox.top],
        neCoords = [bbox.right,bbox.top],
        swCoords = [bbox.left,bbox.bottom],
        seCoords = [bbox.right,bbox.bottom],
        nCoords = [bbox.left + bbox.width /2, bbox.top],
        wCoords = [bbox.left, bbox.top + bbox.height /2],
        eCoords = [bbox.right, bbox.top + bbox.height /2],
        sCoords = [bbox.left + bbox.width /2,bbox.bottom];

    function symmetryConvert (dir) {

        var dirs = dir.split('');

        var result = '';
        for (var i = 0; i < dirs.length; i++) {

            var _dir = dirs[i];
            var _result = '';
            switch (_dir) {
                case 'n':
                    _result = 's';
                    break;
                case 'e':
                    _result = 'w';
                    break;
                case 's':
                    _result = 'n';
                    break;
                case 'w':
                    _result = 'e';
                    break;

                default:
            }

            result += _result;
        }

        return result;
    }


    var scaleTypes = {
        'nw': 'xy',
        'ne': 'xy',
        'sw': 'xy',
        'se': 'xy',
        'n':  'y',
        'w':  'x',
        'e':  'x',
        's':  'y'
    };


    this.gripCoords = {
        'nw': nwCoords,
        'ne': neCoords,
        'sw': swCoords,
        'se': seCoords,
        'n':  nCoords,
        'w':  wCoords,
        'e':  eCoords,
        's':  sCoords
    };
    var dir;
    for (dir in this.gripCoords) {
        var coords = this.gripCoords[dir];
        selectedGrips[dir].setAttribute('cx', coords[0]);
        selectedGrips[dir].setAttribute('cy', coords[1]);

        var inverseDir = symmetryConvert(dir);
        var refCoords = this.gripCoords[inverseDir];
        selectedGripsRef[dir] = {
            refCoord:{
                x:refCoords[0],
                y:refCoords[1],
            },
            scaleType:scaleTypes[dir]
        }
    }

     //we want to go 20 pixels in the negative transformed y direction, ignoring scale
    mgr.rotateGripConnector.setAttribute('x1', bbox.left + bbox.width /2);
    mgr.rotateGripConnector.setAttribute('y1', bbox.top);
    mgr.rotateGripConnector.setAttribute('x2', bbox.left + bbox.width /2);
    mgr.rotateGripConnector.setAttribute('y2', bbox.top - (_radius*5));

    mgr.rotateGrip.setAttribute('cx', bbox.left + bbox.width /2);
    mgr.rotateGrip.setAttribute('cy', bbox.top - (_radius*5));


    var rotateTs = 'rotate(' + angle + ',' + centerX + ',' + centerY + ')';
    mgr.selectorGripsGroup.setAttribute('transform',rotateTs);
    selectedBox.setAttribute('transform',rotateTs);
//	}
};



svgCanvas.select.Selector.prototype.updateGripCursors = function(angle) {
    var dir,
        dir_arr = [],
        steps = Math.round(angle / 45);
    if (steps < 0) {steps += 8;}
    for (dir in selectorManager_.selectorGrips) {
        dir_arr.push(dir);
    }
    while (steps > 0) {
        dir_arr.push(dir_arr.shift());
        steps--;
    }
    var i = 0;
    for (dir in selectorManager_.selectorGrips) {
        selectorManager_.selectorGrips[dir].setAttribute('style', ('cursor:' + dir_arr[i] + '-resize'));
        i++;
    }
};

svgCanvas.select.Selector.prototype.showGrips = function(show) {
    var bShow = show ? 'inline' : 'none';
    this.manager.selectorGripsGroup.setAttribute('display', bShow);
    var elem = this.selectedElement;
    this.hasGrips = show;
    if (elem && show) {
        //this.selectorGroup.appendChild(selectorManager_.selectorGripsGroup);
        //this.updateGripCursors(svgedit.utilities.getRotationAngle(elem));
    }
};

svgCanvas.select.SelectorManager = function(svgFactory) {

    this.svgFactory = svgFactory;

    this.selectorGroupManager = null;

    // this is a special rect that is used for multi-select
    this.rubberBandBox = null;

    // this will hold objects of type svgedit.select.Selector (see above)
    this.selectors = [];

    // this holds a map of SVG elements to their Selector object
    this.selectorMap = {};

    // this holds a reference to the grip elements
    this.selectorGrips = {
        'nw': null,
        'n' :  null,
        'ne': null,
        'e' :  null,
        'se': null,
        's' :  null,
        'sw': null,
        'w' :  null
    };

    this.selectorGripsRef = {
        'nw': null,
        'n' :  null,
        'ne': null,
        'e' :  null,
        'se': null,
        's' :  null,
        'sw': null,
        'w' :  null
    };


    this.selectorGripsGroup = null;
    this.rotateGripConnector = null;
    this.rotateGrip = null;

    this.initGroup();
};


svgCanvas.select.SelectorManager.prototype.initGroup = function() {
    // remove old selector parent group if it existed
    if (this.selectorGroupManager && this.selectorGroupManager.parentNode) {
        this.selectorGroupManager.parentNode.removeChild(this.selectorGroupManager);
    }

    // create parent selector group and add it to svgroot
    var _selectorGroupManager = this.svgFactory.getRoot().append('svg:g')
        .attr({
            'id':'selectorGroupManager'
        });
    this.selectorGroupManager = _selectorGroupManager.node();

    var _selectorGripsGroup = _selectorGroupManager.append('svg:g')
        .attr({
            'id':'selectorGripsGroup',
            'display' : 'none'
        });
    this.selectorGripsGroup = _selectorGripsGroup.node();

    this.selectorMap = {};
    this.selectors = [];
    this.rubberBandBox = null;

    // add the corner grips
    var dir;
    for (dir in this.selectorGrips) {

        var _grip = _selectorGripsGroup.append('svg:circle')
            .attr({
                'id': ('selectorGrip_resize_' + dir),
                'fill': '#22C',
                'r': 4,
                'style': ('cursor:' + dir + '-resize'),
                'stroke-width': 2,
                'pointer-events': 'all'
            });

        var grip = _grip.node();

        $.data(grip, 'dir', dir);
        $.data(grip, 'type', 'resize');
        this.selectorGrips[dir] = grip;

    }

    // add rotator elems
    var _rotateGripConnector = _selectorGripsGroup.append('svg:line')
        .attr({
            'id': ('selectorGrip_rotateconnector'),
            'stroke': '#22C',
            'stroke-width': '1'
        });
    this.rotateGripConnector = _rotateGripConnector.node();


    var _rotateGrip = _selectorGripsGroup.append('svg:circle')
        .attr({
            'id': 'selectorGrip_rotate',
            'fill': 'lime',
            'r': 4,
            'stroke': '#22C',
            'stroke-width': 2,
            'style': 'cursor:url(' + '../' + window.parent.extendConfig.image_path + 'rotate.png) 12 12, auto;'
        });

    this.rotateGrip = _rotateGrip.node();

    $.data(this.rotateGrip, 'type', 'rotate');

};


svgCanvas.select.SelectorManager.prototype.addResizeAndRotateFunc = function (callback) {

    var _selectorGripsRef = this.selectorGripsRef;
    var mgr = this;

    var selectedElem;
    var orgTs;

    var dir;
    for (dir in this.selectorGrips) {

        var grip = this.selectorGrips[dir];

        grip.setAttribute('lastPosX','0');
        grip.setAttribute('lastPosY','0');

        var dragAttr = {
            'start': function (event,ui) {

                var fixedPos = svgCanvas.utilities.getFixPos({x:event.pageX,y:event.pageY});
                event.target.setAttribute('lastPosX',fixedPos.x);
                event.target.setAttribute('lastPosY',fixedPos.y);

                var groupNode = event.target.parentNode;
                var selectedElemId = groupNode.getAttribute('cur-selected-elem-id');

                selectedElem = document.getElementById(selectedElemId);

                orgTs = selectedElem.getAttribute('transform');

                callback({id:selectedElemId,opt:'resize',eventStage:'drag-start'});

            },
            'drag': function (event,ui) {
                var _dir = $.data(event.target, 'dir');

                var _ref = _selectorGripsRef[_dir];

                var lastPosX = parseFloat(event.target.getAttribute('lastPosX'));
                var lastPosY = parseFloat(event.target.getAttribute('lastPosY'));

                var fixedPos = svgCanvas.utilities.getFixPos({x:event.pageX,y:event.pageY});

                var tsl = 'translate(' + _ref.refCoord.x + ',' + _ref.refCoord.y + ')';
                var tslRevert = 'translate(' + ( - _ref.refCoord.x) + ',' + ( - _ref.refCoord.y) + ')';

                var scaleX,scaleY;
                switch (_ref.scaleType) {
                    case 'x':
                        scaleX = (fixedPos.x - _ref.refCoord.x) / (lastPosX - _ref.refCoord.x);
                        scaleY = 1;
                        break;
                    case 'y':
                        scaleX = 1;
                        scaleY = (fixedPos.y - _ref.refCoord.y) / (lastPosY - _ref.refCoord.y);

                        break;
                    case 'xy':
                        scaleX = (fixedPos.x - _ref.refCoord.x) / (lastPosX - _ref.refCoord.x);
                        scaleY = (fixedPos.y - _ref.refCoord.y) / (lastPosY - _ref.refCoord.y);
                        break;

                    default:

                }

                var tsS = 'scale(' + scaleX + ' ' + scaleY + ')';

                var ts =  tsl + ' ' + tsS + ' ' + tslRevert + ' ' + orgTs;

                selectedElem.setAttribute('transform',ts);

                mgr.selectorMap[selectedElem.id].resize();

                callback({id:selectedElem.id,opt:'resize',eventStage:'drag'});

            },
            'stop': function (event, ui) {

                var fixedPos = svgCanvas.utilities.getFixPos({x:event.pageX,y:event.pageY});
                //lastPos.x = fixedPos.x;
                //lastPos.y = fixedPos.y;

                var newTs = svgCanvas.math.rebuildTransform(selectedElem);

                selectedElem.setAttribute('transform',newTs);

                callback({id:selectedElem.id,opt:'resize',eventStage:'drag-stop'});
            }

        };

        svgCanvas.evtManager.drag(grip,dragAttr);
    }

    var rotateGrip = mgr.rotateGrip;


    var dragAttr = {
        'start': function (event,ui) {

            var fixedPos = svgCanvas.utilities.getFixPos({x:event.pageX,y:event.pageY});
            event.target.setAttribute('lastPosX',fixedPos.x);
            event.target.setAttribute('lastPosY',fixedPos.y);

            var rotateGrip = event.target;
            var selectedElemId = rotateGrip.getAttribute('cur-selected-elem-id');

            selectedElem = document.getElementById(selectedElemId);

            orgTs = selectedElem.getAttribute('transform');

            callback({id:selectedElemId,opt:'rotate',eventStage:'drag-start'});

        },
        'drag': function (event,ui) {

            var lastPosX = parseFloat(event.target.getAttribute('lastPosX'));
            var lastPosY = parseFloat(event.target.getAttribute('lastPosY'));

            var fixedPos = svgCanvas.utilities.getFixPos({x:event.pageX,y:event.pageY});

            var centerX = parseFloat(selectedElem.getAttribute('center-x'));
            var centerY = parseFloat(selectedElem.getAttribute('center-y'));
            var scale_x = parseFloat(selectedElem.getAttribute('box-scale-x'));
            var scale_y = parseFloat(selectedElem.getAttribute('box-scale-y'));
            scale_x = scale_x ? scale_x : 1;
            scale_y = scale_y ? scale_y : 1;


            var rAngle = svgCanvas.utilities.calcRotateAngle(fixedPos.x,fixedPos.y,centerX,centerY);

            selectedElem.setAttribute('box-angle',rAngle);

            var tsR = 'rotate(' + rAngle + ',' + (centerX) + ',' + (centerY) + ')';

            var newTs = svgCanvas.math.calcRotateTransform(orgTs,tsR);

            selectedElem.setAttribute('transform',newTs);

            mgr.selectorMap[selectedElem.id].resize();

            callback({id:selectedElem.id,opt:'rotate',eventStage:'drag'});

        },
        'stop': function (event, ui) {

            var fixedPos = svgCanvas.utilities.getFixPos({x:event.pageX,y:event.pageY});
            //lastPos.x = fixedPos.x;
            //lastPos.y = fixedPos.y;

            //var newTs = svgCanvas.math.rebuildTransform(selectedElem);

            //selectedElem.setAttribute('transform',newTs);

            callback({id:selectedElem.id,opt:'rotate',eventStage:'drag-stop'});
        }
    };

    svgCanvas.evtManager.drag(rotateGrip,dragAttr);



};


svgCanvas.select.SelectorManager.prototype.requestSelector = function(elemId) {
    if (elemId == null) {return null;}
    var i,
        N = this.selectors.length;
    // If we've already acquired one for this element, return it.
    if (typeof(this.selectorMap[elemId]) == 'object') {
        this.selectorMap[elemId].locked = true;
        return this.selectorMap[elemId];
    }
    for (i = 0; i < N; ++i) {
        if (this.selectors[i] && !this.selectors[i].locked) {
            this.selectors[i].locked = true;
            this.selectors[i].reset(this.svgFactory.getElem(elemId));
            this.selectorMap[elemId] = this.selectors[i];
            return this.selectors[i];
        }
    }
    // if we reached here, no available selectors were found, we create one
    this.selectors[N] = new svgCanvas.select.Selector(N, elemId, this);
    //this.selectorGroupManager.appendChild(this.selectors[N].selectorGroup);
    this.selectorMap[elemId] = this.selectors[N];
    return this.selectors[N];
};

svgCanvas.select.SelectorManager.prototype.releaseSelector = function(elemId) {
    if (elemId == null) {return;}
    var i,
        N = this.selectors.length,
        sel = this.selectorMap[elemId];
    if (!sel.locked) {
        // TODO(codedread): Ensure this exists in this module.
        console.log('WARNING! selector was released but was already unlocked');
    }
    for (i = 0; i < N; ++i) {
        if (this.selectors[i] && this.selectors[i] == sel) {
            delete this.selectorMap[elemId];
            sel.locked = false;
            sel.selectedElement = null;
            sel.showGrips(false);

            // remove from DOM and store reference in JS but only if it exists in the DOM
            try {
                sel.selectorGroup.setAttribute('display', 'none');
            } catch(e) { }

            break;
        }
    }
};

svgCanvas.select.init = function(svgFactory) {
    svgFactory.selectorManager = new svgCanvas.select.SelectorManager(svgFactory);
};

svgCanvas.select.getSelectorManager = function(svgFactory) {
    return svgFactory.selectorManager;
};


svgCanvas.evtManager.mouseover = function (elemNode) {

    $(elemNode).mouseover(function (e) {
        $(e.target).css(cursor,'move');
    });


};

svgCanvas.evtManager.mouseout = function (elemNode) {
    $(elemNode).mouseover(function (e) {
        $(e.target).css(cursor,'auto');
    });
};

svgCanvas.evtManager.drag = function (elemNode, dropAttr) {

    var dragEvtObj = {};
    if (dropAttr.start && $.isFunction(dropAttr.start) == true) {
        dragEvtObj['start'] = dropAttr.start;
    }
    if (dropAttr.drag && $.isFunction(dropAttr.drag) == true) {
        dragEvtObj['drag'] = dropAttr.drag;
    }
    if (dropAttr.stop && $.isFunction(dropAttr.stop) == true) {
        dragEvtObj['stop'] = dropAttr.stop;
    }


    $(elemNode).draggable(dragEvtObj);

};

svgCanvas.evtManager.mousedown = function (elemNode, func) {

    $(elemNode).bind('mousedown',func);

};

svgCanvas.evtManager.mousemove = function (elemNode, func) {

    $(elemNode).bind('mousemove',func);

};

svgCanvas.evtManager.mouseup = function (elemNode, func) {

    $(elemNode).bind('mouseup',func);

};






var _bodyMarginTop;
var _bodyMarginLeft;

svgCanvas.utilities.getElemBox = function (elem) {

    var rect = elem.getBoundingClientRect();

    if (_bodyMarginTop == undefined || _bodyMarginLeft == undefined) {
        var _body = $('body');
        _bodyMarginTop = parseFloat(_body.css('margin-top'));
        _bodyMarginLeft = parseFloat(_body.css('margin-left'));
    }

    /** 用于兼容IE，以下值，IE为2，其他浏览器为0 */
    var top = document.documentElement.clientTop;
    var left= document.documentElement.clientLeft;

    var scrollLeft = document.documentElement.scrollLeft + document.body.scrollLeft;
    var scrollTop = document.documentElement.scrollTop + document.body.scrollTop;


    return{
        top : rect.top - top - _bodyMarginTop + scrollTop,
        bottom : rect.bottom - top - _bodyMarginTop + scrollTop,
        left : rect.left - left - _bodyMarginLeft + scrollLeft,
        right : rect.right - left - _bodyMarginLeft + scrollLeft,
        width : rect.width,
        height : rect.height
    }
};

svgCanvas.utilities.getFixPos = function (posObj) {

    if (_bodyMarginTop == undefined || _bodyMarginLeft == undefined) {
        var _body = $('body');
        _bodyMarginTop = parseFloat(_body.css('margin-top'));
        _bodyMarginLeft = parseFloat(_body.css('margin-left'));
    }

    return {
        x : posObj.x - _bodyMarginLeft,
        y : posObj.y - _bodyMarginTop
    }

};

svgCanvas.utilities.calcRotateAngle = function (x,y,refX,refY) {

    var dx = x - refX;
    var dy = y - refY;
    var _a = 0;

    if (dx == 0 && dy > 0) {
        _a = 180;
    }
    else if (dx == 0 && dy < 0) {
        _a = 0;
    }
    else {
        var angle = Math.atan2(dy, dx);
        _a = 90 + Math.round(180*angle/Math.PI);
    }

    return _a;
};

svgCanvas.utilities.toXml = function(str) {
    // &apos; is ok in XML, but not HTML
    // &gt; does not normally need escaping, though it can if within a CDATA expression (and preceded by "]]")
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/, '&#x27;');
};

svgCanvas.utilities.fromXml = function(str) {
    return $('<p/>').html(str).text();
};

svgCanvas.utilities.cleanupElement = function(element) {
    var uselessAttrs = [
        'class',
    ];

    for (var i = 0; i < uselessAttrs.length; i++) {
        if(element.getAttribute(uselessAttrs[i])) {
            element.removeAttribute(uselessAttrs[i]);
        }
    }
};


svgCanvas.math.calcRotateTransform = function (ts,newTs) {

    var resultTs = '';
    var tsList = ts.split(' ');
    var isExist = false;
    for (var i = 0; i < tsList.length; i++) {
        if (tsList[i].indexOf('rotate') > -1) {
            tsList[i] = newTs;
            isExist = true;
        }

        resultTs += tsList[i] + ' ';
    }

    if (isExist == false) {
        resultTs += newTs;
    }

    return resultTs;
};


svgCanvas.math.updateMoveTransform = function (ts, offset) {

    var resultTs = '';
    var tsList = ts.split(' ');
    var isExist = false;
    for (var i = 0; i < tsList.length; i++) {
        if (tsList[i].indexOf('matrix') > -1) {

            var reg = /\([^\)]+\)/g;
            var _a = tsList[i].match(reg)[0].replace('(','').replace(')','').split(',');
            var _x = parseFloat(_a[4]) + parseFloat(offset.x);
            var _y = parseFloat(_a[5]) + parseFloat(offset.y);

            tsList[i] = 'matrix(1,0,0,1,' + _x + ',' + _y + ')';
            isExist = true;
        }

        resultTs += tsList[i] + ' ';
    }

    return resultTs;

};

svgCanvas.math.rebuildTransform = function (elem,movePos) {

    var orgWidth = parseFloat(elem.getAttribute('org-width'));
    var orgHeight = parseFloat(elem.getAttribute('org-height'));

    var scaleX = parseFloat(elem.getAttribute('box-width')) / orgWidth;
    var scaleY = parseFloat(elem.getAttribute('box-height')) / orgHeight;

    var moveX = 0;
    var moveY = 0;
    if (movePos) {
        moveX = movePos.x;
        moveY = movePos.y;
    }
    else{
        var bbox = svgCanvas.utilities.getElemBox(elem);
        moveX = bbox.left;
        moveY = bbox.top;
    }

    var centerX = elem.getAttribute('center-x');
    var centerY = elem.getAttribute('center-y');


    var boxAngle = elem.getAttribute('box-angle');

    boxAngle = boxAngle ? boxAngle : 0;
    //
    var rotateTs = 'rotate(' + boxAngle + ',' + centerX + ',' + centerY + ')';

    //var moveX = parseFloat(elem.getAttribute('center-x')) - parseFloat(elem.getAttribute('box-width'))/2;
    //var moveY = parseFloat(elem.getAttribute('center-y')) - parseFloat(elem.getAttribute('box-height'))/2;

    var moveTs = 'matrix(1,0,0,1,' + moveX + ',' + moveY + ')';

    var ts = rotateTs + ' translate(' + moveX + ',' + moveY + ') ' + 'scale(' + scaleX + ',' + scaleY + ') translate(' + (-moveX) + ',' + (-moveY) + ') '
        + moveTs;

    elem.setAttribute('box-scale-x',scaleX);
    elem.setAttribute('box-scale-y',scaleY);

    return ts;

};


var svgToString = svgCanvas.Canvas.prototype.svgToString = function(elem, indent) {
    var out = [],
        toXml = svgCanvas.utilities.toXml,
        NS = this.NS,
        nsMap = this.getReverseNS();
    //var unit = curConfig.baseUnit;
    //var unit_re = new RegExp('^-?[\\d\\.]+' + unit + '$');

    if (elem) {
        svgCanvas.utilities.cleanupElement(elem);
        var attrs = elem.attributes,
            attr,
            i,
            childs = elem.childNodes;

        for (i = 0; i < indent; i++) {out.push(' ');}
        out.push('<'); out.push(elem.nodeName);
        if (elem.id === 'svg_content') {
            // Process root element separately
            var res = this.getResolution();

            var vb = '';
            // TODO: Allow this by dividing all values by current baseVal
            // Note that this also means we should properly deal with this on import
//			if (curConfig.baseUnit !== 'px') {
//				var unit = curConfig.baseUnit;
//				var unit_m = svgedit.units.getTypeMap()[unit];
//				res.w = svgedit.units.shortFloat(res.w / unit_m)
//				res.h = svgedit.units.shortFloat(res.h / unit_m)
//				vb = ' viewBox="' + [0, 0, res.w, res.h].join(' ') + '"';
//				res.w += unit;
//				res.h += unit;
//			}

            //if (unit !== 'px') {
            //    res.w = svgedit.units.convertUnit(res.w, unit) + unit;
            //    res.h = svgedit.units.convertUnit(res.h, unit) + unit;
            //}

            out.push(' width="' + res.w + '" height="' + res.h + '"' + vb + ' xmlns="' + NS.SVG + '"');

            var nsuris = {};

            // Check elements for namespaces, add if found
            //$(elem).find('*').andSelf().each(function() {
            //    var el = this;
            //    // for some elements have no attribute
            //    var uri = this.namespaceURI;
            //    if(uri && !nsuris[uri] && nsMap[uri] && nsMap[uri] !== 'xmlns' && nsMap[uri] !== 'xml' ) {
            //        nsuris[uri] = true;
            //        out.push(' xmlns:' + nsMap[uri] + '="' + uri +'"');
            //    }
            //
            //    $.each(this.attributes, function(i, attr) {
            //        var uri = attr.namespaceURI;
            //        if (uri && !nsuris[uri] && nsMap[uri] !== 'xmlns' && nsMap[uri] !== 'xml' ) {
            //            nsuris[uri] = true;
            //            out.push(' xmlns:' + nsMap[uri] + '="' + uri +'"');
            //        }
            //    });
            //});

            i = attrs.length;
            var attr_names = ['width', 'height', 'xmlns', 'x', 'y', 'viewBox', 'id', 'overflow'];
            while (i--) {
                attr = attrs.item(i);
                var attrVal = toXml(attr.value);

                // Namespaces have already been dealt with, so skip
                if (attr.nodeName.indexOf('xmlns:') === 0) {continue;}

                // only serialize attributes we don't use internally
                if (attrVal != '' && attr_names.indexOf(attr.localName) == -1) {

                    if (!attr.namespaceURI || nsMap[attr.namespaceURI]) {
                        out.push(' ');
                        out.push(attr.nodeName); out.push('="');
                        out.push(attrVal); out.push('"');
                    }
                }
            }
        } else {
            // Skip empty defs
            if (elem.nodeName === 'defs' && !elem.firstChild) {return;}

            var moz_attrs = ['-moz-math-font-style', '_moz-math-font-style'];
            for (i = attrs.length - 1; i >= 0; i--) {
                attr = attrs.item(i);
                var attrVal = toXml(attr.value);
                //remove bogus attributes added by Gecko
                if (moz_attrs.indexOf(attr.localName) >= 0) {continue;}
                if (attrVal != '') {
                    if (attrVal.indexOf('pointer-events') === 0) {continue;}
                    if (attr.localName === 'class' && attrVal.indexOf('se_') === 0) {continue;}
                    out.push(' ');
                    //if (attr.localName === 'd') {attrVal = pathActions.convertPath(elem, true);}
                    //if (!isNaN(attrVal)) {
                    //    attrVal = svgedit.units.shortFloat(attrVal);
                    //} else if (unit_re.test(attrVal)) {
                    //    attrVal = svgedit.units.shortFloat(attrVal) + unit;
                    //}

                    // Embed images when saving
                    //if (save_options.apply
                    //    && elem.nodeName === 'image'
                    //    && attr.localName === 'href'
                    //    && save_options.images
                    //    && save_options.images === 'embed')
                    //{
                    //    var img = encodableImages[attrVal];
                    //    if (img) {attrVal = img;}
                    //}

                    // map various namespaces to our fixed namespace prefixes
                    // (the default xmlns attribute itself does not get a prefix)
                    if (!attr.namespaceURI || attr.namespaceURI == NS.SVG || nsMap[attr.namespaceURI]) {
                        out.push(attr.nodeName); out.push('="');
                        out.push(attrVal); out.push('"');
                    }
                }
            }
        }

        if (elem.hasChildNodes()) {
            out.push('>');
            indent++;
            var bOneLine = false;

            for (i = 0; i < childs.length; i++) {
                var child = childs.item(i);
                switch(child.nodeType) {
                    case 1: // element node
                        out.push('\n');
                        out.push(this.svgToString(childs.item(i), indent));
                        break;
                    case 3: // text node
                        var str = child.nodeValue.replace(/^\s+|\s+$/g, '');
                        if (str != '') {
                            bOneLine = true;
                            out.push(String(toXml(str)));
                        }
                        break;
                    case 4: // cdata node
                        out.push('\n');
                        out.push(new Array(indent+1).join(' '));
                        out.push('<![CDATA[');
                        out.push(child.nodeValue);
                        out.push(']]>');
                        break;
                    case 8: // comment
                        out.push('\n');
                        out.push(new Array(indent+1).join(' '));
                        out.push('<!--');
                        out.push(child.data);
                        out.push('-->');
                        break;
                } // switch on node type
            }
            indent--;
            if (!bOneLine) {
                out.push('\n');
                for (i = 0; i < indent; i++) {out.push(' ');}
            }
            out.push('</'); out.push(elem.nodeName); out.push('>');
        } else {
            out.push('/>');
        }
    }
    return out.join('');
}; // end svgToString()


function clearEventBubble(evt) {

    if (evt.stopPropagation)

        evt.stopPropagation();

    else

        evt.cancelBubble = true;

    if (evt.preventDefault)

        evt.preventDefault();

    else

        evt.returnValue = false;

}