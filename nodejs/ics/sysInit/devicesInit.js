const fs = require('fs');
const {resolve} = require('path');

const DbManager = require('./../../common/cjs/cj-database.js').DbManager;
const ShareCache = require('./../../common/share-cache.js').ShareCache;
const {devicesCfg} = require('../../../config/sysInit/devicesCfg');

let dbMgr = null;
let dbsConfig = null;

inIt();

/**
 * 初始化设备相关数据库里的数据
 */
function inIt() {
    dbMgr = createDbManager();
    let mysqlConfig = dbsConfig['db1'];
    let db = dbMgr.createDbConnect(mysqlConfig);
    fs.readFile(resolve(__dirname, 'initDev.txt'), function(err, data) {
        if (err) {
            console.log(err);
        } else {
            if (data.toString() === 'true') {
                fs.writeFile(resolve(__dirname, 'initDev.txt'), 'false', function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        let aDevicesNo = [];
                        for (let i in devicesCfg) {
                            aDevicesNo.push(i);
                        }
                        let selIDSql = 'select PropID from omc_propertydef order by PropID desc';
                        db.load(selIDSql, function(err, val) {
                            if (err) {
                                console.log(err);
                            } else {
                                let ID = 0;
                                let insSql = '';
                                let creSql = '';
                                let creColSql = '';
                                let key = 'PRIMARY KEY (`ID`) USING BTREE';
                                let sql = [];
                                let sSql = '';
                                if (val.length !== 0) {
                                    ID = val[0].PropID;
                                }

                                for (let i = 0; i < aDevicesNo.length; i++) {
                                    for (let j = 0; j < devicesCfg[aDevicesNo[i]].length; j++) {
                                        insSql = insSql + 'insert into omc_propertydef(PropID,NeType,PropName,ColumnName,PropType,Required,Visible,ReadOnly,MaxLength,MinLength,Version,FormType,IsKey)' +
                                        `values(${ID + i},${parseInt(aDevicesNo[i], 16)},'${devicesCfg[aDevicesNo[i]][j].PropName}','${devicesCfg[aDevicesNo[i]][j].ColumnName}',${devicesCfg[aDevicesNo[i]][j].PropType},1,1,0,${devicesCfg[aDevicesNo[i]][j].MaxLength},1,1,1,${devicesCfg[aDevicesNo[i]][j].IsKey});`;
                                    }
                                }
                                for (let i = 0; i < aDevicesNo.length; i++) {
                                    creSql = `create table \`property_${aDevicesNo[i]}\`(\`ID\` int(11) NOT NULL AUTO_INCREMENT,`;
                                    for (let j = 0; j < devicesCfg[aDevicesNo[i]].length; j++) {
                                        let type = '';
                                        if (devicesCfg[aDevicesNo[i]][j].PropType === '1') {
                                            type = `int(${devicesCfg[aDevicesNo[i]][j].MaxLength})`;
                                        } else if (devicesCfg[aDevicesNo[i]][j].PropType === '4') {
                                            type = `varchar(${devicesCfg[aDevicesNo[i]][j].MaxLength})  CHARACTER SET utf8 COLLATE utf8_general_ci`;
                                        }
                                        if (devicesCfg[aDevicesNo[i]][j].IsKey === '1') {
                                            key = key + `,PRIMARY KEY (\`${devicesCfg[aDevicesNo[i]][j].ColumnName}\`) USING BTREE`;
                                        }
                                        if (j < devicesCfg[aDevicesNo[i]].length - 1) {
                                            creColSql = creColSql + `\`${devicesCfg[aDevicesNo[i]][j].ColumnName}\` ${type},`;
                                        }
                                        if (j === devicesCfg[aDevicesNo[i]].length - 1) {
                                            creColSql = creColSql + `\`${devicesCfg[aDevicesNo[i]][j].ColumnName}\` ${type}, ${key})ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;`;
                                        }
                                    }
                                    sql.push(creSql + creColSql);
                                    creColSql = '';
                                    key = 'PRIMARY KEY (`ID`) USING BTREE';
                                }
                                for (let i = 0; i < sql.length; i ++) {
                                    sSql = sSql + sql[i];
                                }
                                db.load(sSql, function(err) {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });
}

/**
 * 创建数据库管理器
 * @return {DbManager} : Object 数据库管理器对象
 */
function createDbManager() {
    dbsConfig = ShareCache.get('server-config', 'database');
    return new DbManager(dbsConfig);
}
