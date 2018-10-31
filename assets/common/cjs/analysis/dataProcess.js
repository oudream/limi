/**
 * Created by nielei on 2018/6/25.
 */
let dataProcess = {

};
'use strict';
define(['jquery', 'global', 'modal', 'action', 'cjcommon', 'cjstorage', 'cjdatabaseaccess', 'cjajax', 'utils', 'cache'], function($, g) {
    dataProcess.DataPro = function() {
        let serverInfo = cacheOpt.get('server-config');
        this.loadSql = async function(sql) {
            let db = window.top.cjDb;
            let reqParam = {
                reqHost: serverInfo['server']['ipAddress'],
                reqPort: serverInfo['server']['httpPort'],
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
        };
        this.getDataSrc = async function (data) {
            let sqlData = '';
            let obj = {};
            let arr = [];
            for (let i = 0; i < data.length; i++) {
                obj['name'] = data[i].name;
                if (data[i].type === 'sql') {
                    sqlData = await this.loadSql(data[i].value)
                    obj['value'] = sqlData[0];
                }
                arr.push(obj);
                obj = {};
            }
            return arr;
        }

    };

    dataProcess.DataPro.prototype.getDefData = async function(data) {
        let oDefData = {}
        let oDef = {};
        let aReturn = [];
        let dataSrc;
        let aDef = [];
        if (data.defaultData) {
            let aDefData = data.defaultData;
            for (let i = 0; i < aDefData.length; i++) {
                oDefData['tbName'] = aDefData[i].tbName;
                if (aDefData[i].dataSrc) {
                    dataSrc = await this.getDataSrc(aDefData[i].dataSrc)
                }
                aDef = aDefData[i].def;
                for (let j = 0; j < aDef.length; j++) {
                    switch (aDef[j].type) {
                        case 'uuid':
                            let aUuidName = aDef[j].name.split(',');
                            aUuidName.forEach((item) => {
                                oDef[item] = utils.number.guid();
                            });
                            break;
                        case 'foreign':
                            let aForeignName = aDef[j].name.split(',');
                            dataSrc.forEach((item) => {
                                if (item.name === aDef[j].src) {
                                    aForeignName.forEach((val) => {
                                        oDef[val] = item.value[val];
                                    });
                                }
                            })
                            break;
                        case 'const':
                            let aConstName = aDef[j].name.split(',');
                            let aValue = aDef[j].value.split(',');
                            aConstName.forEach((item, index) => {
                                oDef[item] = aValue[index];
                            });
                            break;
                        case 'utc':
                            let aUtcName = aDef[j].name.split(',');
                            aUtcName.forEach((item) => {
                                oDef[item] = utils.time.getUTC();
                            });
                            break;
                        case 'user':
                            let aUserName = aDef[j].name.split(',');
                            aUserName.forEach((item) => {
                                oDef[item] = sessionStorage.getItem("s_user");
                            });
                            break;
                        case 'inherit':
                            let aInheritName = aDef[j].name.split(',');
                            aInheritName.forEach((item) => {
                                oDef[item] = oDef[aDef[j].value];
                            });
                            break;

                    }
                }
                oDefData['value'] = oDef;
                aReturn.push(oDefData);
                oDefData = {};
                oDef = {};
            }
        }

        return aReturn;
    };
});
