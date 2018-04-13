
// 遮罩层
// document.write('<div id="loading" style="z-index: 90001; position: fixed;line-height:100%; width: 100%; height: 100%; background: #fff;font-size: 12px; font-weight: normal;padding:0px; margin:0px;"></div>')
// debugger;
define(['jquery', 'bootstrap', 'util', 'global', 'server', 'css!' + BASEURL + 'common/ccss/all.css', 'es5'], function($, bootstrap, util, g, server) {
    util.log('app - 载入页面' + window.location.pathname);
	// 主题样式
    let themeCss = ['../../../common/ccss/main.css', '../../../common/3rd/bootstrap-2.3.2/css/bootstrap-2.3.2.css', '../../../common/ccss/page.css', 'smallIcon.css', 'icon.css'];

    util.log('app - 配置获取成功');

	// g.theme.current = "bootstrap";
    requirejs(themeCss.map(function(item) {
        return 'css!' + g.theme.getres(item);
    }), function() {
        util.log('app - 主题样式加载完成');
    });

	// 加载自适应布局
    let loadUixLatyou = function(callback) {
        if ($('.uix-layout-container').length > 0) {
            requirejs(['uix'], function(uix) {
//				debugger;
                uix.initpage();
                uix.layout(true);
                callback();
            });
        }		else {
            callback();
        }
    };

    let resizeEvents = {};
    let common = {
        showPage: function() {
            $('#loading').hide().remove();
        },
        addResizeEvent: function(key, fn) {
            resizeEvents[key] = fn;
        },
        callResize: function() {
            for (let key in resizeEvents) {
                resizeEvents[key] && resizeEvents[key]();
            }
        },
        page: $(document.body),
    };

	// 获取页面控制器
    let pageController;
    let code = $(document.body).attr('code');
    let bindOnload = function() {
        requirejs(['domready!'], function(doc) {
            util.log('app - 页面加载完成');

			// 若存在参数key,则将参数取出传入页面的onload方法中，并在页面关闭前清空参数；
            let argkey = util.GetQueryString('argkey');
            if (argkey) {
                let data = g.data(argkey);
                if (data) {
                    common.arguments = data;
                    if (data.modal) {
                        common.modal = data.modal;

                        if (pageController && pageController.onclose) {
                            common.modal.pageUnloads.push(pageController.onclose);
                        }
                    }
                }
                $(window).unload(function() {
                    g.dataRemove(argkey);
                });
            }

            loadUixLatyou(function() {
                if (!pageController || pageController.autoShowPage !== false) {
                    common.showPage();
                }
                pageController && pageController.onload && pageController.onload(common);
            });
        　　});
    };
    if (code) {
		// 相对路径
        if (code && code.charAt(0) != '/' && code.charAt(0) != '.') {
            let arr = window.location.href.split('/');
            arr[arr.length - 1] = code;
            code = arr.join('/');
        }
        requirejs([code], function(controller) {
            pageController = controller;
            pageController.beforeOnload && pageController.beforeOnload();
            bindOnload();
        });
    }	else {
        bindOnload();
    }

	/* 全局异常处理
	window.onerror = function handleErr(msg,url,l)
	{
		txt="页面异常:\n\n"
		txt+="错误: " + msg + "\n"
		txt+="文件: " + url + "\n"
		txt+="行数: " + l + "\n\n"
		return false
	}
	*/

    return util;
});
