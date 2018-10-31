/**
 * Created by nielei on 2018/6/25.
 */

'use strict';

define(['jquery', 'global', 'async', 'ifvisible', 'modal', 'action', 'cjcommon', 'cjstorage', 'cjdatabaseaccess', 'cjajax', 'utils', 'cache', 'templates', 'analysis'], function($, g, async, ifvisible) {
    let db;
    let oAction = {
        init: function() {
            let serverInfo = cacheOpt.get('server-config');
            dbConnectInit(serverInfo);

            checkActive(120);
            window.addEventListener('hashchange', function() {
                let mask = new modal.CreateModal();
                mask.maskCancel();
                let name = getJsonData('#');
                window.history.pushState(null, null, '?json=' + name);
            });
            getJsonData('?');
        },
    };

    function getJsonData(separator) {
        let url = document.URL;
        let obj = getUrlPara(url, separator);
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
            obj.then(function(data) {
                let tpl = new templates.Templates();
                tpl.render(data, false);
            });
        });
        sessionStorage.setItem('jsonName', jsonName);
        return jsonName;
    }

    function getUrlPara(url, separator) {
        let arrs = url.split(separator);
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
        initData();
}

    function checkActive(time) {
        ifvisible.setIdleDuration(time);
        ifvisible.on('statusChanged', function(e) {
            if (e.status === 'idle' && ((sessionStorage.getItem('jsonName')!== 'home') && (sessionStorage.getItem('jsonName')!== 'make_start'))) {
                clearCookie();
                sessionStorage.setItem('s_user', '未登录');
                sessionStorage.setItem('user', '');
                window.location = '../../chtml/template/template.html?json=home';
            }
        });
    }

    function clearCookie() {
        let date=new Date();
        date.setTime(date.getTime()-10000);
        let keys=document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (let i = keys.length; i--;) {
                document.cookie=keys[i]+'=0; expire='+date.toGMTString()+'; path=/';
            }
        }
    }

    async function loadSql(sql) {
        let serverInfo = cacheOpt.get('server-config');
        let reqHost = serverInfo['server']['ipAddress'];
        let reqPort = serverInfo['server']['httpPort'];
        let reqParam = {
            reqHost: reqHost,
            reqPort: reqPort,
        };
        return new Promise(function(resolve, reject) {
            db.load(sql, (e, v) => {
                if (e) {
                    reject(e);
                } else {
                    resolve(v);
                }
            }, reqParam);
        });
    }

    async function initData() {
        let flag = sessionStorage.getItem('ti_tck_550_m_prop');

        if (!flag) {
            let getTck550MPropSql = `select t1.F_PID as pid,t1.F_URI as uri,t1.F_CLASS as class,t1.F_V as value,t2.F_NAME as name, t3.F_NAME as label, t3.F_NID as nid from ti_tck_550_m_prop as t1,omc_vxd_dd as t2, omc_vxd_prop_m as t3 where t1.F_CLASS = t2.F_CLASS and t1.F_V = t2.F_V and t1.F_URI = t3.F_URI order by pid,nid asc;`
            let getTck550MObjSql = `select F_ID as id,F_NAME as value,F_CLASS from ti_tck_550_m_obj where F_CLASS = '550H'`;
            let getOmcVxdMPropSql = `select F_ID as id, F_PID as pid, F_NID as ind,F_URI as uri,F_NAME as name from omc_vxd_prop_m `;
            let getOmcVxdDdSql = `select F_ID as id,F_PID as pid,F_ClASS as class,F_V as val,F_NAME as name, F_NAME_EN as nameEN from omc_vxd_dd;`;

            let getNeConfig = 'select NeNo,NeAlias from omc_neconfig';
            let getSignalUrl = 'select * from omc_signalurl';

            let tckProp = await loadSql(getTck550MPropSql);
            let tckObj = await loadSql(getTck550MObjSql);
            let omcVxdProp = await loadSql(getOmcVxdMPropSql);
            let omcVxdDd = await loadSql(getOmcVxdDdSql);

            let aNeConfig = await loadSql(getNeConfig);
            let aSignalUrl = await loadSql(getSignalUrl);

            let neConfig = [];
            let signalUrl = [];

            aNeConfig.forEach((item,index) =>{
                neConfig[index] = {
                    NeNo: item.NeNo,
                    Name: item.NeAlias,
                };
            });

            aSignalUrl.forEach((item,index) =>{
                signalUrl[index] = {
                    NeNo: item.NeNo,
                    SignalUrl: item.SignalUrl,
                    SignalNo: item.SignalNo,
                    SignalName: item.SignalName,
                };
            });

            sessionStorage.setItem('ti_tck_550_m_prop', JSON.stringify(tckProp));
            sessionStorage.setItem('ti_tck_550_m_obj', JSON.stringify(tckObj));
            sessionStorage.setItem('omc_vxd_prop_m', JSON.stringify(omcVxdProp));
            sessionStorage.setItem('omc_vxd_dd', JSON.stringify(omcVxdDd));

            sessionStorage.setItem('neConfig', JSON.stringify(neConfig));
            sessionStorage.setItem('signalUrl', JSON.stringify(signalUrl));
        }
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
