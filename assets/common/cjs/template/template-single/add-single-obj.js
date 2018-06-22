/**
 * Created by nielei on 2018/1/9.
 */

'use strict';

define(['jquery', 'async', 'global', 'panelConfig', 'action', 'uix-date', 'registerListener', 'cjcommon', 'cjstorage', 'cjdatabaseaccess', 'cjajax', 'loadNode', 'structure', 'model', 'view', 'controller', 'utils', 'cache', 'jqGridExtension'], function($, async, g) {
    let gDb = null;
    let saveSql;
    let operationData; // 操作按钮

    let gReqParam = null;
    let formID = 'obj_form';
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
            getConfig();
        },
    };

    function getConfig() {
        let arr = sessionStorage.getItem('tbName');
        let arrs = [];
        arrs = arr.split('!');
        let config = JSON.parse(sessionStorage.getItem('addConfig'));
        operationData = [
            {'id': 'saveBtn', 'name': '保存', 'action': config.action, 'reload': config.reload, 'ModelData': config.getModelData},
        ];
        panelConfig.operationInit('operation', operationData);
        btnBind(operationData, arrs[0], config.defConfig);
        panelConfig.objInit(formID, config.defConfig, arrs[0]);
        dateSet(config.defConfig);
        omcCom();
    }

    function btnBind(data, tableName, config) {
        for (let i = 0; i < data.length; i++) {
            $('#' + data[i].id).unbind('click');
            $('#' + data[i].id).click(function() {
                saveSql = action.register(data[i], formID, tableName, config, g);
            });
        }
    }

    function omcCom() {
        let value = '';
        $('#treeNodeType_select').change(function() {
            value = $('#treeNodeType_select').val();
            if (value === 'subs') {
                $('.term').remove();
                let model = `<div class="form-group subs">
                      <label class="control-label">IP：</label>
                      <input name="IP" type="text" id="IP_input" class="form-control">
                     </div>
                     <div class="form-group subs">
                      <label class="control-label">端口：</label>
                      <input name="Port" type="text" id="Port_input" class="form-control">
                     </div>`;
                $('#obj_form').append(model);
            } else if (value === '') {
                $('.term').remove();
                $('.subs').remove();
            } else {
                $('.subs').remove();
                $('.term').remove();
                let model = `<div class="form-group term">
                      <label class="control-label">终端ID：</label>
                      <input name="F_V" type="text" id="F_V_input" class="form-control">
                     </div>
                     <div class="form-group term">
                      <label class="control-label">名称：</label>
                      <input name="F_NAME" type="text" id="F_NAME_input" class="form-control">
                     </div>
                     <div class="form-group term">
                      <label class="control-label">资源名：</label>
                      <input name="F_URI" type="text" id="F_URI_input" class="form-control">
                     </div>
                     <div class="form-group term">
                      <label class="control-label">描述：</label>
                      <input name="F_DESC" type="text" id="F_DESC_input" class="form-control">
                     </div>`;
                $('#obj_form').append(model);
            }
        });
    }

    function dateSet(def) {
        for (let i = 0; i < def.length; i++) {
            if (def[i].textType) {
                if (def[i].textType === 'utcTime' || def[i].textType === 'time') {
                    $('#dtp_input_' + def[i].colName).uixDate({
                        dateType: 'form_datetime', // form_datetime,form_date,form_time
                        readonly: false,
                        name: $.trim(def[i].colName),
                        hideRemove: true,
                        timeType: def[i].textType,
                    });
                }
                // timeName.push(def[i].colName);
            }
        }
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
