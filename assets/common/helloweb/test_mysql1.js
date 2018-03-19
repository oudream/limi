/**
 * Created by oudream on 2016/11/24.
 */

"use strict";

var mysql = require('mysql');
var pool  = mysql.createPool({
    connectionLimit : 10,
    //host            : '10.31.16.253',
    host            : '127.0.0.1',
    user            : 'ygct',
    password        : 'ygct',
    database        : 'db1'
});

pool.query('select * from table1', function(err, rows, fields) {
    if (err) throw err;

    console.log(JSON.stringify(rows));
});

var testDb1 = function () {
    var sql = "INSERT INTO Test (name, email, n) VALUES ?";
    var values = [
        ['demian', 'demian@gmail.com', 5],
        ['john', 'john@gmail.com', 6],
        ['mark', 'mark@gmail.com', 7],
        ['pete', 'pete@gmail.com', 8]
    ];
    pool.query(sql, [values], function(err) {
        if (err) throw err;
        pool.end();
    });
};
testDb1();



