/**
 * Created by nielei on 2018/1/9.
 */

'use strict'

define(['jquery', 'async', 'global', 'panelConfig', 'action', 'registerListener', 'cjcommon', 'cjstorage', 'cjdatabaseaccess', 'cjajax', 'loadNode', 'structure', 'model', 'view', 'controller', 'utils', 'cache', 'jqGridExtension'], function ($, async, g) {
  let gDb = null
  let netype // 表定义表中的NeType
  let tableName // 表名
  let saveSql
  let localData // 本地数据
  let def = [] // 表定义表相关定义
    // let copyData
  let operationData // 操作按钮

  let gReqParam = null
  let formID = 'obj_form'
  let oAction = {
    init: function () {
      let db = window.top.cjDb
      gDb = db
      let serverInfo = cacheOpt.get('server-config')
      let reqHost = serverInfo['server']['ipAddress']
      let reqPort = serverInfo['server']['httpPort']
      let reqParam = {
        reqHost: reqHost,
        reqPort: reqPort
      }
      gReqParam = reqParam
      getConfig()
    }
  }

  function getConfig () {
    let arr = sessionStorage.getItem('tbName')
    let arrs = []
    arrs = arr.split('!')
    let projectName = sessionStorage.getItem('projectName')
    let configUrl = '/ics/' + projectName + '/config/template_config/' + arrs[0] + '.json'
    $.ajax({
      url: configUrl,
      type: 'get',
      complete: function (response) {
        if (response.status === 200) {
          $.getJSON(configUrl, function (data) {
            // console.log(e)
            netype = data.neType
            localData = data.localData
            tableName = data.tbName
            def = data.def
            operationData = [
              {'id': 'saveBtn', 'name': '新增', 'action': 'saveAddAction'}
            ]
            loadPropertyDef(gDb)
            if (operationData !== null) {
              panelConfig.operationInit('operation', operationData)
              btnBind(operationData)
            }
          })
        } else {
          let config = JSON.parse(sessionStorage.getItem('addConfig'))
          operationData = [
            {'id': 'saveBtn', 'name': '保存', 'action': config.action, 'reload': config.reload}
          ]
          panelConfig.operationInit('operation', operationData)
          omcBtnBind(operationData, arrs[0], config.defConfig)
          panelConfig.objInit(formID, config.defConfig, arrs[0])
          omcCom()
        }
      }
    })
  }

  function loadPropertyDef (db, callback) {
    // let sql = 'select * from qms_propertydef'
    // db.load(sql, function (err, vals) {
    //   let sNeType
    //   for (let i = 0; i < vals.length; i++) {
    //     let val = vals[i]
    //     sNeType = val.NeType
    //     if (sNeType === netype) {
    //       let define = {
    //         propName: vals[i].PropName,
    //         colName: vals[i].ColumnName,
    //         visible: vals[i].Visible,
    //         propType: vals[i].PropType,
    //         unique: vals[i].Unique,
    //         required: vals[i].Required,
    //         readOnly: vals[i].ReadOnly,
    //         defaultValue: vals[i].DefaultValue,
    //         valueScopes: vals[i].ValueScopes,
    //         foreignKey: vals[i].ForeignKey,
    //         width: vals[i].DisplayWidth
    //       }
    //       def.push(define)
    //     }
    //   }
      panelConfig.objInit(formID, def, tableName)
      registerListener.listener()
    // }, gReqParam)
  }

  function btnBind (data) {
    for (let i = 0; i < data.length; i++) {
      $('#' + data[i].id).unbind('click')
      $('#' + data[i].id).click(function () {
        saveSql = action.register(data[i], formID, tableName, def, g)
      })
    }
  }

  function omcBtnBind (data, tableName, config) {
    for (let i = 0; i < data.length; i++) {
      $('#' + data[i].id).unbind('click')
      $('#' + data[i].id).click(function () {
        saveSql = action.register(data[i], formID, tableName, config, g)
      })
    }
  }

  function omcCom () {
    let value = ''
    $('#treeNodeType_select').change(function () {
      value = $('#treeNodeType_select').val()
      if (value === 'subs') {
        $('.term').remove()
        let model = `<div class="form-group subs">
                      <label class="control-label">IP：</label>
                      <input name="IP" type="text" id="IP_input" class="form-control">
                     </div>
                     <div class="form-group subs">
                      <label class="control-label">端口：</label>
                      <input name="Port" type="text" id="Port_input" class="form-control">
                     </div>`
        $('#obj_form').append(model)
      } else if (value === '') {
        $('.term').remove()
        $('.subs').remove()
      } else {
        $('.subs').remove()
        $('.term').remove()
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
                     </div>`
        $('#obj_form').append(model)
      }
    })
  }

    /**
     * 模块返回调用接口
     */
  return {
    beforeOnload: function () {
    },

    onload: function () {
      oAction.init()
    }
  }
})
