define && define(['jquery', 'global', 'bootstrap'], function($, g) {
    let currentModal;
    let _this;
    let maxzIndex = 1050;

    let defaultOption = {
        title: '标题',
        show: true,
        backdrop: true,
        width: 300,
        height: 160,
        type: 'alert', // iframe / html / alert / confirm
        message: '确认吗',
        ajaxWindow: false, // 弹出窗口类型
        footerButtonAlign: 'right',
        buttons: [
            {text: '确定',
                callback: function() {
                    this.close();
                }},
        ],
    };

    let createButtons = function(_m, parentElement, buttons, autoCloseWindow) {
        buttons.forEach(function(item) {
            let btn = $('<a href="#" class="btn">' + item.text + '</a>');
            if (item.callback) {
                btn.click(function(e) {
                    item.callback.call(_m, e);
                    autoCloseWindow && _m.close();
                });
            }
            parentElement.append(btn);
        });
    };

	// 将页面插入到元素中
    let insertHtmlToElement = function(opt, eles, _m) {
        let url = opt.url;
        let data = opt.arguments;
        let $ele = eles.body;

        eles.body.addClass('iframe');
        if (!opt.ajaxWindow) {
            eles.bodyContent = $('<iframe src="' + opt.url + '" frameborder="0">').mousedown(function() {
                eles.box.css('zIndex', maxzIndex++);
            }).appendTo($ele);
            return;
        }

        $.get(url, function(context) {
            let REG_BODY = /<body([^>]*)>([\s\S]*)<\/body>/;
	        function getBody(content) {
	            let result = REG_BODY.exec(content);
	            if (result && result.length === 3) {
                return {
	                	attrs: result[1],
	                	content: result[2],
	                };
            }
	            return content;
	        }
	        let body = getBody(context);

	        let atts = (/code=["']{1}([^'"]*)["']{1}/).exec(body.attrs);
	        if (atts && atts.length == 2) {
	        	let pathArry = atts[1].split('/');
	        	let jspath = atts[1];
	        	if (pathArry.length == 1) {
	        		let htmlPath = url.split('/');
	        		htmlPath[htmlPath.length - 1] = atts[1];
	        		jspath = htmlPath.join('/');
	        	}

	        	requirejs([jspath], function(page) {
	        		let common = {
	        			page: $ele,
	        			argments: data,
	        			modal: _m,
	        		};

            page.onclose && _m.pageUnloads.push(page.onclose);
	        		page.onload && page.onload(common);
	        	});
	        }
            $ele.html(body.content);
        });
    };

	// 创建带iframe的modal
    let createIframeModal = function(opt) {
        let _key = (new Date()).getTime().toString();
        let args = opt.arguments || {};
        opt.url += (opt.url.indexOf('?') >= 0 ? '&' : '?') + 'argkey=' + _key;
        opt.argkey = _key;
        let box = new modal(opt);
        args.modal = box;
        g.data(_key, args);
        return box;
    };

    let creater = {
        box: function(opt) {
            let width = opt.width ? 'width:' + opt.width + 'px;' : '';
            let height = opt.height ? 'height:' + opt.height + 'px;' : '';
            return $('<div id="modal" class="modal hide fade in ics" style="display: none;' + width + height + '"></div>');
        },
        header: function(opt) {
            return $('<div class="modal-header"></div>');
        },
        title: function(opt) {
            return $('<span>' + opt.title + '</span>');
        },
        close: function(opt) {
            return $('<a class="windowButton closeBtn" data-dismiss="modal"></a>');
        },
        max: function(opt) {
            return $('<a class="windowButton maximizationBtn"></a>');
        },
        min: function(opt) {
            return $('<a class="windowButton minimizeBtn"></a>');
        },
        restore: function(opt) {
            return $('<a class="windowButton returnBtn"></a>');
        },
        body: function(opt) {
//			var height = opt.height?"height:"+opt.height+"px;":"";
//			return $('<div class="modal-body" style="'+ height +';">');
			// 2017-03-22 pc，高度添加到modal上。
            return $('<div class="modal-body">');
        },
        footer: function(opt) {
            return $('<div class="modal-footer"></div>');
        },
    };

    let createFooter = function() {

    };

    let defOptByType = {
        'confim': {
            defOpt: {
                buttons: [
                    {text: '确定',
                        callback: function() {
                            this.close();
                        }},
                    {text: '取消',
                        callback: function() {
                            this.close();
                        }},
                ],
            },
            creater: function(eles, opt) {
                eles.body.html(opt.message);
                let footer = creater.footer(opt);
                opt.buttons && createButtons(this, footer, opt.buttons, true);
                eles.footer = footer.appendTo(eles.box);
            },
        },
        'custom': {
            defOpt: {
                buttons: [],
            },
            creater: function(eles, opt) {
                eles.title.text(opt.title);
                eles.body.html(opt.message);
                let footer = creater.footer(opt);
                opt.buttons && createButtons(this, footer, opt.buttons);
                eles.footer = footer.appendTo(eles.box);
            },
        },
        'alert': {
            defOpt: {
                buttons: [
                    {text: '确定',
                        callback: function() {
                            this.close();
                        }},
                ],
            },
            creater: function(eles, opt) {
                eles.body.html(opt.message);
                eles.box.addClass('uix_alert');
                let footer = creater.footer(opt);
                opt.buttons && createButtons(this, footer, opt.buttons);
                eles.footer = footer.appendTo(eles.box);
            },
        },
        'iframe': {
            defOpt: {
                width: 560,
                height: 300,
                backdrop: 'static',
                ajaxWindow: false,
                buttons: [],
            },
            creater: function(eles, opt) {
                if (opt.drap) {
                    eles.box.css({
					    position: 'absolute',
					    marginLeft: (opt.width / -2),
					    marginTop: (opt.height / -2),
					    transition: 'none',
					    zIndex: maxzIndex++,
                    }).mousedown(function() {
                        $(this).css('zIndex', maxzIndex++);
                    });

                    eles.header.mousedown(function(e) {
                        currentModal = eles;
                        x = e.clientX;
                        y = e.clientY;
                        _pos = {

                            left: parseInt(currentModal.box.css('marginLeft')),
                            top: parseInt(currentModal.box.css('marginTop')),
                        };
                    });

                    let re = creater.restore(opt).click(function() {
                        eles.box.height(opt.height);
                        min.show();
                        $(this).hide();
                    }).hide().appendTo(eles.header);
                    var min = creater.min(opt).click(function() {
                        eles.box.height(35);
                        re.show();
                        $(this).hide();
                    }).appendTo(eles.header);

                    eles.box.addClass('drap');
                }

                insertHtmlToElement(opt, eles, this);
            },
        },
        'drapIframe': {
            defOpt: {
                width: 560,
                height: 300,
                backdrop: 'static',
                ajaxWindow: true,
                buttons: [],
            },
            creater: function(eles, opt) {
                insertHtmlToElement(opt, eles, this);
            },
        },
    };

    let getMyOpt = function(opt) {
        return $.extend(true, {}, defaultOption, defOptByType[opt.type || defaultOption.type].defOpt, opt);
    };

    var modal = function(inOpt) {
        let opt = getMyOpt(inOpt);

        let content = '';

        let eles = this.elements = {
            box: creater.box(opt),
            header: creater.header(opt),
            close: creater.close(opt),
            title: creater.title(opt),
            body: creater.body(opt),
        };

        eles.box.append(
			eles.header.append(
				eles.close
			).append(
				eles.title
			)
		).append(
			eles.body
		);

        this.close = function() {
            this.elements.box.modal('hide');
        };

        this.pageUnloads = [];// 页面

        defOptByType[opt.type].creater.call(this, this.elements, opt);

        $(document.body).append(this.elements.box);

        _this = this;
        eles.box.modal({show: opt.show, backdrop: opt.backdrop}).on('hide', function(e) {
            if (!$(e.target).is(eles.box)) {
                return;
            }

            _this.pageUnloads && _this.pageUnloads.forEach(function(item) {
                item();
            });

            let _modal = $(this).data('modal');
            _modal.$backdrop && _modal.$backdrop.remove();
            $(this).remove();

            if (opt.argkey) {
				// 清空传入参数代码，在app.js中实现，在window.unload中移除
				/*
				g.dataRemove(opt.argKey);
				*/
            }
        });
    };
	// 处理拖动
    let mx = 0, my = 0, _pos;
    $(document).mouseup(function() {
        if (!currentModal) {
            return;
        }
        x = currentModal.box.css('margin-left');
        y = currentModal.box.css('margin-top');
		// currentModal.box.find("iframe").show();
        currentModal = null;
    });
    $(document).mousemove(function(e) {
        if (!currentModal) {
            return;
        }
        let x2 = e.clientX;
        let y2 = e.clientY;
        if (x != x2 || y != y2) {
            currentModal.box.css({marginLeft: _pos.left + (x2 - x), marginTop: _pos.top + (y2 - y)});
        }
    });

    $.Modal = modal;

    $.extend(true, {
        alert: function(str, callback) {
            let box = new modal({
                type: 'alert',
                title: '提示',
                message: str,
                show: true,
                buttons: [{
                    text: '确定',
                    callback: function() {
                        this.close();
                        callback && callback.call(this);
                    },
                }],
            });
            return box;
        },
        confim: function(str, fn1, fn2) {
            let box = new modal({
                type: 'confim',
                title: '提示',
                message: str,
                buttons: [
                    {text: '确定',
                        callback: function() {
                            this.close();
                            fn1 && fn1.call(this);
                        }},
                    {text: '取消',
                        callback: function() {
                            this.close();
                            fn2 && fn2.call(this);
                        }},
                ],
            });
            return box;
        },
        iframe: function(opt) {
            let opts = $.extend(true, {type: 'iframe', title: '提示', url: opt.url, show: true}, opt);
            return createIframeModal(opts);
        },
        custom: function(opt) {
            let box = new modal($.extend({
                type: 'custom',
            }, opt));
            return box;
        },
    });

    return $.Modal;
});
