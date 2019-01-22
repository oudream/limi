'use strict';

exports = module.exports = CjDbMysql;

let mysql = require('mysql');
require('./../../../assets/common/cjs/cjinterinfo.js');

/**
 * Class CjDbMysql
 * @constructor
 */
function CjDbMysql(option = {
    host: 'localhost',
    user: 'root',
    password: '123456',
}) {
    this._option = option;
    this._pool = mysql.createPool(option);
}

CjDbMysql.prototype.close = function close() {
    this._pool.end();
    this._pool = null;
};

CjDbMysql.prototype.isOpen = function isOpen() {
    return this._pool !== null;
};

/**
 * query data by sql
 * @param sql : string
 * @param callback : fn(err, values, fields)
 */
CjDbMysql.prototype.query = function query(sql, callback) {
    this._pool.getConnection(function(err, connection) {
        if (err) {
            cjs.warn('CjDbMysql-query: ', err);
            callback(err);
            return;
        }
        let sql = 'SELECT id,name FROM users';
        connection.query(sql, [], function(err, values, fields) {
            connection.release(); // always put connection back in pool after last query
            if (err) {
                cjs.warn('CjDbMysql-query: ', err);
                callback(err);
                return;
            }
            callback(false, values, fields);
        });
    });
};

CjDbMysql.prototype.queryPromise = function(sql, values) {
    return new Promise((resolve, reject) => {
        this._pool.getConnection(function(err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    });
};
