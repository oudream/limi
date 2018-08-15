/**
 * Created by nielei on 2018/6/25.
 */

'use strict';

define(['jquery', 'global', 'async', 'modal', 'action', 'cjcommon', 'cjstorage', 'cjdatabaseaccess', 'cjajax', 'utils', 'cache', 'templates', 'analysis'], function($, g, async) {
    let db;
    let oAction = {
        init: function() {
            let serverInfo = cacheOpt.get('server-config');
            dbConnectInit(serverInfo);
            let reqHost = serverInfo['server']['ipAddress'];
            let reqPort = serverInfo['server']['httpPort'];
            let reqParam = {
                reqHost: reqHost,
                reqPort: reqPort,
            };
            getJsonData();
        },
    };

    function getJsonData() {
        let url = document.URL;
        let obj = getUrlPara(url);
        let projectName = sessionStorage.getItem('projectName');
        let jsonName = '';
        if (obj.json) {
            jsonName = obj.json;
            // todo 权限检查
        } else {
            // todo 改用modal
            alert('指定json错误');
        }
        $.getJSON('/ics/' + projectName + '/config/template/' + jsonName + '.json', function(data) {
            let analy = new analysis.Analysis();
            let obj = analy.analysisJson(data);
            let tpl = new templates.Templates();
            tpl.render(obj);
        });
    }

    function getUrlPara(url) {
        let arrs = url.split('?');
        if (arrs[1]) {
            let paras = arrs[1].split('&');
            let obj = {};
            for (let i = 0; i < paras.length; i++) {
                let para = paras[i].split('=');
                obj[para[0]] = para[1];
            }
            return obj;
        } else {
            return {};
        }
    }

    function dbConnectInit(serverInfo) {
        /** 读取数据库配置信息 */
        let dbConfigs = serverInfo['database'];
        let _db1Config = dbConfigs['db1'];

        let dbParams = {
            'type': _db1Config.type,
            'host': _db1Config.host,
            'user': _db1Config.user,
            'pwd': _db1Config.pwd,
            'dsn': _db1Config.dsn,
            'connectionLimit': _db1Config.connectionLimit,
        };

        /** 创建数据库连接 */
        db = new CjDatabaseAccess(dbParams);
        window.top.cjDb = db;
    }
    /**
     * 模块返回调用接口
     */
    return {
        beforeOnload: function() {
        },

        onload: function() {
            oAction.init();
        },
    };
});
