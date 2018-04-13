define(['jquery', 'util'], function($, util) {
	// 默认配置
    let defaults = {
        pos: 'r', // r、l、t、b
        minB: 5, // 最小允许缩小范围，单位px
        beforeCallBack: function(e, type) {},
        afterCallBack: function(e, type) {},
    };
	// 获取元素的最新宽/高
    let getB = function(ele, settings) {
        let B = {};
        if (settings.pos == 'r' || settings.pos == 'l') {
            B.thisB = ele.outerWidth(); // 拉伸方向
            B.thisC = ele.outerHeight(); // 拉伸相对方向
        } else {
            B.thisB = ele.outerHeight();
            B.thisC = ele.outerWidth();
        }
        return B;
    };
	// 创建拖动区域
    let creatDrag = function(settings, thisC) {
        let dragStyle;
        let drag;
        switch (settings.pos) {
        case 'r':
            {
                dragStyle = 'height:100%;right:0;top:0;cursor: w-resize';
                drag = $('<div class="rl-drag" style="' + dragStyle + '"></div>');
                break;
            }
        case 'l':
            {
                dragStyle = 'height:100%;left:0;top:0;cursor: w-resize';
                drag = $('<div class="rl-drag" style="' + dragStyle + '"></div>');
                break;
            }
        case 't':
            {
                dragStyle = 'width:100%;left:0;top:0;cursor: s-resize';
                drag = $('<div class="tb-drag" style="' + dragStyle + '"></div>');
                break;
            }
        case 'b':
            {
                dragStyle = 'width:100%;left:0;bottom:0;cursor: s-resize';
                drag = $('<div class="tb-drag" style="' + dragStyle + '"></div>');
                break;
            }
        }
        return drag;
    };
	// 改变宽/高
    let changB = function(ele, num, wh, animate) {
        if (animate) {
            let c = wh == 'w' ? {
                width: num,
            } : {
                height: num,
            };
            ele.animate(c, 500);
        } else {
            if (wh == 'w') {
                ele.width(num);
            } else {
                ele.height(num);
            }
        }
    };

    $.fn.extend({
        'drag': function(params) {
			// 合并配置
            let settings = $.extend({}, defaults, params);
            let doc = $(document); // 当前文档
            let dragging = false; // 用于判断是否触发拖动
            let contract = false; // 用于判断是否折叠

			// 当前元素
            let ele = $(this);
            let B = getB(ele, settings); // 当前元素及兄弟元素宽度/高度
            let oldThisB = B.thisB; // 原始宽/高
            let newThisB; // 当前元素拖动之后的宽度/高度
			// 鼠标点击时按照mousedown、up、click顺序执行，此标记是为了严格区分拖动和单击事件。
            let downFlag = false;

            let drag = creatDrag(settings, B.thisC);
            drag.bind('click', function() {
                if (!downFlag) {
                    let type;
					// 判断是折叠还是展开
                    if (!contract) {
						// 折叠
                        newThisB = settings.minB;
                        contract = true;
                        type = 'close';
                    } else {
						// 展开
                        newThisB = oldThisB;
                        contract = false;
                        type = 'open';
                    }
                    let a = settings.beforeCallBack && settings.beforeCallBack(null, type); // 执行回调方法
                    if (a) {
                        return;
                    }
					// 判断改变高还是宽
                    if (settings.pos == 'r' || settings.pos == 'l') {
                        changB(ele, newThisB, 'w', false);
                    } else {
                        changB(ele, newThisB, 'h', true);
                    }
                    settings.afterCallBack && settings.afterCallBack(null, type); // 执行回调方法
                } else {
                    downFlag = false;
                }
            });
            drag.mousedown(function() {
                dragging = true;

                $('*').bind('selectstart', function() {
                    return false;
                });
					// 鼠标移动事件
                doc.bind('mousemove', function(e) {
                    if (dragging) {
                        downFlag = true;
                        let type = 'move';
                        let a = settings.beforeCallBack && settings.beforeCallBack(e, type); // 执行回调方法
                        if (a) {
                            return;
                        }
                        let clickX = e.pageX;
                        let clickY = e.pageY;
                        let thisOffsetL = ele.offset().left;
                        let thisOffsetT = ele.offset().top;

                        B = getB(ele, settings);
                        switch (settings.pos) {
                        case 'l':
                            {
                                newThisB = B.thisB - (clickX - thisOffsetL);
                                if (newThisB > defaults.minB) {
                                    changB(ele, newThisB, 'w', false);
                                    contract = false;
                                } else {
                                    contract = true;
                                }
                                break;
                            }
                        case 'r':
                            {
                                newThisB = clickX - thisOffsetL;
                                if (newThisB > defaults.minB) {
                                    changB(ele, newThisB, 'w', false);
                                    contract = false;
                                } else {
                                    contract = true;
                                }
                                break;
                            }
                        case 't':
                            {
                                newThisB = B.thisB + (thisOffsetT - clickY);
                                if (newThisB > defaults.minB) {
                                    changB(ele, newThisB, 'h', false);
                                    contract = false;
                                } else {
                                    contract = true;
                                }
                                break;
                            }
                        case 'b':
                            {
                                newThisB = clickY - thisOffsetT;
                                if (newThisB > defaults.minB) {
                                    changB(ele, newThisB, 'h', false);
                                    contract = false;
                                } else {
                                    contract = true;
                                }
                                break;
                            }
                        }
                        settings.afterCallBack && settings.afterCallBack(e, type); // 执行回调方法
                    }
                });
            });
            doc.mouseup(function() {
                dragging = false;
                $('*').unbind('selectstart');
                doc.unbind('mousemove');
                setTimeout(function() {
                    downFlag = false;
                }, 200);
            });

            if ($(this).css('position') == 'static') {
                $(this).css('position', 'relative');
            }
            $(this).append(drag);
        },
    });
});
