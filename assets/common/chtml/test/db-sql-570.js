/**
 * Created by oudream on 2016/3/24.
 */

(function() {
    window.cjSql570 = {};
    let cjSql570 = window.cjSql570;

    cjSql570.getSqlJson = function( ) {
        if ( arguments.length == 0 ) {
            return '';
        }
        let sUrl = arguments[0];
        let obj = cjSql570[sUrl];
        if (obj) {
            let newObj = {};
            if (arguments.length>1) {
                let sSource = obj.sql;
                let args = arguments;
                let iMatch = 0;
                newObj.sql = sSource.replace(/\{\d+\}/g,
                    function(m) {
                        iMatch++;
                        return args[iMatch];
                    });
            } else {
                newObj.sql = obj.sql;
            }
            return JSON.stringify(newObj);
        }
    };

    cjSql570.getSqlDetailJson = function( url, where ) {
        let obj = cjSql570[url];
        if (obj) {
            let newObj = {};
            newObj.sql = obj.detail;
            if (where) {
                newObj.sql += where;
                newObj.sql += '\';';
            }
            return JSON.stringify(newObj);
        }
    };

//* 票未执行 ticket_todo
    cjSql570.ticket_todo = {
        'sql': 'SELECT * FROM T_570_TCK_RT_MAIN WHERE F_STATUS<4;',
        'detail': 'SELECT * FROM T_570_TCK_RT_DETAIL WHERE F_PID=\'',
    };
//* 票正执行
    cjSql570.ticket_doing = {
        'sql': 'SELECT * FROM T_570_TCK_RT_MAIN WHERE F_STATUS=4;',
        'detail': 'SELECT * FROM T_570_TCK_RT_DETAIL WHERE F_PID=\'',
    };
//* 票已执行
    cjSql570.ticket_done = {
        'sql': 'SELECT * FROM T_570_TCK_RT_MAIN WHERE F_STATUS=5;',
        'detail': 'SELECT * FROM T_570_TCK_RT_DETAIL WHERE F_PID=\'',
    };
//* 票统计按状态
    cjSql570.ticket_statistics = {
        'sql': 'select count(1) as \'counter\', F_STATUS as \'status\' from T_570_TCK_RT_MAIN group by F_STATUS;',
    };
//* 查询tid对应的mid范围
    cjSql570.rt_tid_mid = {
        'sql': 'select T_MID_BEGIN as \'mid\', T_MID_COUNT as \'count\' from T_RT_TID_MID where F_TID={0};',
    };

//* 柜子使用情况
    cjSql570.box_state = {
        'sql': 'SELECT * FROM T_570_RT_STATE;',
    };
//* 柜子使用情况统计按状态
    cjSql570.box_statistics = {
        'sql': 'select count(1) as \'counter\', F_IS_USED as \'used\' from T_570_RT_STATE group by F_IS_USED;',
    };

    //* Echarts 存样统计
    cjSql570.save = {
        'sql': 'select count(1) as \'data\' , F_DT as \'g1\', F_TYPE as \'g2\' from V_570_LOG_SAMPLE where F_TYPE in (21,11) and date(F_DT) between \'%t1\' and \'%t2\'  group by F_DT, F_TYPE order by F_DT, F_TYPE ',
    };

    //* Echarts 取样统计
    cjSql570.take = {
        'sql': 'select count(1) as \'data\' , F_DT as \'g1\', F_TYPE as \'g2\' from V_570_LOG_SAMPLE where F_TYPE in (22,12) and date(F_DT) between \'%t1\' and \'%t2\' group by F_DT, F_TYPE order by F_DT, F_TYPE',
    };

    //* Echarts 弃样统计
    cjSql570.throw = {
        'sql': 'select count(1) as \'data\' , F_DT as \'g1\', F_TYPE as \'g2\' from V_570_LOG_SAMPLE where F_TYPE in (31,32) and date(F_DT) between \'%t1\' and \'%t2\' group by F_DT, F_TYPE order by F_DT, F_TYPE',
    };

    // //* Echarts 存样月统计
    // cjSql570.month_save = {
    //    "sql" : "select count(*) as 'data' , F_DT as 'g1', F_TYPE as 'g2' from V_570_LOG_SAMPLE where F_TYPE=21 and date(F_DT) between '%t1' and '%t2'  group by F_DT, F_TYPE order by F_DT, F_TYPE "
    // }
    //
    // //* Echarts 取样月统计
    // cjSql570.month_take = {
    //    "sql" : "select count(*) as 'data' , F_DT as 'g1', F_TYPE as 'g2' from V_570_LOG_SAMPLE where F_TYPE=22 and date(F_DT) between '%t1' and '%t2' group by F_DT, F_TYPE order by F_DT, F_TYPE"
    // }
    //
    // //* Echarts 弃样月统计
    // cjSql570.month_throw = {
    //    "sql" : "select count(*) as 'data' , F_DT as 'g1', F_TYPE as 'g2' from V_570_LOG_SAMPLE where F_TYPE=23 and date(F_DT) between '%t1' and '%t2' group by F_DT, F_TYPE order by F_DT, F_TYPE"
    // }

    //* Echarts 查询柜子系统日志
    cjSql570.cabinet_log = {
        'sql': 'SELECT * FROM T_570_EVT',
    };

    //* Echarts 饼状图sql
    cjSql570.pie_sql = {
        'sql': 'select count(1) as \'data\' , F_DT as \'g1\', F_TYPE as \'g2\' from V_570_LOG_SAMPLE where F_TYPE in (21,11,22,12,32,31) and date(F_DT) between \'%t1\' and \'%t2\'  group by F_DT, F_TYPE order by F_DT, F_TYPE ',
    };

    //* Echarts 折线图sql
    cjSql570.line_sql = {
        'sql': 'select count(1) as \'data\' , F_DT as \'g1\', F_TYPE as \'g2\' from V_570_LOG_SAMPLE where F_TYPE in (21,11,22,12,32,31) and date(F_DT) between \'%t1\' and \'%t2\'  group by F_DT, F_TYPE order by F_DT, F_TYPE ',
    };


    //* Echarts 仪表盘sql
    cjSql570.dashboard_sql = {
        'sql': 'select count(1) as \'data\' from T_570_RT_STATE where F_IS_USED = 1',
    };


//* 操作日志
    cjSql570.sample_log = {
        'sql': 'SELECT * FROM YGCT.T_570_LOG_SAMPLE;',
    };
})();
