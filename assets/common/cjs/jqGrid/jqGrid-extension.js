/**
 * Created by liuchaoyu on 2017-0num-2num.
 */

'use strict';

let jqGridExtend = {
    version: '1.0.0',
};

define(['jquery', 'cjcommon', 'cjdatabaseaccess', 'cjajax', 'cache', 'utils'], function($) {
    let totalPage;
    let PageIndex = 0;
    let sql1 = '';
    let selectID;
    let queryIndex;
  /**
   * 转换jqGrid需要的JSON格式数据
   * @param param : Object 数据对象
   */
    jqGridExtend.createJsonData = function(param) {
        let jsonData = {
            'page': param.curPage,
            'total': param.pageTotal,
            'records': param.records,
            'rows': [],
      // {"invid" : "1","invdate":"cell11", "amount" :"cell12", "tax" :"cell13", "total" :"1234", "note" :"somenote"}, // 数据中需要各列的name，但是可以不按列的顺序
      // {"invid" : "2","invdate":"cell21", "amount" :"cell22", "tax" :"cell23", "total" :"234num", "note" :"some note"},
        };

        jsonData.rows = param.data;

        return JSON.parse(JSON.stringify(jsonData));
    };

  /**
   * jqGrid分页键启用
   */
    jqGridExtend.pagerEnable = function(ID) {
        $('#first_' + ID).removeClass('ui-state-disabled');
        $('#prev_' + ID).removeClass('ui-state-disabled');
        $('#next_' + ID).removeClass('ui-state-disabled');
        $('#last_' + ID).removeClass('ui-state-disabled');
    };

  /**
   * jqGrid统计总页数
   * @param loadSql : string 初始sql语句
   * @param filter : string 过滤条件
   * @param tableName : string 表名
   * @param group : string 分组信息
   * @param num : num 分页数
   * @param recordID :string 显示页数的标签ID
   */
    jqGridExtend.countNum = function(loadSql, filter, tableName, group, num, recordID) {
        let db = window.top.cjDb;
        let serverInfo = cacheOpt.get('server-config');
        let reqHost = serverInfo['server']['ipAddress'];
        let reqPort = serverInfo['server']['httpPort'];
        let reqParam = {
            reqHost: reqHost,
            reqPort: reqPort,
        };
        let sql = 'select count(1) as total from ' + tableName;
        let recordCountSpan = $('#' + recordID) || $('#data_record_count_span');
        let string = 'where';
        if (loadSql !== '') {
            let arr = loadSql.split(' where ');
            if (arr[1] !== undefined) {
                sql = sql + ' where ' + arr[1];
            }
        }
        if (filter !== undefined && filter !== '') {
            let arrs = filter.split('=');
            if (sql.includes(string)) { // ES6语法includes
                if (sql.includes($.trim(arrs[0]))) {
                    let arrs1 = sql.split(' where ');
                    sql = arrs1[0] + ' where ' + filter;
                } else {
                    sql = sql + ' and ' + filter;
                }
            } else {
                sql = sql + ' where ' + filter;
            }
        }
        if (group !== null && group !== '') {
            sql = sql + ' group by ' + group;
        }
        db.load(sql, function fn(err, val) {
            if (err) {
                console.log(err);
            } else {
                if (val.length > 1) {
                    totalPage = val.length;
                } else {
                    totalPage = val[0].total;
                }
                let tot;
                if ((totalPage % num) === 0) {
                    tot = parseInt(totalPage / num) - 1;
                } else {
                    tot = parseInt(totalPage / num);
                }
                if (parseInt(tot + 1) === 0) {
                    recordCountSpan.text('无查询数据');
                } else {
                    recordCountSpan.text('当前第1页,共' + parseInt(tot + 1) + '页');
                }
            }
        }, reqParam);
    };

  /**
   * jqGrid分页
   * @param tbID : string tableID
   * @param loadSql : string 初始sql语句
   * @param filter : string 过滤条件
   * @param tableName : string 表名
   * @param group : string 分组信息
   * @param sort : string 排序索引
   * @param num : num 分页数
   * @param pagerID : string pagerID
   */
    jqGridExtend.paging = function(tbID, loadSql, filter, tableName, group, sort, num, pagerID, def) {
        let sql = '';
        let string = 'where';
        if (loadSql !== '') {
            selectID = loadSql.split(',');
            queryIndex = selectID[0].split(' ');
            if (selectID[0].includes('*')) {
                selectID = ['select ID'];
                selectID[0] = 'select ID';
                queryIndex = selectID[0].split(' ');
            }
            sql = selectID[0] + ' from ' + tableName;
            let arr = loadSql.split(' where ');
            if (arr[1] !== undefined) {
                sql = sql + ' where ' + arr[1];
            }
        } else {
            selectID = ['select ID'];
            sql = 'select ID from ' + tableName;
        }
        if (filter !== undefined && filter !== '') {
            let arrs = filter.split('=');
            if (sql.includes(string)) { // ES6语法includes
                if (sql.includes($.trim(arrs[0]))) {
                    let arrs1 = sql.split(' where ');
                    sql = arrs1[0] + ' where ' + filter;
                } else {
                    sql = sql + ' and ' + filter;
                }
            } else {
                sql = sql + ' where ' + filter;
            }
        }
        if (group !== null && group !== '') {
            sql = sql + ' group by ' + group;
        }
        if (sort !== null && sort !== '') {
            if (sql.includes('from')) {
                sql = sql + ' order by ' + sort;
            } else {
                sql = sql + ' order by ' + sort;
            }
        } else {
            if (sql.includes('from')) {
                sql = sql + ' order by ' + queryIndex[1] + ' desc';
            } else {
                sql = sql + ' order by ' + queryIndex[1] + ' desc';
            }
        }
    // if (PageIndex === 0) {
        sql1 = sql;
        sql = sql + ' limit ' + PageIndex * num + ',' + num + ';';
    // }
        selID(tbID, sql, loadSql, selectID, tableName, sort, pagerID, def);
    };

  /**
   * jqGrid分页按钮实现
   * @param tbID : string tableID
   * @param loadSql : string 初始sql语句
   * @param tableName : string 表名
   * @param sort : string 排序索引
   * @param num : num 分页数
   * @param pagerID : string pager的ID
   * @param recordID :string 显示页数的标签ID
   */
    jqGridExtend.pageBtn = function(tbID, loadSql, tableName, sort, num, pagerID, recordID, def) {
        PageIndex = 0;
        $(document).on('jqGrid_gird_' + pagerID, function(evt, pgBtn) {
            let recordCountSpan = $('#' + recordID) || $('#data_record_count_span');
            let sql = '';
            let lastPage;
            if ((totalPage % num) === 0) {
                lastPage = parseInt(totalPage / num) - 1;
            } else {
                lastPage = parseInt(totalPage / num);
            }
            if (pgBtn === 'first_' + pagerID) {
                PageIndex = 0;
                sql = sql1 + ' limit ' + PageIndex * num + ',' + num + ';';
            } else if (pgBtn === 'last_' + pagerID) {
                PageIndex = lastPage;
                sql = sql1 + ' limit ' + PageIndex * num + ',' + num + ';';
            } else if (pgBtn === 'prev_' + pagerID) {
                if (PageIndex > 0) {
                    PageIndex--;
                }
                sql = sql1 + ' limit ' + PageIndex * num + ',' + num + ';';
            } else if (pgBtn === 'next_' + pagerID) {
                if (PageIndex === lastPage) {
                    PageIndex = lastPage;
                } else {
                    PageIndex++;
                }
                sql = sql1 + ' limit ' + PageIndex * num + ',' + num + ';';
            }
            if (parseInt(lastPage + 1) === 0) {
                recordCountSpan.text('无查询数据');
            } else {
                recordCountSpan.text('当前第' + parseInt(PageIndex + 1) + '页,共' + parseInt(lastPage + 1) + '页');
            }
            selID(tbID, sql, loadSql, selectID, tableName, sort, pagerID, def);
        });
    };

    function selID(tbID, sql, loadSql, colName, tableName, sort, pagerID, def) {
        let db = window.top.cjDb;
        let serverInfo = cacheOpt.get('server-config');
        let reqHost = serverInfo['server']['ipAddress'];
        let reqPort = serverInfo['server']['httpPort'];
        let reqParam = {
            reqHost: reqHost,
            reqPort: reqPort,
        };
        let sql1 = '';
        let fSql = '';
        if (loadSql !== '') {
            if (loadSql.includes('where')) {
                sql1 = loadSql.split(' where ');
                fSql = sql1[0];
            } else {
                sql1 = loadSql;
                fSql = sql1;
            }
        } else {
            fSql = 'select * from ' + tableName;
        }
        let col = colName[0].split(' ');
        db.load(sql, function fn(e, v) {
            if (e) {
                console.log(e);
            } else {
                if (v.length === 0) {
                    tbID.jqGrid('clearGridData', false);
                    return;
                } else {
                    fSql = fSql + ' where ';
                    for (let i = 0; i < v.length; i++) {
                        if (i < v.length - 1) {
                            fSql = fSql + ' ' + col[1] + ' = ' + '\'' + v[i][col[1]] + '\'' + ' or ';
                        } else {
                            fSql = fSql + ' ' + col[1] + ' = ' + '\'' + v[i][col[1]] + '\'';
                        }
                    }
                    if (sort !== null && sort !== '') {
                        if (fSql.includes('from')) {
                            fSql = fSql + ' order by ' + sort;
                        } else {
                            fSql = fSql + ' order by ' + sort;
                        }
                    } else {
                        if (fSql.includes('from')) {
                            fSql = fSql + ' order by ' + queryIndex[1] + ' desc';
                        } else {
                            fSql = fSql + ' order by ' + queryIndex[1] + ' desc';
                        }
                    }
                }
                loadTBData(fSql, tbID, pagerID, def);
            }
        }, reqParam);
    }

    function loadTBData(sql, tbID, pagerID, def) {
        let db = window.top.cjDb;
        let serverInfo = cacheOpt.get('server-config');
        let reqHost = serverInfo['server']['ipAddress'];
        let reqPort = serverInfo['server']['httpPort'];
        let reqParam = {
            reqHost: reqHost,
            reqPort: reqPort,
        };
        let jqGridTable = tbID;
        jqGridTable.jqGrid('clearGridData', false);
        db.load(sql, function fn(err, vals) {
            if (err) {
                console.log(err);
            }

            let recordLength = vals.length;

            let arr =[];
            if (def) {
                for (let i = 0; i < def.length; i ++) {
                    if (def[i].textType) {
                        let obj = {};
                        obj.colName = def[i].colName;
                        obj.textType = def[i].textType;
                        arr.push(obj);
                    }
                }
            }

            for (let i = 0; i <= recordLength; i++) {
                if (i < recordLength) {
                    for (let j = 0; j < arr.length; j ++) {
                        if (vals[i][arr[j].colName]) {
                            if (arr[j].textType === 'utcTime') {
                                vals[i][arr[j].colName] = utils.time.utc2Locale(vals[i][arr[j].colName]);
                            }
                        }
                    }
                    if (vals[i].F_TYPE !== undefined && vals[i].F_V !== undefined) {
                        if (vals[i].F_TYPE === 10) {
                            let obj = utils.dataProcess.kvStrToObj(vals[i].F_V);
                            vals[i].F_V = obj.value;
                        }
                        if (vals[i].F_TYPE === 20) {
                            let obj = JSON.parse(vals[i].F_V);
                            vals[i].F_V = obj.value;
                        }
                    }
                    let aGroup = vals[i];
                    jqGridTable.jqGrid('addRowData', i + 1, aGroup);
                    jqGridTable.jqGrid('setCell', i + 1, 'rowID', i + 1);
                }
                if (i === recordLength) {
                    jqGridTable.jqGrid('setCell', i, 'rowID', i);
                }
            }
            jqGridExtend.pagerEnable(pagerID);
            let priData = tbID.jqGrid('getRowData');
            sessionStorage.setItem('tablePriData', JSON.stringify(priData));
        }, reqParam);
    }
});
