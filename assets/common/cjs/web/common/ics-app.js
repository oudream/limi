/**
 * Created by liuchaoyu on 2017-03-17.
 */

define(['jquery', 'global'], function($, g) {
    // 获取页面控制器
    let pageController;
    let code = $(document.body).attr('ics-code');
    let common = {};
    let bindOnload = function() {
        requirejs(['domready!'], function(doc) {
            // 若存在参数key,则将参数取出传入页面的onload方法中，并在页面关闭前清空参数；
            let argkey = getQueryString('argkey');
            if (argkey) {
                let data = g.data(argkey);
                if (data) {
                    common.argments = data;
                    common.window = data.window||window;
                    common.page = $(document.body);
                }
                $(window).unload(function() {
                    g.dataRemove(argkey);
                });
            }

            setTimeout(function() {
                pageController&&pageController.onload&&pageController.onload(common);
            }, 100);
        });
    };

    if (code) {
        // 相对路径
        if (code&&code.charAt(0)!='/'&&code.charAt(0)!='.') {
            let arr = window.location.href.split('/');
            arr[arr.length-1]=code;
            code=arr.join('/');
        }
        requirejs([code], function(controller) {
            pageController = controller;

            if (pageController.beforeOnload) {
                pageController.beforeOnload();
            }
            bindOnload();
        });
    } else {
        bindOnload();
    }

    function getQueryString(name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        let r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return;
    }
});
