const fs = require('fs');
const {resolve} = require('path');

const DbManager = require('./../../common/cjs/cj-database.js').DbManager;
const ShareCache = require('./../../common/share-cache.js').ShareCache;
const {serverNe} = require('../../../config/sysInit/neConfig');

let dbMgr = null;
let dbsConfig = null;

inIt();

/**
 * 初始化服务相关数据库里的数据
 */
function inIt() {
    dbMgr = createDbManager();
    let mysqlConfig = dbsConfig['db1'];
    let db = dbMgr.createDbConnect(mysqlConfig);
    fs.readFile(resolve(__dirname, 'initSer.txt'), function(err, data) {
        if (err) {
            console.log(err);
        } else {
            if (data.toString() === 'true') {
                fs.writeFile(resolve(__dirname, 'initSer.txt'), 'false', function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        let aNeNo = [];
                        let aNeAlias = [];
                        let sql = '';
                        for (let i in serverNe) {
                            aNeNo.push(i);
                            aNeAlias.push(serverNe[i]);
                        }
                        for (let i = 0; i < aNeNo.length; i++) {
                            sql = sql + `insert into omc_neconfig (NeNo,NeAlias,NeType,AccessType,EthernetPort,EthernetType,NeParentNo,Enable,SysNeed)`+
                                `values(${parseInt(aNeNo[i], 16)},'${aNeAlias[i]}',${parseInt(aNeNo[i], 16)},1,0,0,0,1,1);`;
                        }
                        for (let i = 0; i < aNeNo.length; i++) {
                            sql =sql + 'drop table if exists `property_' + aNeNo[i] + '`;create table property_' + aNeNo[i] + '(PropName char(64),PropValue varchar(512));';
                        }
                        // @TODO 未对新建的表和omc_propertydef表添加服务默认值

                        db.load(sql, function(err) {
                            if (err) {
                                console.log(err);
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
