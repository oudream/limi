/**
 * Created by liuchaoyu on 2016-11-16.
 *
 * load-end.js
 *
 */

$(function () {

    window.icsCommon.undoStacks = {};

    var runScript = function () {
        loadSvgString ();
        loadCustomConfig();
        listenToChange();
        listenToSvgCanvas();
        subPageFunc.svgCanvas.eventListener();

        //importSvgString('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg" xmlns:xl="http://www.w3.org/1999/xlink">'+
        //    '<defs>'+
        //    '<linearGradient id="svg_2">'+
        //    '<stop stop-color="red" offset="0"/>'+
        //    '<stop stop-color="green" offset="1"/>'+
        //    '</linearGradient>'+
        //    '<rect id="svg_3" width="20" height="20" fill="blue" stroke="url(#svg_2)"/>'+
        //    '</defs>'+
        //    '<circle id="svg_1" cx="50" cy="50" r="40" fill="url(#svg_2)"/>'+
        //    '<use id="svg_4" width="30" height="30" xl:href="#svg_3"/>'+
        //    '</svg>');

        subPageFunc.actions.load();


        var editor = window.svgEditor;
        editor.runInnerFunc('zoomImage');

        $('#svg_editor').css('visibility','visible');

        $('#tool_zoom').mouseup();

        var curPageId = gCommon.curPageId;
        window.parent.uiManager.modManager.loadTree(curPageId);
    };

    setTimeout(runScript,250);

});

function loadSvgString () {

    var curPageId = gCommon.curPageId;

    var pageObj = window.parent.dataInteraction.local.getPage(curPageId);

    var svgCanvas = window.svgCanvas;

    svgCanvas.clear();

    svgCanvas.setSvgString(pageObj.svg_text);

    window.svgEditor.updateCanvas();

    svgCanvas.undoMgr.resetUndoStack();

    $('#tool_undo').toggleClass('disabled', svgCanvas.undoMgr.getUndoStackSize() === 0);

}

function loadCustomConfig () {

    subPageFunc.svgCanvas.setIdPrefix('e-yx-_');

}


function listenToChange () {

    var g = $('#svgcontent').children('g');

    var oldSubSvgs = [];
    g.children(':not(title)').each(function () {
        oldSubSvgs.push(this.id);
    });


    function elemChange (mutationRec) {

        var root_g = $('#svgcontent').children('g');

        var curSubSvgs = [];
        root_g.children(':not(title)').each(function () {
            curSubSvgs.push(this.id);
        });

        var isChange = false;

        for (var i = 0; i < mutationRec.length; i++) {
            var ret = window.parent.cjString.isContain(mutationRec[i].target.id,'select');
            if ( ret != null && ret > -1) {
                continue;
            }

            if (mutationRec[i].type == 'attributes' && mutationRec[i].oldValue != null) {
                isChange = true;
                break;
            }
        }

        if (isChange == false) {

            if (curSubSvgs.length != oldSubSvgs.length) {
                isChange = true;
            }
            else {
                for (var i = 0; i < curSubSvgs.length; i++) {

                    var hasFound = false;
                    for (var j = 0; j < oldSubSvgs.length; j++) {
                        if (curSubSvgs[i] == oldSubSvgs[j]) {
                            hasFound = true;
                            break;
                        }
                    }

                    if (hasFound == false) {
                        isChange = true;
                        break;
                    }

                }

                if (isChange == false) {

                    for (i = 0; i < oldSubSvgs.length; i++) {

                        hasFound = false;
                        for (j = 0; j < curSubSvgs.length; j++) {
                            if (oldSubSvgs[i] == curSubSvgs[j]) {
                                hasFound = true;
                                break;
                            }
                        }

                        if (hasFound == false) {
                            isChange = true;
                            break;
                        }

                    }

                }

            }
        }

        if (isChange == true) {
            var curPageId = gCommon.curPageId;
            var curPageObj = window.parent.dataInteraction.local.getPage(curPageId);
            //
            //var svgString = window.svgCanvas.getSvgString();
            //curPageObj.svg_text = svgString;

            window.parent.uiManager.workAreaManager.hasChange(curPageId);

            window.parent.dataInteraction.local.updatePage(curPageObj);

            oldSubSvgs = window.parent.cjCommon.clone(curSubSvgs);

        }
    }

    var mutation = new MutationObserver(elemChange);

    mutation.observe(g[0], {
        'childList': true,
        'attributes': true,
        'attributeOldValue': true,
        'subtree': true
    });

}

function listenToSvgCanvas () {
    var svgContent = subPageFunc.svgCanvas.getSVGContent();
    var selectorParentGroup = $('#selectorParentGroup');

    function selectedElemsAction () {
        var selectedElements = subPageFunc.svgCanvas.getSelectedElements();

        if (selectedElements.length > 0) {
            var elem = selectedElements[0];
            subPageFunc.uiShow.propertyAndModTree(elem.id);
        }
        else{
            subPageFunc.uiShow.propertyAndModTree();
            subPageFunc.uiShow.curSelectedItemId = undefined;
        }
    }

    window.parent.cjEvent.subChange(selectorParentGroup, function () {

        selectedElemsAction();
    });

    window.parent.cjEvent.subChange(svgContent, function () {

        var zTreeObj = window.parent.uiManager.modManager.zTreeObj;
        if (zTreeObj) {
            var nodes = window.parent.uiDrawing.plugin.tree.getNodes(zTreeObj,'selected');
        }
        var curPageId = gCommon.curPageId;
        window.parent.uiManager.modManager.loadTree(curPageId);

        if (nodes && nodes.length > 0) {
            var selectedNode = nodes[0];
            window.parent.uiManager.modManager.selectItem(selectedNode.id);
        }

        selectedElemsAction();
    });


}


function importSvgString (svgStr) {
    window.svgCanvas.importSvgString(svgStr);
}