/**
 * Created by liuchaoyu on 2016-10-24.
 *
 * add-left-tools.js
 *
 * 添加左边项目管理工具栏
 */

$(function () {

    var addLeftSidePanel = function () {

        var leftSidePanel = cjCommon.createElement("div",{'id':"sidepanel_left",'className':"tools_left_panel"},$('#svg_editor'));

        var LEFTSIDEPANEL_WIDTH = 12;
        var LEFTSIDEPANEL_TOP = $('#workarea').css("top");

        var delta = parseInt(leftSidePanel.css('left'), 10) + LEFTSIDEPANEL_WIDTH + 10;
        adjustInterface(delta);

        leftSidePanel.css({"top":LEFTSIDEPANEL_TOP});

        var projManagerPanel = cjCommon.createElement("div",{'id':"project_manager_panel",'className':"project_manager_panel"},leftSidePanel);
        projManagerPanel.css('height', parseInt(leftSidePanel.css('height'), 10) );

        var projManagerFrame = cjCommon.createElement("iframe",{'id':"project_manager_iframe",'className':"project_manager_iframe",'src':"../ics/project-manager/proj-manager.html"},projManagerPanel);

        var sidepanelLeft_handle = cjCommon.createElement("div",{'id':"sidepanel_left_handle",'className':"sidepanel_left_handle"},leftSidePanel);

        sidepanelLeft_handle.text("项目");

    };

    var appendResizeEvent = function () {
        $(window).resize(function () {

            var leftSidePanel = $('#sidepanel_left');
            var projManagerPanel = $('#project_manager_panel');

            var LEFTSIDEPANEL_TOP = $('#workarea').css("top");
            var CUR_LEFTSIDEPANEL_TOP = leftSidePanel.css("top");

            if (LEFTSIDEPANEL_TOP != CUR_LEFTSIDEPANEL_TOP) {
                leftSidePanel.css("top", LEFTSIDEPANEL_TOP);
                projManagerPanel.css('height', parseInt(leftSidePanel.css('height'), 10) );
            }
        });

    };

    var addHandleMouseupEvent = function () {

        var sidePanels_left = $('#sidepanel_left');
        var projManagerPanel = $('#project_manager_panel');
        var sidePanel_left_handle = $('#sidepanel_left_handle');

        /** 调整宽度 */
        var LEFTSIDEPANEL_WIDTH = 200;
        var sidedrag = -1, sidedragging = false;

        var changeSidePanelWidth = function (delta) {

            /** 新增：折合时隐藏右边栏滚动条 */
            if (delta < 0) {
                sidePanel_left_handle.css({
                    'border-radius':"8px",
                    'border-top-left-radius':"0px",
                    'border-bottom-left-radius':"0px",
                    'border-color': '#808080',
                    'border-style': 'solid',
                    'border-width': '1px',
                    'padding-left': "2px"

                });

                sidePanels_left.css({
                    'width':"18px",
                });

                projManagerPanel.css({
                    'display':"none"
                });

            }
            else if (delta > 0) {
                sidePanel_left_handle.css({
                    'border-radius':"8px",
                    'border-top-right-radius':"0px",
                    'border-bottom-right-radius':"0px",
                    'border':"none",
                    'padding-left':"7px"
                });

                sidePanels_left.css({
                });

                projManagerPanel.css({
                    'display':"block"
                });

            }

            sidePanel_left_handle.css('left', parseInt(sidePanel_left_handle.css('left'), 10) + delta)
            sidePanels_left.width('+=' + delta);
            adjustInterface(delta);

            window.svgEditor.runInnerFunc('zoomImage');
            svgCanvas.runExtensions('workareaResized');
        };

        // if width is non-zero, then fully close it, otherwise fully open it
        // the optional close argument forces the side panel closed
        var toggleSidePanel = function (close) {
            var w = sidePanels_left.width();
            var deltaX = (w > 18 || close ? 18 : LEFTSIDEPANEL_WIDTH) - w;
            changeSidePanelWidth(deltaX);
        };

        /** 重新绑定mouseup事件 */
        sidePanel_left_handle
            .mouseup(function (evt) {
                if (!sidedragging) {
                    toggleSidePanel();
                }
                sidedrag = -1;
                sidedragging = false;
            });
    };

    var adjustInterface = function (delta) {
        var rulerX = $('#ruler_x');
        var rulerY = $('#ruler_y');
        var rulerCorner = $('#ruler_corner');
        var workarea = $('#workarea');
        var tools_left = $('#tools_left');

        rulerX.css('left', parseInt(rulerX.css('left'), 10) + delta );
        rulerY.css('left', parseInt(rulerY.css('left'), 10) + delta );
        rulerCorner.css('left', parseInt(rulerCorner.css('left'), 10) + delta );
        workarea.css('left', parseInt(workarea.css('left'), 10) + delta );
        tools_left.css('left', parseInt(tools_left.css('left'), 10) + delta );
    };

    var runScript = function () {
        addLeftSidePanel();
        appendResizeEvent();
        addHandleMouseupEvent();

        $('#sidepanel_left_handle').mouseup();
    };


    setTimeout(runScript,200);

});