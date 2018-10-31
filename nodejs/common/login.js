const DbManager = require('./cjs/cj-database.js').DbManager;
const ShareCache = require('./share-cache.js').ShareCache;
const querystring = require('querystring');
let login = {

};
// 数据库连接
let dbMgr = null;
let dbsConfig = null;
login.verification = function(data, callback) {
    dbMgr = createDbManager();
    let mysqlConfig = dbsConfig['db1'];
    let arr = [];
    let arrs = [];
    let error = '';
    let defaultDb = dbMgr.createDbConnect(mysqlConfig);
    let obj = querystring.parse(data);
    let sql = 'select Password,Name,UserName from omc_sys_user where UserName = \'' + obj.userName + '\'';
    defaultDb.load(sql, function(err, val) {
        if (err) {
            console.log(err);
            error = '数据库查询错误！';
        } else {
            console.log(val[0].Password);
            if (val[0].Password === obj.password) {
                // let date=new Date(); date.setTime(date.getTime()+60*1000);
                arr.push('name=' + encodeURI(val[0].Name));
                arr.push('userName=' + encodeURI(val[0].UserName));
                arr.push('Path=/');
                // arr.push('expires=' + date.toGMTString());
                arrs.push(arr.join(';'));
            } else {
                error = '用户名或密码错误！';
            }
        }
        callback(error, arrs);
    });
};

/**
 * 创建数据库管理器
 * @return {DbManager} : Object 数据库管理器对象
 */
function createDbManager() {
    dbsConfig = ShareCache.get('server-config', 'database');
    return new DbManager(dbsConfig);
}
module.exports = {
    login: login,
};
