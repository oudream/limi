define(['jquery', 'bootstrap', 'bs.ics.modal'],
function($, undefined, Modal) {
    let action = {
        init: function() {
            $('#btnAlert').click(function() {
                $.alert('提示信息', function() {
                    alert('点击了确认按钮');
                });
            });
            $('#btnConfim').click(function() {
                $.confim('确定要删除吗？', function(win) {
                    alert('点击了确定');
                }, function(win) {
                    alert('点击了取消');
                });
            });
            $('#btnCustom').click(function() {
                $.custom({title: '自定义弹出框', html: 'a<br/>b', width: 500, height: 200, buttons: [
                    {text: '按钮1', callback: function() {
                        alert('点击了按钮1。'); this.close();
                    }},
                    {text: '按钮2', callback: function() {
                        alert('点击了按钮2。'); this.close();
                    }},
                    {text: '按钮3', callback: function() {
                        alert('点击了按钮3。'); this.close();
                    }},
                    {text: '按钮4', callback: function() {
                        alert('点击了按钮4。'); this.close();
                    }},
                ]});
            });
            $('#btnIframe_ajax').click(function() {
                $.iframe({url: 'iframe.html', width: 800, height: 400, arguments: {arg1: '来自父页面的数据'}});
            });
            $('#drapIframe').click(function() {
                $.iframe({url: 'iframe.html', width: 800, drap: true, backdrop: false, height: 400, ajaxWindow: true, arguments: {arg1: '来自父页面的数据'}});
            });
            $('#btnIframe').click(function() {
                $.iframe({url: 'iframe.html', ajaxWindow: false, width: 800, height: 400, arguments: {arg1: '来自父页面的数据'}});
            });
        },
    };


    return {
        beforeOnload: function() {
        },
        onload: function(common) {
            action.init();
        },
    };
});
