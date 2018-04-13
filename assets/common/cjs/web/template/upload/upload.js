/**
 * Created by nielei on 2018/3/29.
 */

'use strict';

define(['jquery', 'global', 'ipmortCSV', 'cjstorage', 'cjdatabaseaccess', 'cjajax', 'cache'], function($, g) {
    let gDb = null;
    let gReqParam = null;

    let oAction = {
        init: function() {
            let db = window.top.cjDb;
            gDb = db;
            let serverInfo = cacheOpt.get('server-config');
            let reqHost = serverInfo['server']['ipAddress'];
            let reqPort = serverInfo['server']['httpPort'];
            let reqParam = {
                reqHost: reqHost,
                reqPort: reqPort,
            };
            gReqParam = reqParam;
            btnClick();
        },
    };

    function btnClick() {
        $('#save').click(function() {
            csv();
        });
    }

    function csv() {
        $('input[name=csvfile]').csv2arr(function(arr) {
            let colName = arr[0];
            let insertSql = '';
            let ins = '';
            let dbName = sessionStorage.getItem('targetDB');
            for (let i = 1; i < arr.length; i++) {
                if (arr[i].length === 1 && !arr[i][0]) {
                    arr.splice(i - 1, 1);
                    break;
                }
                for (let j = 0; j < arr[i].length; j++) {
                    if (j < arr[i].length - 1) {
                        if (arr[i][j] === '') {
                            ins = ins + null + ',';
                        } else {
                            ins = ins + '\'' + arr[i][j] + '\'' + ',';
                        }
                    }
                    if (j === arr[i].length - 1) {
                        ins = ins + '\'' + arr[i][j] + '\'';
                    }
                }
                insertSql = insertSql + 'insert into ' + dbName + '(' + colName + ') values (' + ins + ');';
                ins = '';
            }
            gDb.loadT(insertSql, function fn(e, v) {
                if (e) {
                    console.log(e);
                } else {
                    window.alert('导入成功！');
                    $('.modal', window.parent.document).hide();
                    $('.modal-backdrop', window.parent.document).remove();
                    $('#box_content iframe', window.parent.document).last()[0].src = $('#box_content iframe', window.parent.document).last()[0].src;
                }
            }, gReqParam);
        });
    }
  /**
   * 模块返回调用接口
   */
    return {
        beforeOnload: function() {
        },

        onload: function() {
            oAction.init();
        },
    };
});
