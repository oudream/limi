define && define(['jquery', 'global', 'bootstrap'], function ($, g) {
  var currentModal
  var _this
  var maxzIndex = 1050

  var defaultOption = {
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
        callback: function () {
          this.close()
        }}
    ]
  }

  var createButtons = function (_m, parentElement, buttons, autoCloseWindow) {
    buttons.forEach(function (item) {
      var btn = $('<a href="#" class="btn">' + item.text + '</a>')
      if (item.callback) {
        btn.click(function (e) {
          item.callback.call(_m, e)
          autoCloseWindow && _m.close()
        })
      }
      parentElement.append(btn)
    })
  }

	// 将页面插入到元素中
  var insertHtmlToElement = function (opt, eles, _m) {
    var url = opt.url
    var data = opt.arguments
    var $ele = eles.body

    eles.body.addClass('iframe')
    if (!opt.ajaxWindow) {
      eles.bodyContent = $('<iframe src="' + opt.url + '" frameborder="0">').mousedown(function () {
        eles.box.css('zIndex', maxzIndex++)
      }).appendTo($ele)
      return
    }

    $.get(url, function (context) {
      var REG_BODY = /<body([^>]*)>([\s\S]*)<\/body>/
	        function getBody (content) {
	            var result = REG_BODY.exec(content)
	            if (result && result.length === 3) {
              return {
	                	attrs: result[1],
	                	content: result[2]
	                }
            }
	            return content
	        }
	        var body = getBody(context)

	        var atts = (/code=["']{1}([^'"]*)["']{1}/).exec(body.attrs)
	        if (atts && atts.length == 2) {
	        	var pathArry = atts[1].split('/')
	        	var jspath = atts[1]
	        	if (pathArry.length == 1) {
	        		var htmlPath = url.split('/')
	        		htmlPath[htmlPath.length - 1] = atts[1]
	        		jspath = htmlPath.join('/')
	        	}

	        	requirejs([jspath], function (page) {
	        		var common = {
	        			page: $ele,
	        			argments: data,
	        			modal: _m
	        		}

          page.onclose && _m.pageUnloads.push(page.onclose)
	        		page.onload && page.onload(common)
	        	})
	        }
      $ele.html(body.content)
    })
  }

	// 创建带iframe的modal
  var createIframeModal = function (opt) {
    var _key = (new Date()).getTime().toString()
    var args = opt.arguments || {}
    opt.url += (opt.url.indexOf('?') >= 0 ? '&' : '?') + 'argkey=' + _key
    opt.argkey = _key
    var box = new modal(opt)
    args.modal = box
    g.data(_key, args)
    return box
  }

  var creater = {
    box: function (opt) {
      var width = opt.width ? 'width:' + opt.width + 'px;' : ''
      var height = opt.height ? 'height:' + opt.height + 'px;' : ''
      return $('<div id="modal" class="modal hide fade in ics" style="display: none;' + width + height + '"></div>')
    },
    header: function (opt) {
      return $('<div class="modal-header"></div>')
    },
    title: function (opt) {
      return $('<span>' + opt.title + '</span>')
    },
    close: function (opt) {
      return $('<a class="windowButton closeBtn" data-dismiss="modal"></a>')
    },
    max: function (opt) {
      return $('<a class="windowButton maximizationBtn"></a>')
    },
    min: function (opt) {
      return $('<a class="windowButton minimizeBtn"></a>')
    },
    restore: function (opt) {
      return $('<a class="windowButton returnBtn"></a>')
    },
    body: function (opt) {
//			var height = opt.height?"height:"+opt.height+"px;":"";
//			return $('<div class="modal-body" style="'+ height +';">');
			// 2017-03-22 pc，高度添加到modal上。
      return $('<div class="modal-body">')
    },
    footer: function (opt) {
      return $('<div class="modal-footer"></div>')
    }
  }

  var createFooter = function () {

  }

  var defOptByType = {
    'confim': {
      defOpt: {
        buttons: [
          {text: '确定',
            callback: function () {
              this.close()
            }},
          {text: '取消',
            callback: function () {
              this.close()
            }}
        ]
      },
      creater: function (eles, opt) {
        eles.body.html(opt.message)
        var footer = creater.footer(opt)
        opt.buttons && createButtons(this, footer, opt.buttons, true)
        eles.footer = footer.appendTo(eles.box)
      }
    },
    'custom': {
      defOpt: {
        buttons: []
      },
      creater: function (eles, opt) {
        eles.title.text(opt.title)
        eles.body.html(opt.message)
        var footer = creater.footer(opt)
        opt.buttons && createButtons(this, footer, opt.buttons)
        eles.footer = footer.appendTo(eles.box)
      }
    },
    'alert': {
      defOpt: {
        buttons: [
          {text: '确定',
            callback: function () {
              this.close()
            }}
        ]
      },
      creater: function (eles, opt) {
        eles.body.html(opt.message)
        eles.box.addClass('uix_alert')
        var footer = creater.footer(opt)
        opt.buttons && createButtons(this, footer, opt.buttons)
        eles.footer = footer.appendTo(eles.box)
      }
    },
    'iframe': {
      defOpt: {
        width: 560,
        height: 300,
        backdrop: 'static',
        ajaxWindow: false,
        buttons: []
      },
      creater: function (eles, opt) {
        if (opt.drap) {
          eles.box.css({
					    position: 'absolute',
					    marginLeft: (opt.width / -2),
					    marginTop: (opt.height / -2),
					    transition: 'none',
					    zIndex: maxzIndex++
          }).mousedown(function () {
            $(this).css('zIndex', maxzIndex++)
          })

          eles.header.mousedown(function (e) {
            currentModal = eles
            x = e.clientX
            y = e.clientY
            _pos = {

              left: parseInt(currentModal.box.css('marginLeft')),
              top: parseInt(currentModal.box.css('marginTop'))
            }
          })

          var re = creater.restore(opt).click(function () {
            eles.box.height(opt.height)
            min.show()
            $(this).hide()
          }).hide().appendTo(eles.header)
          var min = creater.min(opt).click(function () {
            eles.box.height(35)
            re.show()
            $(this).hide()
          }).appendTo(eles.header)

          eles.box.addClass('drap')
        }

        insertHtmlToElement(opt, eles, this)
      }
    },
    'drapIframe': {
      defOpt: {
        width: 560,
        height: 300,
        backdrop: 'static',
        ajaxWindow: true,
        buttons: []
      },
      creater: function (eles, opt) {
        insertHtmlToElement(opt, eles, this)
      }
    }
  }

  var getMyOpt = function (opt) {
    return $.extend(true, {}, defaultOption, defOptByType[opt.type || defaultOption.type].defOpt, opt)
  }

  var modal = function (inOpt) {
    var opt = getMyOpt(inOpt)

    var content = ''

    var eles = this.elements = {
      box: creater.box(opt),
      header: creater.header(opt),
      close: creater.close(opt),
      title: creater.title(opt),
      body: creater.body(opt)
    }

    eles.box.append(
			eles.header.append(
				eles.close
			).append(
				eles.title
			)
		).append(
			eles.body
		)

    this.close = function () {
      this.elements.box.modal('hide')
    }

    this.pageUnloads = []// 页面

    defOptByType[opt.type].creater.call(this, this.elements, opt)

    $(document.body).append(this.elements.box)

    _this = this
    eles.box.modal({show: opt.show, backdrop: opt.backdrop}).on('hide', function (e) {
      if (!$(e.target).is(eles.box)) { return }

      _this.pageUnloads && _this.pageUnloads.forEach(function (item) {
        item()
      })

      var _modal = $(this).data('modal')
      _modal.$backdrop && _modal.$backdrop.remove()
      $(this).remove()

      if (opt.argkey) {
				// 清空传入参数代码，在app.js中实现，在window.unload中移除
				/*
				g.dataRemove(opt.argKey);
				*/
      }
    })
  }
	// 处理拖动
  var mx = 0, my = 0, _pos
  $(document).mouseup(function () {
    if (!currentModal) { return }
    x = currentModal.box.css('margin-left')
    y = currentModal.box.css('margin-top')
		// currentModal.box.find("iframe").show();
    currentModal = null
  })
  $(document).mousemove(function (e) {
    if (!currentModal) { return }
    var x2 = e.clientX
    var y2 = e.clientY
    if (x != x2 || y != y2) {
      currentModal.box.css({marginLeft: _pos.left + (x2 - x), marginTop: _pos.top + (y2 - y)})
    }
  })

  $.Modal = modal

  $.extend(true, {
    alert: function (str, callback) {
      var box = new modal({
        type: 'alert',
        title: '提示',
        message: str,
        show: true,
        buttons: [{
          text: '确定',
          callback: function () {
            this.close()
            callback && callback.call(this)
          }
        }]
      })
      return box
    },
    confim: function (str, fn1, fn2) {
      var box = new modal({
        type: 'confim',
        title: '提示',
        message: str,
        buttons: [
          {text: '确定',
            callback: function () {
              this.close()
              fn1 && fn1.call(this)
            }},
          {text: '取消',
            callback: function () {
              this.close()
              fn2 && fn2.call(this)
            }}
        ]
      })
      return box
    },
    iframe: function (opt) {
      var opts = $.extend(true, {type: 'iframe', title: '提示', url: opt.url, show: true}, opt)
      return createIframeModal(opts)
    },
    custom: function (opt) {
      var box = new modal($.extend({
        type: 'custom'
      }, opt))
      return box
    }
  })

  return $.Modal
})
