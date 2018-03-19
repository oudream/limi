/**
 * Created by nielei on 2018/1/9.
 */
/**
 * Created by nielei on 2017/11/17.
 */

'use strict'

define(['jquery', 'async', 'global', 'panelConfig', 'action', 'registerListener', 'alarmModal', 'cjcommon', 'cjstorage', 'cjdatabaseaccess', 'cjajax', 'loadNode', 'structure', 'model', 'view', 'controller', 'utils', 'cache', 'jqGridExtension'], function ($, async, g) {
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
    operationData = [
      {'id': 'saveBtn', 'name': '新增', 'action': 'saveAddAction'}
    ]
    $.ajax({
      url: configUrl,
      type: 'get',
      complete: function (response) {
        if (response.status === 200) {
          $.getJSON(configUrl, function (e, data) {
            console.log(e)
            netype = data.neType
            localData = data.localData
            tableName = data.tbName
            loadPropertyDef(gDb)
            if (operationData !== null) {
              panelConfig.operationInit('operation', operationData)
              btnBind(operationData)
            }
          })
        } else {
          let config = JSON.parse(sessionStorage.getItem('addConfig'))
          panelConfig.operationInit('operation', operationData)
          omcBtnBind(operationData, arrs[0], config)
          panelConfig.objInit(formID, config, arrs[0])
        }
      }
    })
  }

  function loadPropertyDef (db, callback) {
    let sql = 'select * from qms_propertydef'
    db.load(sql, function (err, vals) {
      let sNeType
      for (let i = 0; i < vals.length; i++) {
        let val = vals[i]
        sNeType = val.NeType
        if (sNeType === netype) {
          let define = {
            propName: vals[i].PropName,
            colName: vals[i].ColumnName,
            visible: vals[i].Visible,
            propType: vals[i].PropType,
            unique: vals[i].Unique,
            required: vals[i].Required,
            readOnly: vals[i].ReadOnly,
            defaultValue: vals[i].DefaultValue,
            valueScopes: vals[i].ValueScopes,
            foreignKey: vals[i].ForeignKey,
            width: vals[i].DisplayWidth
          }
          def.push(define)
        }
      }
      panelConfig.objInit(formID, def, tableName)
      registerListener.listener()
    }, gReqParam)
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
