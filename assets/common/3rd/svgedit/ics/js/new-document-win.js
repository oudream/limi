/**
 * Created by liuchaoyu on 2016-10-27.
 *
 * newDocumentWin.js
 *
 * 新建文档的交互功能，替换原功能
 */

var newPageWin = {};

$(function () {

    var newElementBox;
    var container;
    var frameBar;
    var newDocumentFrame;
    var toolButtonBar;
    var okButton;
    var cancelButton;


    newPageWin.openWin = function () {
        $('.overlay').unbind('click');

        openWin();

        var curProjId = dataInteraction.getCurProjectId();
        var pageObjs = dataInteraction.local.getPages(curProjId);

        if (pageObjs.length == 0) {
            cancelButton.bind('click', function () {
                window.location.href = "about:blank";
            });
        }
    };

    var resizeFrame = function () {
        frameBar.css('height',parseInt(container.css('height'),10) - parseInt(toolButtonBar.css('height'),10) - 10);
    };

    var createWindow = function () {

        var body = $('body');

        newElementBox = cjCommon.createElement("div",{'id':"new_element_box",'className':"new_element_box"},body);

        cjCommon.createElement("div",{'className':"overlay"},newElementBox);

        container = cjCommon.createElement("div",{'id':"new_element_container",'className':"new_element_container"},newElementBox);

        toolButtonBar = cjCommon.createElement("div",{'id':"tool_button_bar",'className':"tool_button_bar"},container);

        frameBar = cjCommon.createElement("div",{'id':"frame_bar",'className':"frame_bar"},container);

        newDocumentFrame = cjCommon.createElement("iframe",{'id':"new_document_frame",'className':"new_document_frame",'src':"../ics/new-element/new-element.html"},frameBar);

        okButton = cjCommon.createElement("button",{'id':"button_ok",'className':"buttons",'textContent':"OK"},toolButtonBar);

        okButton.prepend($('<img class="svg_icon">'));
        $('#button_ok img').attr('src', $('#tool_source_save img').attr('src'));

        cancelButton = cjCommon.createElement("button",{'id':"button_cancel",'className':"buttons",'textContent':"Cancel"},toolButtonBar);

        cancelButton.prepend($('<img class="svg_icon">'));
        $('#button_cancel img').attr('src', $('#tool_source_cancel img').attr('src'));

        resizeFrame();

        $(window).resize(resizeFrame);

    };

    var openWin = function () {
        newElementBox.css('display','block');

        resizeFrame();
    };

    var clearOpt = function () {
        newElementBox.css('display','none');
        newDocumentFrame.attr('src', newDocumentFrame.attr('src'));
    };

    var mouseUpEvt = function (evt) {
        openWin();
    };

    var buttonOkEvt = function (evt) {

        var frameDocument = newDocumentFrame[0].contentWindow.document;
        var inputLabel = $(frameDocument.getElementById('input_label'));
        var nameInput = $(frameDocument.getElementById('name_input'));

        var curProjId = dataInteraction.getCurProjectId();

        var retObj = dataInteraction.getAvailableIdAndTime("page");

        var newPage = new Page(retObj.id,nameInput.val(),curProjId,retObj.curTime,"","");

        uiManager.projManager.appendPage(newPage);


        //if (inputLabel.attr('value') == "proj") {
        //
        //    var projId = dataInteraction.getAvailableIdAndTime("proj");
        //
        //    var newProj = new Project(projId,nameInput.attr('value'));
        //
        //    dataInteraction.addProject(newProj);
        //
        //}
        //else if (inputLabel.attr('value') == "page") {
        //    var parentSelectOption = $(frameDocument.getElementById('parent_select_option'));
        //    var projName = parentSelectOption.find("option:selected").text();
        //
        //    var projId = dataProcess.getIdByName(projName,'proj');
        //
        //    var pageId = dataInteraction.getAvailableIdAndTime("page");
        //
        //    var newPage = new Page(pageId,nameInput.attr('value'),projId);
        //
        //    dataInteraction.addPage(newPage);
        //
        //}

        clearOpt();
    };

    var buttonCancelEvt = function (evt) {
        clearOpt();
    };


    var bindEventOnButton = function () {
        var newDocButton = $('#tool_clear');

        newDocButton.unbind('mouseup');

        newDocButton.bind('mouseup',mouseUpEvt);

        okButton.bind('click',buttonOkEvt);

        cancelButton.bind('click',buttonCancelEvt);

        $('.overlay').bind('click',buttonCancelEvt);
    };

    var runScript = function () {
        createWindow();
        bindEventOnButton();
    };

    setTimeout(runScript,250);
});

