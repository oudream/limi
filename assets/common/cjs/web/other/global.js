
let projectName = sessionStorage.getItem('projectName');

define(['jquery', 'util', 'json!' + BASEURL + 'ics/' + projectName + '/config/ui.json'], function($, util, cfg) {
    return window.top._g = window.top._g || (function() {
        let _messageList = {};
        let _data = {};
        let g = window.top._g;

        return {
            url: function(path) {
                return BASEURL + path;
            },
            theme: {
                path: cfg.themesPath,
                current: cfg.theme,
                getres: function(path) {
                    return BASEURL + [this.path, this.current, path].join('\\');
                },
            },
            angular: {
                ZD: false, // 是否自动启动app，暂时不需要
            },

        // 消息处理
            pagemessage: {
                register: function(key, callback) {
                    _messageList[key] = callback;
                },
                send: function(key, args, context) {
                    _messageList[key].call(context, args);
                },
            },

            data: function(key, value) {
                if (!key) {
                    return null;
                }
                if (typeof value === 'undefined') {
                    return _data[key];
                } else {
                    _data[key] = value;
                }
            },
            dataRemove: function(key) {
                delete _data[key];
            },
            iframe: function() {
                return $.iframe(...arguments);
            },
            alert: function() {
                return $.alert(...arguments);
            },
            confim: function() {
                return $.confim(...arguments);
            },
            customAlert: function() {
                return $.custom(...arguments);
            },
        };
    })($, cfg);
});
