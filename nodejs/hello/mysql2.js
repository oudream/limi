
'use strict';

let mysql = require('mysql');
let pool = mysql.createPool({
    connectionLimit: 10,
    // host            : '10.31.16.253',
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'asm550h',
});

let query = function( sql, values ) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject( err )
            } else {
                connection.query(sql, values, ( err, rows) => {

                    if ( err ) {
                        reject( err )
                    } else {
                        resolve( rows )
                    }
                    connection.release()
                })
            }
        })
    })
}

async function selectAllData( ) {
    let sql = 'select EthernetIP from omc_neconfig where NeNo = \'5308417\''
    let dataList = await query( sql )
    return dataList
}

async function getData() {
    try {
        let dataList = await selectAllData()
        console.log( dataList )
    }
    catch (e) {
        console.log( 'error' )
    }
    console.log( 'end.' )
}

async function getData2() {
    try {
        let sql = 'select EthernetIP from omc_neconfig where NeNo = \'5308417\''
        let dataList = await query( sql )
        console.log( dataList )
    }
    catch (e) {
        console.log( 'error' )
    }
    console.log( 'end.' )
}

getData2()



