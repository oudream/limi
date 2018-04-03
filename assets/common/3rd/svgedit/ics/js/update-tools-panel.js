/**
 * Created by liuchaoyu on 2016-11-25.
 *
 * update-tools-panel.js
 *
 */


$(function () {

    /**
     * 添加基础面板（包含保存、打开。。。）
     */
    var addBasePanel = function () {
        var topTools = $('#tools_top');

        var basePanel = $(cjCommon.createElement('div',{'id':'base_panel'}));

        basePanel.css({'display':'block'});

        topTools.prepend(basePanel);

        cjCommon.createElement('div',{'className':'tool_sep'},basePanel);

        /** 添加保存按键 */
        var saveBtn = cjCommon.createElement('div',{'id':'tool_btn_save','className':'push_button'},basePanel);
        cjCommon.createElement('div',{'className':'btn-icon icon-save'},saveBtn);

        /** 添加打开按键 */
        var openBtn = cjCommon.createElement('div',{'id':'tool_btn_open','className':'push_button'},basePanel);
    };

    var tools_top_update = function () {

        (function removeOldPanel () {
            $('#main_button').hide();
            $('#editor_panel').hide();
            $('#history_panel .tool_sep').hide();
        })();

        (function adjustPosition() {
            $('#tools_top').css('left',2);
        })();

    };

    var tools_left_update = function () {

        (function removeOldPanel () {
            $('#tool_polygon').hide();
            $('#tool_star').hide();
            $('#tool_eyedropper').hide();
            $('#ext-panning').hide();
        })();

    };






    var runScript = function () {
        //addBasePanel();
        tools_top_update();
        tools_left_update();
    };

    setTimeout(runScript,100);
});