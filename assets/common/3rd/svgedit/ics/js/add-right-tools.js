/**
 * Created by liuchaoyu on 2016-10-10.
 *
 * add-right-tools.js
 *
 * 添加右边设备工具栏
 */

$(function () {
    var clear = function () {
        $('#tools_shapelib_show').hide();
        //$('#layerpanel').remove();
        //$('#overview_window_content_pane').remove();
    };

    var addRightSidePanel = function () {

        $('<div />', {
            id: "tools_right",
            "class": "tools_right_panel"
        }).appendTo($('#svg_editor'));

        var toolsRight = $('#tools_right');
        var rulerX = $('#ruler_x');
        var workarea = $('#workarea');

        var SIDEPANEL_WIDTH = 250;
        var SIDEPANEL_TOP = workarea.css("top");

        toolsRight.css({"width":SIDEPANEL_WIDTH, "top":SIDEPANEL_TOP});
        rulerX.css('right', parseInt(rulerX.css('right'), 10) + parseInt(toolsRight.css('right'), 10) + SIDEPANEL_WIDTH );
        workarea.css('right', parseInt(workarea.css('right'), 10) + parseInt(toolsRight.css('right'), 10) + SIDEPANEL_WIDTH);


        var shape_cats = $('#shape_cats');
        var shape_buttons = $('#shape_buttons');

        var shape_cats_childrens = shape_cats.children();
        shape_cats_childrens.each(function (index,elem) {
            $('<div />', {
                id: "shape_panel_" + index,
                "class": "shape_panel"
            }).appendTo(this);

            $(this).bind("mouseup",function (evt) {

                var shape_panel = $(evt.target).children("div.shape_panel").eq(0);
                if (shape_panel.hasClass("shape_panel") == true && shape_panel.hasClass("shape_panel_current") == false) {

                    shape_cats_childrens.each(function () {
                        $(this).children("div.shape_panel").eq(0).removeClass("shape_panel_current");
                    });

                    $('#shape_buttons div.tool_button_current').each(function () {
                        var shape_buttons_current_id = cjTempStorage.load("shape_buttons_current_id");
                        if ($(this).attr("id") != shape_buttons_current_id) {
                            $(this).removeClass('tool_button_current').addClass('tool_button');
                        }
                    });

                    shape_panel.addClass("shape_panel_current");
                    shape_panel.append(shape_buttons);
                }
            })
        });

        shape_cats.children("div.current").eq(0).mouseup();
        toolsRight.append(shape_cats);

    };


    var appendEventToToolButton = function () {
        var shape_buttons = $('#shape_buttons');

        /** 追加mouseup事件的绑定函数 */
        shape_buttons.bind("mouseup",function (evt) {
            var btn = $(evt.target).closest('div.tool_button');

            if (btn.length <= 0) {return;}

            if (btn.hasClass('tool_button_current') == true) {return;}

            $('div.tool_button_current').removeClass('tool_button_current').addClass('tool_button');

            btn.removeClass('tool_button').addClass('tool_button_current');

            window.parent.cjTempStorage.save("shape_buttons_current_id",btn.attr("id"));
        })
    };

    var appendResizeEvent = function () {
        $(window).resize(function () {

            var toolsRight = $('#tools_right');

            var SIDEPANEL_TOP = $('#workarea').css("top");
            var CUR_SIDEPANEL_TOP = toolsRight.css("top");

            if (SIDEPANEL_TOP != CUR_SIDEPANEL_TOP) {
                toolsRight.css("top",SIDEPANEL_TOP);
            }

        });
    };


    var changeSidePanelMouseupEvent = function () {

        /** 解开原来的绑定mouseup事件 */
        var sidePanel_handle = $('#sidepanel_handle');
        sidePanel_handle.unbind("mouseup");

        var sidepanels = $('#sidepanels');

        /** 调整图层栏的宽度 */
        var SIDEPANEL_OPENWIDTH = 150;
        var sidedrag = -1, sidedragging = false;

        var changeSidePanelWidth = function (delta) {

            /** 新增：折合时隐藏右边栏滚动条 */
            if (delta < 0) {
                sidePanel_handle.css({
                    'left':"0px",
                    'margin-left':"3px",
                    'border-radius':"8px",
                    'border-top-right-radius':"0px",
                    'border-bottom-right-radius':"0px",
                    'border-left-color':"#808080"
                });

                sidepanels.css({
                    'overflow':"hidden",
                    'border-left-color':"#D0D0D0"
                })

            }
            else if (delta > 0) {
                sidePanel_handle.css({
                    'left':"-1px",
                    'margin-left':"0px",
                    'border-radius':"8px",
                    'border-top-left-radius':"0px",
                    'border-bottom-left-radius':"0px",
                    'border-left-color':"#D0D0D0"
                });

                sidepanels.css({
                    'overflow-y':"auto",
                    'border-left-color':"#808080"
                });

            }

            var rulerX = $('#ruler_x');
            var workarea = $('#workarea');
            var toolsRight = $('#tools_right');

            sidepanels.width('+=' + delta);
            $('#layerpanel').width('+=' + delta);
            rulerX.css('right', parseInt(rulerX.css('right'), 10) + delta);
            workarea.css('right', parseInt(workarea.css('right'), 10) + delta);
            toolsRight.css('right',parseInt(toolsRight.css('right'), 10) + delta);
            svgCanvas.runExtensions('workareaResized');
        };

        // if width is non-zero, then fully close it, otherwise fully open it
        // the optional close argument forces the side panel closed
        var toggleSidePanel = function (close) {
            var w = $('#sidepanels').width();
            var deltaX = (w > 2 || close ? 2 : SIDEPANEL_OPENWIDTH) - w;
            changeSidePanelWidth(deltaX);
        };

        /** 重新绑定mouseup事件 */
        sidePanel_handle
            .mouseup(function (evt) {
                if (!sidedragging) {
                    toggleSidePanel();
                }
                sidedrag = -1;
                sidedragging = false;
            });
    };

    var changeLayerPanelStyle = function () {
        var sidePanel = $('#sidepanels');
        var sidepanel_handle = $('#sidepanel_handle');

        sidepanel_handle.css({
            'left':"0px",
            'border-width':"1px",
            'border-color': "#808080",
            'border-style':"solid",
            'border-radius':"8px",
            'border-top-right-radius':"0px",
            'border-bottom-right-radius':"0px"
        });

        sidePanel.css({
            'border-width':"1px",
            'border-color': "#808080",
            'border-style':"solid",
            'border-left-color':"#D0D0D0"
        })

    };

    var runScript = function () {
        changeLayerPanelStyle();
        addRightSidePanel();
        appendEventToToolButton();
        appendResizeEvent();
        changeSidePanelMouseupEvent();
    };

    clear();

    setTimeout(runScript,200);

});


