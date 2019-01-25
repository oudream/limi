const MysqlDb = require('./mysql3')

let mysqlDb = new MysqlDb({
    connectionLimit: 10,
    // host            : '10.31.16.253',
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'asm550h',
});

async function getData() {
    try {
        let sql = 'select EthernetIP from omc_neconfig where NeNo = \'5308417\''
        let dataList = await mysqlDb.queryPromise( sql )
        console.log( dataList )
    }
    catch (e) {
        console.log( 'error' )
    }
    console.log( 'end.' )
}

getData()
getData()
getData()
