/**
 * Created by nielei on 2017/11/20.
 */

'use strict'

let action = {

}
define(['jquery', 'cjcommon', 'cjdatabaseaccess', 'cjajax', 'cache', 'utils'], function ($) {
  action.register = function (data, tbID, tbName, def, g, copyData) {
    switch (data.action) {
      case 'newAction':addAction(tbID, def, tbName, g)
        break
      case 'omcAddAction':omcAddAction(def, tbName, g)
        break
      case 'delAction': delAction(tbID, tbName, def)
        break
      case 'omcCommunicationDelAction': omcCommunicationDelAction(tbID)
        break
      case 'saveAction': saveAction(tbID, tbName, def, copyData)
        break
      case 'saveOmcCommunicationPropAction': saveOmcCommunicationPropAction(tbID, tbName, def, copyData)
        break
      case 'saveOmcCommunicationOtherAction': saveOmcCommunicationOtherAction(tbID, tbName, def, copyData)
        break
      case 'saveSetAction': saveSetAction(tbID, tbName, def, copyData)
        break
      case 'saveAssayAction': saveAssayAction(tbID, tbName, def, copyData)
        break
      case 'saveCheckAction': saveCheckAction(tbID, tbName, def, copyData)
        break
      case 'saveObjAction': saveObjAction(tbID, tbName, def)
        break
      case 'saveAddAction': saveAddAction(tbID, tbName, def)
        break
      case 'saveOmcCommunicationAction': saveOmcCommunicationAction(tbID, tbName, def)
        break
      case 'saveSetObjAction': saveSetObjAction(tbID, tbName, def)
        break
      case 'saveRuntimeObjAction': saveRuntimeObjAction(tbID, tbName, def)
        break
      case 'adjustSaveAction': adjustSaveAction(tbID, def, copyData)
        break
      case 'stopAction': stopAction(tbID, def, copyData)
        break
      case 'unLockAction': unLockAction(tbID, tbName)
        break
      case 'bindCardAction':bindCardAction(data)
        break
      case 'returnCardAction':returnCardAction(tbID)
        break
      case 'modalAction':modalAction(g, data, tbID)
        break
      case 'mergeModalAction':mergeModalAction(g, data, tbID)
        break
      case 'mergeAction':mergeAction(tbID, tbName)
        break
      case 'exportCsvAction':exportToCsv(tbID)
        break
      case 'upAction':upAction(tbID, tbName, data)
        break
      case 'downAction':downAction(tbID, tbName, data)
        break
      case 'foreMostAction':foremostAction(tbID, tbName, data)
        break
    }
  }
  action.queryAction = function (id) {
    let data = getFormData(id)
    let sql = ''
    for (let i = 0; i < data.length; i++) {
      if (data[i].value !== '') {
        for (let j = i + 1; j < data.length; j++) {
          if (data[j].value !== '') {
            if ($.trim(data[i].name) === 'StartTime') {
              sql = sql + 'F_T > ' + '\'' + data[i].value + '\'' + ' and '
            } else if ($.trim(data[i].name) === 'EndTime') {
              sql = sql + 'F_T < ' + '\'' + data[i].value + '\'' + ' and '
            } else {
              sql = sql + data[i].name + ' = ' + '\'' + data[i].value + '\'' + ' and '
            }
            break
          }
          if (j === data.length - 1) {
            if (data[j].value === '') {
              if ($.trim(data[i].name) === 'StartTime') {
                sql = sql + 'F_T > ' + '\'' + data[i].value + '\''
              } else if ($.trim(data[i].name) === 'EndTime') {
                sql = sql + 'F_T < ' + '\'' + data[i].value + '\''
              } else {
                sql = sql + data[i].name + ' = ' + '\'' + data[i].value + '\''
              }
            }
          }
        }
        if (i === data.length - 1) {
          if ($.trim(data[i].name) === 'StartTime') {
            sql = sql + 'F_T > ' + '\'' + data[i].value + '\''
          } else if ($.trim(data[i].name) === 'EndTime') {
            sql = sql + 'F_T < ' + '\'' + data[i].value + '\''
          } else {
            sql = sql + data[i].name + ' = ' + '\'' + data[i].value + '\''
          }
        }
      }
    }
    return sql
  }

  /**
   * 添加操作
   * @param tbID : num 单表id
   * @param def : obj 表定义表中配置
   * @param tableName : string 数据库表名
   */
  function addAction (tbID, def, tableName, g) {
    let newRow = {
    }

    let propConfGrid = tbID
    let newRowId = tbID.jqGrid('getGridParam', 'records') + 1
    newRow.newTag = 'new'
    propConfGrid.jqGrid('addRowData', newRowId, newRow)

    //  设置默认值
    for (let i = 0; i < def.length; i++) {
      if ((def[i].defaultValue !== '') && (def[i].defaultValue !== null)) {
        let defaultValue = def[i].defaultValue
        let obj = JSON.parse(defaultValue)
        let num = []
        let maxNum
        let code
        let data = tbID.jqGrid('getRowData')
        let date = utils.time.getDate('none')
        let dateTime = utils.time.getDateTime()

        // 默认值根据规则生成
        if (obj.type === '0') {
          let arr = obj.value.split('+')
          let sql = 'select ' + def[i].colName + ' from ' + tableName + ' order by ID asc'
          let db = window.top.cjDb
          let serverInfo = cacheOpt.get('server-config')
          let reqHost = serverInfo['server']['ipAddress']
          let reqPort = serverInfo['server']['httpPort']
          let reqParam = {
            reqHost: reqHost,
            reqPort: reqPort
          }
          db.load(sql, function fn (err, vals) {
            if (err) {
              console.log(err)
            } else {
              let maxDbNum = vals[vals.length - 1]
              maxDbNum = maxDbNum[def[i].colName].substr(maxDbNum[def[i].colName].length - Number(arr[1]))
              for (let t = 0; t < data.length; t++) {
                num.push(Number(data[t][def[i].colName].substr(data[t][def[i].colName].length - Number(arr[1]))))
              }
              maxNum = Math.max.apply(Math, num)
              if (parseInt(maxDbNum) > parseInt(maxNum)) {
                maxNum = maxDbNum
              }
              maxNum = Number(maxNum) + 1
              if (maxNum.toString().length !== Number(arr[1])) {
                let len = Number(arr[1]) - maxNum.toString().length
                for (let k = 0; k < len; k++) {
                  maxNum = '0' + maxNum
                }
                // maxNum.padStart(len, '0')
              }
              if (obj.rule === '1') {
                code = arr[0] + maxNum
              }
              if (obj.rule === '2') {
                code = arr[0] + date + maxNum
              }
              tbID.setCell(newRowId, def[i].colName, code)
            }
          }, reqParam)
        }
        // 默认值为时间
        if (obj.type === '1') {
          tbID.setCell(newRowId, def[i].colName, dateTime)
        }
        // 默认值为操作人员
        if (obj.type === '2') {
          tbID.setCell(newRowId, def[i].colName, sessionStorage.getItem('s_user'))
        }
        // 默认值为表定义表默认值
        if (obj.type === '3') {
          tbID.setCell(newRowId, def[i].colName, obj.value)
        }
      }
    }
    let u = 'common/chtml/template/single/add-single-obj.html?' + sessionStorage.getItem('tbName')

    g.iframe({
      title: '新增',
      ajaxWindow: false,
      show: true,
      // backdrop: true,
      type: 'iframe', // iframe / html / alert / confirm
      width: 1200,
      height: 400,
      footerButtonAlign: 'right',
      url: g.url(u)
    })
  }

  /**
   * omc添加操作(未使用json文件配置)
   * @param def : obj 表定义表中配置
   * @param tableName : string 数据库表名
   * @param g : obj 全局对象
   */
  function omcAddAction (def, tableName, g) {
    let config = JSON.stringify(def)
    sessionStorage.setItem('addConfig', config)
    sessionStorage.setItem('tbName', tableName)
    let u = 'common/chtml/template/single/add-single-obj.html'

    g.iframe({
      title: '新增',
      ajaxWindow: false,
      show: true,
      // backdrop: true,
      type: 'iframe', // iframe / html / alert / confirm
      width: 1200,
      height: 400,
      footerButtonAlign: 'right',
      url: g.url(u)
    })
  }

  /**
   * 删除操作
   * @param tbID : num 单表id
   * @param def : obj 表定义表中配置
   * @param tableName : string 数据库表名
   */
  function delAction (tbID, tableName, def) {
    let propConfGrid = tbID
    let colName = []
    let propName = []
    let deleteData = []
    let selectedId = propConfGrid.jqGrid('getGridParam', 'selrow')
    let log = '删除:'
    tbID.jqGrid('saveRow', selectedId)
    let col = 'ID'
    let del = propConfGrid.jqGrid('getCell', selectedId, col)
    let data = propConfGrid.jqGrid('getRowData', selectedId)
    for (let j = 1; j < def.length; j++) {
      colName.push(def[j].colName)
      propName.push(def[j].propName)
    }
    for (let i = 0; i < colName.length; i++) {
      deleteData.push(data[colName[i]])
      log = log + propName[i] + ':' + deleteData[i] + ','
    }
    propConfGrid.jqGrid('delRowData', selectedId)

    let deleteSql = 'DELETE FROM ' + tableName + ' WHERE ID = ' + '\'' + del + '\''
    if (window.confirm('确认删除？')) {
      executeSql(deleteSql, log)
    }
  }
  /**
   * 删除操作
   * @param tbID : num 单表id
   */
  async function omcCommunicationDelAction (tbID) {
    let propConfGrid = tbID
    let selectedId = propConfGrid.jqGrid('getGridParam', 'selrow')
    let deleteSql = ''
    let log = '删除:'
    tbID.jqGrid('saveRow', selectedId)
    let col = 'F_ID'
    let del = propConfGrid.jqGrid('getCell', selectedId, col)
    propConfGrid.jqGrid('delRowData', selectedId)
    let querySql = `select F_V from omc_vxd_prop where F_PID = '${del}'`
    let vals = await loadSql(querySql)
    for (let i = 0; i < vals.length; i++) {
      if (vals[i].F_URI !== 'TerminalId') {
        deleteSql = deleteSql + 'delete from omc_vxd_obj where F_ID = ' + '\'' + vals[i].F_V + '\'' + ';delete from omc_vxd_prop where F_PID = ' + '\'' + vals[i].F_V + '\'' + ';'
      } else {
        deleteSql = deleteSql + 'delete from omc_vxd_obj where F_ID = ' + '\'' + del + '\'' + ';delete from omc_vxd_prop where F_PID = ' + '\'' + del + '\'' + ';'
      }
    }
    if (window.confirm('确认删除？')) {
      executeSql(deleteSql, log)
    }
  }

  /**
   * 保存操作
   * @param tbId : num 单表id
   * @param def : obj 表定义表中配置
   * @param tableName : string 数据库表名
   * @param copyData : obj 表格更改前数据
   */
  function saveAction (tbId, tableName, def, copyData) {
    let propConfGrid = tbId
    let selectedId = propConfGrid.jqGrid('getGridParam', 'selrow')
    propConfGrid.jqGrid('saveRow', selectedId)
    let updateSql = ''
    let insertSql = ''
    let log = ''
    let colName = []
    let propName = []
    let sql
    let maxId
    let id = []
    let data = getJQAllData(tbId)
    // 获取最大ID
    for (let i = 0; i < data.length; i++) {
      id.push(Number(data[i].ID))
    }
    for (let j = 1; j < def.length; j++) {
      colName.push(def[j].colName)
      propName.push(def[j].propName)
    }
    maxId = Math.max.apply(Math, id) + 1
    for (let len = 0; len < data.length; len++) {
      if (data[len].newTag === 'new') {
        let arr = data[len]
        let insData = []
        let ins = ''
        log = log + '新增：'
        if (checkLimit(arr, def, copyData, len)) {
          for (let i = 0; i < colName.length; i++) {
            insData.push(arr[colName[i]])
            if (i < colName.length - 1) {
              if (insData[i] === '') {
                ins = ins + null + ','
              } else {
                ins = ins + '\'' + insData[i] + '\'' + ','
              }
            }
            if (i === colName.length - 1) {
              ins = ins + '\'' + insData[i] + '\''
            }
            log = log + propName[i] + ':' + insData[i] + ','
          }

          insertSql = insertSql + 'insert into ' + tableName + '(' + 'ID,' + colName + ')' +
            ' values' + '(' + maxId + ',' + ins + ')' + ';'
        }
        maxId = maxId + 1
      } else if (data[len].oldTag === 'old') {
        let arr = data[len]
        let copyArr = copyData[len]
        let upID = data[len].ID
        // let copyArr = copyData[len]
        let upDate = []
        let upD = ''
        log = log + '更新：'
        if (checkChange(arr, copyArr, colName)) {
          if (checkLimit(arr, def, copyData, len)) {
            for (let i = 0; i < colName.length; i++) {
              upDate.push(arr[colName[i]])
              if (i < colName.length - 1) {
                if (upDate[i] === '') {
                  upD = upD + colName[i] + '=' + null + ','
                } else {
                  upD = upD + colName[i] + '=' + '\'' + upDate[i] + '\'' + ','
                }
              }
              if (i === colName.length - 1) {
                upD = upD + colName[i] + '=' + '\'' + upDate[i] + '\''
              }
              log = log + propName[i] + ':' + upDate[i] + ','
            }

            updateSql = updateSql + 'update ' + tableName + ' set ' + upD +
              ' where ID = ' + upID + ';'
          }
        }
      }
    }
    sql = insertSql + updateSql
    // alert(sql)
    executeSql(sql, log)
  }

  /**
   * 保存omc通信设置属性操作
   * @param tbId : num 单表id
   * @param def : obj 表定义表中配置
   * @param tableName : string 数据库表名
   * @param copyData : obj 表格更改前数据
   */
  async function saveOmcCommunicationPropAction (tbId, tableName, def, copyData) {
    let propConfGrid = tbId
    let selectedId = propConfGrid.jqGrid('getGridParam', 'selrow')
    propConfGrid.jqGrid('saveRow', selectedId)
    let insertSql = ''
    let delSql = ''
    let queryPropMSql = ''
    let colName = []
    let propName = []
    let sql
    let data = getJQAllData(tbId)
    for (let j = 1; j < def.length; j++) {
      colName.push(def[j].colName)
      propName.push(def[j].propName)
    }
    for (let len = 0; len < data.length; len++) {
      if (data[len].oldTag === 'old') {
        let arr = data[len]
        let copyArr = copyData[len]
        if (checkChange(arr, copyArr, colName)) {
          if (arr.F_URI !== 'TerminalId') {
            let arrs = arr.F_URI.split('_')
            delSql = delSql + 'delete from omc_vxd_obj where F_ID = ' + '\'' + arr.pName + '\'' + ';' +
              'delete from omc_vxd_prop where F_PID = ' + '\'' + arr.pName + '\'' + ';'
            insertSql = insertSql + 'insert into omc_vxd_obj (F_ID,F_CLASS,F_V,F_URI,F_DESC,F_TYPE,F_LEN,F_SYN_FLAG,F_DT_FLAG,F_ST_FLAG) values' +
              ' (' + '\'' + arr.pName + '\'' + ',' + '\'' + arrs[0].toUpperCase() + '\'' + ',' + '\'' + arr.F_V + '\'' + ',' + '\'' + arr.uri + '\'' + ',' + '\'' + arr.F_DESC + '\'' +
              ',' + '\'' + 0 + '\'' + ',' + '\'' + 0 + '\'' + ',' + '\'' + 0 + '\'' + ',' + '\'' + 0 + '\'' + ',' + '\'' + 1 + '\'' + ');'
            queryPropMSql = 'select F_URI,F_NAME from omc_vxd_prop_m where F_PID = ' + '\'' + arr.F_V + '\'' + ';'
            let vals = await loadSql(queryPropMSql)
            for (let i = 0; i < vals.length; i++) {
              insertSql = insertSql + 'insert into omc_vxd_prop (F_ID,F_PID,F_URI,F_CLASS,F_TYPE,F_LEN,F_SYN_FLAG,F_DT_FLAG,F_ST_FLAG) values(' + '\'' + arr.pName + '_000' + Number(i + 1) + '\'' + ',' +
                '\'' + arr.pName + '\'' + ',' + '\'' + vals[i].F_URI + '\'' + ',' + '\'' + arrs[0].toUpperCase() + '\'' + ',' + '\'' + 1 + '\'' + ',' + '\'' + 0 + '\'' + ',' + '\'' + 0 + '\'' + ',' + '\'' + 0 + '\'' + ',' + '\'' + 1 + '\'' + ');'
            }
          }
        }
      }
    }
    sql = delSql + insertSql
    // console.log(sql)
    executeSql(sql)
  }

  /**
   * 保存omc通信设置链路、协议操作
   * @param tbId : num 单表id
   * @param def : obj 表定义表中配置
   * @param tableName : string 数据库表名
   * @param copyData : obj 表格更改前数据
   */
  async function saveOmcCommunicationOtherAction (tbId, tableName, def, copyData) {
    let propConfGrid = tbId
    let selectedId = propConfGrid.jqGrid('getGridParam', 'selrow')
    propConfGrid.jqGrid('saveRow', selectedId)
    let updateSql = ''
    let colName = []
    let propName = []
    let sql
    let data = getJQAllData(tbId)
    for (let j = 1; j < def.length; j++) {
      colName.push(def[j].colName)
      propName.push(def[j].propName)
    }
    for (let len = 0; len < data.length; len++) {
      if (data[len].oldTag === 'old') {
        let arr = data[len]
        let copyArr = copyData[len]
        if (checkChange(arr, copyArr, colName)) {
          updateSql = updateSql + 'update omc_vxd_prop set F_V = ' + '\'' + arr.F_V + '\'' + ' where ID = ' +arr.ID +';'
        }
      }
    }
    sql = updateSql
    // console.log(sql)
    executeSql(sql)
  }

  /**
   * 保存系统参数操作
   * @param tbId : num 单表id
   * @param def : obj 表定义表中配置
   * @param tableName : string 数据库表名
   * @param copyData : obj 表格更改前数据
   */
  function saveSetAction (tbId, tableName, def, copyData) {
    let propConfGrid = tbId
    let selectedId = propConfGrid.jqGrid('getGridParam', 'selrow')
    propConfGrid.jqGrid('saveRow', selectedId)
    let updateSql = ''
    let insertSql = ''
    let log = ''
    let colName = []
    let propName = []
    let sql
    let maxId
    let id = []
    let data = getJQAllData(tbId)
    // 获取最大ID
    for (let i = 0; i < data.length; i++) {
      id.push(Number(data[i].ID))
    }
    for (let j = 1; j < def.length; j++) {
      colName.push(def[j].colName)
      propName.push(def[j].propName)
    }
    maxId = Math.max.apply(Math, id) + 1
    for (let len = 0; len < data.length; len++) {
      if (data[len].newTag === 'new') {
        let arr = data[len]
        let insData = []
        let ins = ''
        log = log + '新增：'
        if (checkLimit(arr, def, copyData, len)) {
          for (let i = 0; i < colName.length; i++) {
            insData.push(arr[colName[i]])
            if (i < colName.length - 1) {
              if (insData[i] === '') {
                ins = ins + null + ','
              } else {
                ins = ins + '\'' + insData[i] + '\'' + ','
              }
            }
            if (i === colName.length - 1) {
              ins = ins + '\'' + insData[i] + '\''
            }
            log = log + propName[i] + ':' + insData[i] + ','
          }

          insertSql = insertSql + 'insert into ' + tableName + '(' + colName + ',F_SETTYPE)' +
            ' values' + '(' + ins + ',' + '\'' + def[0].neType + '\'' + ')' + ';'
        }
        maxId = maxId + 1
      } else if (data[len].oldTag === 'old') {
        let arr = data[len]
        let copyArr = copyData[len]
        let upID = data[len].ID
        // let copyArr = copyData[len]
        let upDate = []
        let upD = ''
        log = log + '更新：'
        if (checkChange(arr, copyArr, colName)) {
          if (checkLimit(arr, def, copyData, len)) {
            for (let i = 0; i < colName.length; i++) {
              upDate.push(arr[colName[i]])
              if (i < colName.length - 1) {
                if (upDate[i] === '') {
                  upD = upD + colName[i] + '=' + null + ','
                } else {
                  upD = upD + colName[i] + '=' + '\'' + upDate[i] + '\'' + ','
                }
              }
              if (i === colName.length - 1) {
                upD = upD + colName[i] + '=' + '\'' + upDate[i] + '\''
              }
              log = log + propName[i] + ':' + upDate[i] + ','
            }

            updateSql = updateSql + 'update ' + tableName + ' set ' + upD +
              ' where ID = ' + upID + ' and F_SETTYPE = ' + '\'' + def[0].neType + '\'' + ';'
          }
        }
      }
    }
    sql = insertSql + updateSql
    // alert(sql)
    executeSql(sql, log)
  }

  /**
   * 保存化验结果操作
   * @param tbId : num 单表id
   * @param def : obj 表定义表中配置
   * @param tableName : string 数据库表名
   * @param copyData : obj 表格更改前数据
   */
  function saveAssayAction (tbId, tableName, def, copyData) {
    let propConfGrid = tbId
    let selectedId = propConfGrid.jqGrid('getGridParam', 'selrow')
    propConfGrid.jqGrid('saveRow', selectedId)
    let updateSql = ''
    let colName = []
    let propName = []
    let log = '修改:'
    let sql
    let data = getJQAllData(tbId)
    for (let j = 1; j < def.length; j++) {
      colName.push(def[j].colName)
      propName.push(def[j].propName)
    }
    for (let len = 0; len < data.length; len++) {
      if (data[len].oldTag === 'old') {
        let arr = data[len]
        let copyArr = copyData[len]
        let upID = data[len].F_CHEHAO
        // let copyArr = copyData[len]
        if (checkChange(arr, copyArr, colName)) {
          updateSql = updateSql + 'update ' + tableName + ' set F_HYHG = ' + data[len].F_HYHG + ', F_XLQY = ' + '\'' + data[len].F_XLQY + '\'' +
            ' where F_CHEHAO = ' + '\'' + upID + '\'' + ';'
          log = log + propName[0] + ':' + upID + ',' + propName[5] + ':' + data[len].F_HYHG
        }
      }
    }
    sql = updateSql
    // alert(sql)
    executeSql(sql, log)
  }

  /**
   * 保存人工检查操作
   * @param tbId : num 单表id
   * @param def : obj 表定义表中配置
   * @param tableName : string 数据库表名
   * @param copyData : obj 表格更改前数据
   */
  function saveCheckAction (tbId, tableName, def, copyData) {
    let propConfGrid = tbId
    let selectedId = propConfGrid.jqGrid('getGridParam', 'selrow')
    propConfGrid.jqGrid('saveRow', selectedId)
    let updateSql = ''
    let colName = []
    let propName = []
    let log = '修改:'
    let sql
    let data = getJQAllData(tbId)
    for (let j = 1; j < def.length; j++) {
      colName.push(def[j].colName)
      propName.push(def[j].propName)
    }
    for (let len = 0; len < data.length; len++) {
      if (data[len].oldTag === 'old') {
        let arr = data[len]
        let copyArr = copyData[len]
        let upID = data[len].F_CHEHAO
        // let copyArr = copyData[len]
        if (checkChange(arr, copyArr, colName)) {
          updateSql = updateSql + 'update ' + tableName + ' set F_XLCC = ' + data[len].F_XLCC +
            ' where F_CHEHAO = ' + '\'' + upID + '\'' + ';'
          log = log + propName[0] + ':' + upID + ',' + propName[4] + ':' + data[len].F_XLCC
        }
      }
    }
    sql = updateSql
    // alert(sql)
    executeSql(sql, log)
  }

  /**
   * 保存调整环节操作
   * @param tbId : num 单表id
   * @param def : obj 表定义表中配置
   * @param copyData : obj 表格更改前数据
   */
  function adjustSaveAction (tbId, def, copyData) {
    let propConfGrid = tbId
    let selectedId = propConfGrid.jqGrid('getGridParam', 'selrow')
    propConfGrid.jqGrid('saveRow', selectedId)
    let updateSql = ''
    let colName = []
    let propName = []
    let log = '调整环节:'
    let sql
    let data = getJQAllData(tbId)
    for (let j = 1; j < def.length; j++) {
      colName.push(def[j].colName)
      propName.push(def[j].propName)
    }
    for (let len = 0; len < data.length; len++) {
      if (data[len].oldTag === 'old') {
        let arr = data[len]
        let copyArr = copyData[len]
        let upID = data[len].F_CHEHAO
        if (checkChange(arr, copyArr, colName)) {
          let currType = arr.F_TYPE
          let prevType = copyArr.F_TYPE
          switch (prevType) {
            case '20':updateSql = updateSql + 'update ti_web_zsh_rcgp set F_SYN_FLAG = 1  where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_SYN_FLAG = 0;' +
              'update ti_web_zsh_reg set F_SYN_FLAG = 0,F_TYPE = ' + '\'' + currType + '\'' + ' where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_SYN_FLAG = 0;'
              break
            case '30':updateSql = updateSql + 'update ti_web_zsh_rccy set F_SYN_FLAG = 1  where F_CHEHAO = ' + '\'' + upID + '\'' + ';' +
              'update ti_web_zsh_reg set F_SYN_FLAG = 0,F_TYPE = ' + '\'' + currType + '\'' + ' where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_SYN_FLAG = 0;'
              break
            case '40':updateSql = updateSql + 'update ti_web_zsh_rcgh set F_SYN_FLAG = 1  where F_CHEHAO = ' + '\'' + upID + '\'' + ';' +
              'update ti_web_zsh_reg set F_SYN_FLAG = 0,F_TYPE = ' + '\'' + currType + '\'' + ' where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_SYN_FLAG = 0;'
              break
            case '50':updateSql = updateSql + 'update ti_web_zsh_rchy set F_SYN_FLAG = 1  where F_CHEHAO = ' + '\'' + upID + '\'' + ';' +
              'update ti_web_zsh_reg set F_SYN_FLAG = 0,F_TYPE = ' + '\'' + currType + '\'' + ' where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_SYN_FLAG = 0;'
              break
            case '60':updateSql = updateSql + 'update ti_web_zsh_rcxl set F_SYN_FLAG = 1  where F_CHEHAO = ' + '\'' + upID + '\'' + ';' +
              'update ti_web_zsh_reg set F_SYN_FLAG = 0,F_TYPE = ' + '\'' + currType + '\'' + ' where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_SYN_FLAG = 0;'
              break
            case '70':updateSql = updateSql + 'update ti_web_zsh_rcgh set F_SYN_FLAG = 1  where F_CHEHAO = ' + '\'' + upID + '\'' + ';' +
              'update ti_web_zsh_reg set F_SYN_FLAG = 0,F_TYPE = ' + '\'' + currType + '\'' + ' where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_SYN_FLAG = 0;'
              break
            case '80':updateSql = updateSql + 'update ti_web_zsh_rccc set F_SYN_FLAG = 1  where F_CHEHAO = ' + '\'' + upID + '\'' + ';' +
              'update ti_web_zsh_reg set F_SYN_FLAG = 0,F_TYPE = ' + '\'' + currType + '\'' + ' where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_SYN_FLAG = 0;'
              break
            case '90':updateSql = updateSql + 'update ti_web_zsh_rcgh set F_SYN_FLAG = 1  where F_CHEHAO = ' + '\'' + upID + '\'' + ';' +
              'update ti_web_zsh_reg set F_SYN_FLAG = 0,F_TYPE = ' + '\'' + currType + '\'' + ' where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_SYN_FLAG = 0;'
              break
            default:break
          }
          log = log + propName[1] + ':' + upID + ',' + propName[6] + ':' + data[len].F_TYPE
        }
      }
    }
    sql = updateSql
    // alert(sql)
    executeSql(sql, log)
  }

  /**
   * 中止调整环节操作
   * @param tbId : num 单表id
   * @param def : obj 表定义表中配置
   */
  function stopAction (tbId, def) {
    let propConfGrid = tbId
    let selectedId = propConfGrid.jqGrid('getGridParam', 'selrow')
    propConfGrid.jqGrid('saveRow', selectedId)
    let updateSql = ''
    let colName = []
    let propName = []
    let log = '中止环节:'
    let sql
    let data = getJQAllData(tbId)
    for (let j = 1; j < def.length; j++) {
      colName.push(def[j].colName)
      propName.push(def[j].propName)
    }
    for (let len = 0; len < data.length; len++) {
      if (data[len].isCheck === '1') {
        let arr = data[len]
        let upID = data[len].F_CHEHAO
        let currType = arr.F_TYPE
        let currType1 = ''
        switch (currType) {
          case '0': currType1 = '排队'
            break
          case '20': currType1 = '归批'
            break
          case '30': currType1 = '采样'
            break
          case '40': currType1 = '过重'
            break
          case '50': currType1 = '化验'
            break
          case '60': currType1 = '卸料'
            break
          case '70': currType1 = '回皮'
            break
          case '80': currType1 = '出厂'
            break
          case '90': currType1 = '二次过衡'
            break
        }
        let carNo = arr.F_KAHAO
        if (window.confirm('车辆：' + upID + ',当前环节' + currType1 + ',是否中止')) {
          switch (currType) {
            case '0':updateSql = updateSql + 'delete from ti_web_zsh_rcpd where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_SYN_FLAG = 0;' +
              'update ti_web_zsh_reg set F_res0  = 2 where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_res0 = 0;' +
              'update ti_web_zsh_cardno set F_ZT = 1 where F_MM = ' + '\'' + carNo + '\''
              break
            case '20':updateSql = updateSql + 'delete from ti_web_zsh_rcgp where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_SYN_FLAG = 0;' +
              'update ti_web_zsh_reg set F_res0  = 2 where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_res0 = 0;' +
              'update ti_web_zsh_cardno set F_ZT = 1 where F_MM = ' + '\'' + carNo + '\''
              break
            case '30':updateSql = updateSql + 'delete from ti_web_zsh_rccy where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_SYN_FLAG = 0;' +
              'update ti_web_zsh_reg set F_res0  = 2 where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_res0 = 0;' +
              'update ti_web_zsh_cardno set F_ZT = 1 where F_MM = ' + '\'' + carNo + '\''
              break
            case '40':updateSql = updateSql + 'delete from ti_web_zsh_rcgh where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_SYN_FLAG = 0;' +
              'update ti_web_zsh_reg set F_res0  = 2 where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_res0 = 0;' +
              'update ti_web_zsh_cardno set F_ZT = 1 where F_MM = ' + '\'' + carNo + '\''
              break
            case '50':updateSql = updateSql + 'delete from ti_web_zsh_rchy where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_SYN_FLAG = 0;' +
              'update ti_web_zsh_reg set F_res0  = 2 where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_res0 = 0;' +
              'update ti_web_zsh_cardno set F_ZT = 1 where F_MM = ' + '\'' + carNo + '\''
              break
            case '60':updateSql = updateSql + 'delete from ti_web_zsh_rcxl where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_SYN_FLAG = 0;' +
              'update ti_web_zsh_reg set F_res0  = 2 where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_res0 = 0;' +
              'update ti_web_zsh_cardno set F_ZT = 1 where F_MM = ' + '\'' + carNo + '\''
              break
            case '70':updateSql = updateSql + 'delete from ti_web_zsh_rcgh where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_SYN_FLAG = 0;' +
              'update ti_web_zsh_reg set F_res0  = 2 where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_res0 = 0;' +
              'update ti_web_zsh_cardno set F_ZT = 1 where F_MM = ' + '\'' + carNo + '\''
              break
            case '80':updateSql = updateSql + 'delete from ti_web_zsh_rccc where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_SYN_FLAG = 0;' +
              'update ti_web_zsh_reg set F_res0  = 2 where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_res0 = 0;' +
              'update ti_web_zsh_cardno set F_ZT = 1 where F_MM = ' + '\'' + carNo + '\''
              break
            case '90':updateSql = updateSql + 'delete from ti_web_zsh_rcgh where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_SYN_FLAG = 0;' +
              'update ti_web_zsh_reg set F_res0 = 2 where F_CHEHAO = ' + '\'' + upID + '\'' + ' and F_res0 = 0;' +
              'update ti_web_zsh_cardno set F_ZT = 1 where F_MM = ' + '\'' + carNo + '\''
              break
            default:break
          }
          log = log + propName[1] + ':' + upID + ',' + propName[6] + ':' + data[len].F_TYPE
        }
      }
    }
    sql = updateSql
    // alert(sql)
    executeSql(sql, log)
  }

  /**
   * 保存单对象操作
   * @param formID : num 单对象form的id
   * @param tbName : string 数据库名
   * @param def : obj 表定义表中配置
   */
  function saveObjAction (formID, tbName, def) {
    let data = getFormData(formID)
    let insData = []
    let insCol = []
    let propName = []
    let ins = ''
    let insertSql = ''
    let updateSql = ''
    let log = '新增:'
    for (let i = 0; i < data.length; i++) {
      insCol.push(data[i].name)
      insData.push(data[i].value)
      propName.push(def[i].propName)
      let arr = data[i]
      if (checkObjLimit(arr, def)) {
        if (i < data.length - 1) {
          if (insData[i] === '') {
            ins = ins + null + ','
          } else {
            ins = ins + '\'' + insData[i] + '\'' + ','
          }
        }
        if (i === data.length - 1) {
          ins = ins + '\'' + insData[i] + '\''
        }
      } else {
        return
      }
    }
    for (let j = 0; j < propName.length - 2; j++) {
      log = log + propName[j + 1] + ':' + insData[j] + ','
    }
    insertSql = insertSql + 'insert into ' + tbName + '(' + insCol + ')' +
      ' values' + '(' + ins + ')' + ';'
    updateSql = 'update  ti_web_zsh_cardno set F_ZT = ' + '\'' + '2' + '\'' + ' where F_MM = ' + '\'' + data[8].value + '\''
    insertSql = insertSql + updateSql
    checkRegister(data, insertSql, log)
  }

  /**
   * 新增操作
   * @param formID : num 单对象form的id
   * @param tbName : string 数据库名
   * @param def : obj 表定义表中配置
   */
  function saveAddAction (formID, tbName, def) {
    let db = window.top.cjDb
    let serverInfo = cacheOpt.get('server-config')
    let reqHost = serverInfo['server']['ipAddress']
    let reqPort = serverInfo['server']['httpPort']
    let reqParam = {
      reqHost: reqHost,
      reqPort: reqPort
    }
    let data = getFormData(formID)
    let insData = []
    let insCol = []
    let propName = []
    let selectID = 'select ID from ' + tbName + ' order by ID asc'
    let ins = ''
    let insertSql = ''
    let log = '新增:'
    for (let i = 0; i < data.length; i++) {
      insCol.push(data[i].name)
      insData.push(data[i].value)
      propName.push(def[i + 1].propName)
      let arr = data[i]
      if (checkObjLimit(arr, def)) {
        if (i < data.length - 1) {
          if (insData[i] === '') {
            ins = ins + null + ','
          } else {
            ins = ins + '\'' + insData[i] + '\'' + ','
          }
        }
        if (i === data.length - 1) {
          ins = ins + '\'' + insData[i] + '\''
        }
      }
    }
    for (let j = 0; j < propName.length; j++) {
      log = log + propName[j] + ':' + insData[j] + ','
    }
    db.load(selectID, function f (e, v) {
      if (e) {
        console.log(e)
      } else {
        let maxID
        if (v.length === 0) {
          maxID = 1
        } else {
          maxID = parseInt(v[v.length - 1].ID) + 1
        }
        insertSql = insertSql + 'insert into ' + tbName + '(' + 'ID,' + insCol + ')' +
          ' values' + '(' + maxID + ',' + ins + ')' + ';'
        $('.modal', window.parent.document).hide()
        $('.modal-backdrop', window.parent.document).remove()
        executeSql(insertSql, log)
        $('#box_content iframe', window.parent.document).last()[0].src = $('#box_content iframe', window.parent.document).last()[0].src
      }
    }, reqParam)
  }

  /**
   * omc通信配置新增操作
   * @param formID : num 单对象form的id
   * @param tbName : string 数据库名
   * @param def : obj 表定义表中配置
   */
  function saveOmcCommunicationAction (formID, tbName, def) {
    let db = window.top.cjDb
    let serverInfo = cacheOpt.get('server-config')
    let reqHost = serverInfo['server']['ipAddress']
    let reqPort = serverInfo['server']['httpPort']
    let reqParam = {
      reqHost: reqHost,
      reqPort: reqPort
    }
    let data = getFormData(formID)
    let insData = []
    let insCol = []
    let propName = []
    let selectID = 'select ID from ' + tbName + ' order by ID asc'
    let ins = ''
    let insertSql = ''
    let log = '新增:'
    for (let i = 0; i < data.length; i++) {
      insCol.push(data[i].name)
      insData.push(data[i].value)
      propName.push(def[i + 1].propName)
      let arr = data[i]
      if (checkObjLimit(arr, def)) {
        if (i < data.length - 1) {
          if (insData[i] === '') {
            ins = ins + null + ','
          } else {
            ins = ins + '\'' + insData[i] + '\'' + ','
          }
        }
        if (i === data.length - 1) {
          ins = ins + '\'' + insData[i] + '\''
        }
      }
    }
    let arr = data[0].value
    let arrs = arr.split('TERM')
    let terminal = data[10].value
    for (let j = 0; j < propName.length; j++) {
      log = log + propName[j] + ':' + insData[j] + ','
    }
    db.load(selectID, function f (e, v) {
      if (e) {
        console.log(e)
      } else {
        let maxID
        if (v.length === 0) {
          maxID = 1
        } else {
          maxID = parseInt(v[v.length - 1].ID) + 1
        }
        let queryModelSql = 'select F_URI from omc_vxd_prop_m where F_PID = ' + '\'' + terminal + '\''
        insertSql = insertSql + 'insert into ' + tbName + '(' + 'ID,' + insCol + ')' +
          ' values' + '(' + maxID + ',' + ins + ');'
        db.load(queryModelSql, function (e, v) {
          if (e) {
            console.log(e)
          } else {
            for (let n = 0; n < v.length; n++) {
              let type = v[n].F_URI.split('_')
              if (v[n].F_URI !== 'TerminalId') {
                insertSql = insertSql + 'insert into omc_vxd_prop (F_ID,F_PID,F_URI,F_CLASS,F_V,F_TYPE,F_LEN,F_SYN_FLAG,F_DT_FLAG,F_ST_FLAG) ' +
                  'values(' + '\'' + arr + '_000' + Number(n + 1) + '\'' + ',' + '\'' + arr + '\'' + ',' + '\'' + v[n].F_URI + '\'' + ',' + '\'' + 'TERM' + '\'' + ',' + '\'' + arrs[0] + type[0].toUpperCase() + arrs[1] + '\'' + ',' + '\'' + 1 + '\'' + ',' + '\'' + 0 + '\'' + ',' + '\'' + 0 + '\'' + ',' + '\'' + 0 + '\'' + ',' + '\'' + 1 + '\'' +  ');'
              } else {
                insertSql = insertSql + 'insert into omc_vxd_prop (F_ID,F_PID,F_URI,F_CLASS,F_V,F_TYPE,F_LEN,F_SYN_FLAG,F_DT_FLAG,F_ST_FLAG) ' +
                  'values(' + '\'' + arr + '_000' + Number(n + 1) + '\'' + ',' + '\'' + arr + '\'' + ',' + '\'' + v[n].F_URI + '\'' + ',' + '\'' + 'TERM' + '\'' + ',' + '\'' + Number(arrs[1].substr(1)) + '\'' + ',' + '\'' + 1 + '\'' + ',' + '\'' + 0 + '\'' + ',' + '\'' + 0 + '\'' + ',' + '\'' + 0 + '\'' + ',' + '\'' + 1 + '\'' + ');'
              }
            }
            $('.modal', window.parent.document).hide()
            $('.modal-backdrop', window.parent.document).remove()
            executeSql(insertSql, log)
            $('#box_content iframe', window.parent.document).last()[0].src = $('#box_content iframe', window.parent.document).last()[0].src
          }
        }, reqParam)
      }
    }, reqParam)
  }

  /**
   * 保存系统参数单对象操作
   * @param formID : num 单对象form的id
   * @param tbName : string 数据库名
   * @param def : obj 表定义表中配置
   */
  function saveSetObjAction (formID, tbName, def) {
    let data = getFormData(formID)
    let insData = []
    let insCol = []
    let propName = []
    let ins = ''
    let insertSql = ''
    let log = '修改:'
    for (let i = 0; i < data.length; i++) {
      insCol.push(data[i].name)
      insData.push(data[i].value)
      propName.push(def[i].propName)
      let arr = data[i]
      if (checkObjLimit(arr, def)) {
        if (i < data.length - 1) {
          if (insData[i] === '') {
            ins = ins + null + ','
          } else {
            ins = ins + '\'' + insData[i] + '\'' + ','
          }
        }
        if (i === data.length - 1) {
          ins = ins + '\'' + insData[i] + '\''
        }
      }
    }
    for (let j = 0; j < propName.length; j++) {
      log = log + propName[j] + ':' + insData[j] + ','
    }
    insertSql = insertSql + 'update ' + tbName + ' set F_SCALE = ' + ins + ' where F_SETTYPE = ' + '\'' + 'scale' + '\';'
    // alert(insertSql)
    executeSql(insertSql, log)
  }

  function saveRuntimeObjAction (formID, tbName, def) {
    let data = getFormData(formID)
    let insData = []
    let insCol = []
    let propName = []
    let ins = ''
    let insertSql = ''
    let log = '修改:'
    for (let i = 0; i < data.length; i++) {
      insCol.push(data[i].name)
      insData.push(data[i].value)
      propName.push(def[i].propName)
      let arr = data[i]
      if (checkObjLimit(arr, def)) {
        if (i < data.length - 1) {
          if (insData[i] === '') {
            ins = ins + null + ','
          } else {
            ins = ins + insData[i] + ','
          }
        }
        if (i === data.length - 1) {
          ins = ins + insData[i]
        }
      }
    }
    for (let j = 0; j < propName.length; j++) {
      log = log + propName[j] + ':' + insData[j] + ','
    }
    let arr = ins.split(',')
    for (let k = 0; k < arr.length; k++) {
      if (parseInt(arr[k]) < 0 || parseInt(arr[k]) > '24') {
        alert('请输入0~24的整数！')
        return
      }
    }
    insertSql = insertSql + 'update ' + tbName + ' set F_STARTTIME = ' + arr[0] + ',' + ' F_ENDTIME = ' + arr[1] + ' where F_SETTYPE = ' + '\'' + 'runtime' + '\';'
    // alert(insertSql)
    executeSql(insertSql, log)
  }

  /**
   * 解锁操作
   * @param formID : num 单对象form的id
   * @param tbName : string 数据库名
   */
  function unLockAction (formID, tbName) {
    let arr = sessionStorage.getItem('tbName')
    let arrs = arr.split('!')
    let arrs1 = arrs[1].split(' = ')
    let data = getFormData(formID)
    let log = '解锁:'
    if (data[0].value === '') {
      alert('请输入解锁原因！')
      return
    }
    let upDateData = []
    let upDateCol = []
    let upDate = ''
    let upDateSql = ''
    for (let i = 0; i < data.length; i++) {
      log = log + '车号:' + arrs1[1] + '解锁原因:' + data[0].value
      upDateCol.push(data[i].name)
      upDateData.push(data[i].value)
      if (i < data.length - 1) {
        if (upDateData[i] === '') {
          upDate = upDate + upDateCol[i] + '=' + null + ','
        } else {
          upDate = upDate + upDateCol[i] + '=' + '\'' + upDateData[i] + '\'' + ','
        }
      }
      if (i === data.length - 1) {
        upDate = upDate + upDateCol[i] + '=' + '\'' + upDateData[i] + '\''
      }
    }
    upDateSql = upDateSql + 'update ' + tbName + ' set ' + upDate +
      ' where ' + arrs[1] + ';'
    executeSql(upDateSql, log)
  }

  /**
   * 绑卡操作
   * @param data : obj json配置文件数据
   */
  function bindCardAction (data) {
    let db = window.top.cjDb
    let serverInfo = cacheOpt.get('server-config')
    let reqHost = serverInfo['server']['ipAddress']
    let reqPort = serverInfo['server']['httpPort']
    let reqParam = {
      reqHost: reqHost,
      reqPort: reqPort
    }
    let updateStatusSql = data.updateStatusSql
    let selectStatusSql = data.selectStatusSql
    let selectCardSql = data.selectCardSql
    let cardNo
    db.load(updateStatusSql, function fn (err, vals) {
      if (err) {
        console.log(err)
      } else {
        let time = setInterval(function () {
          db.load(selectStatusSql, function fn1 (er, val) {
            if (er) {
              console.log(er)
            } else {
              if (val[0].F_SYN_FLAG === 1) {
                clearInterval(time)
                db.load(selectCardSql, function f (e, v) {
                  if (e) {
                    console.log(e)
                  } else {
                    cardNo = v[0].F_V
                    $('#F_KAHAO_input').val(cardNo)
                  }
                })
              }
            }
          }, reqParam)
        }, 1000)
      }
    }, reqParam)
  }

  /**
   * 还卡操作
   * @param formID : num 单对象form的id
   */
  function returnCardAction (formID) {
    let data = getJQAllData(formID)
    let log = '解绑'
    let selectSql = 'select F_KAHAO from ti_web_zsh_rccc where F_CHEHAO = ' + '\'' + data[0].F_CHEHAO + '\''
    let updateSql = 'update ti_web_zsh_cardno set F_ZT = ' + '\'' + '1' + '\'' + ' where F_MM = '
    let db = window.top.cjDb
    let serverInfo = cacheOpt.get('server-config')
    let reqHost = serverInfo['server']['ipAddress']
    let reqPort = serverInfo['server']['httpPort']
    let reqParam = {
      reqHost: reqHost,
      reqPort: reqPort
    }
    db.loadT(selectSql, function fn (err, val) {
      let card = val[0].F_KAHAO
      updateSql = updateSql + '\'' + card + '\'' + ';update ti_web_zsh_reg set F_res0 =' + '\'' + 1 + '\'' + 'where F_CHEHAO = ' + '\'' + data[0].F_CHEHAO + '\''
      db.loadT(updateSql, function f (e, v) {
        if (e) {
          console.log(e)
        } else {
          log = log + '卡号:' + card + ',解绑车号：' + data[0].F_CHEHAO
          recordLog(log)
          alert('还卡成功!')
        }
      }, reqParam)
    }, reqParam)
  }

  /**
   * 弹框操作
   * @param g : string 全局对象
   * @param data : obj json配置文件数据
   * @param tbID : num 单表id
   */
  function modalAction (g, data, tbID) {
    let config = data.modal
    let arr = config[0].url
    let arrs = []
    arrs = arr.split('?')
    if (config[0].filter !== undefined) {
      let filter = config[0].filter
      let selectedId = tbID.jqGrid('getGridParam', 'selrow')
      tbID.jqGrid('saveRow', selectedId)
      let sel = tbID.jqGrid('getCell', selectedId, filter)
      if (sel === undefined) {
        alert('请选择一行数据！')
        return
      }
      arrs[1] = arrs[1] + '!' + filter + ' = ' + '\'' + sel + '\''
    }
    sessionStorage.setItem('tbName', arrs[1])
    g.iframe({
      title: config[0].title,
      ajaxWindow: false,
      show: true,
      // backdrop: true,
      type: 'iframe', // iframe / html / alert / confirm
      width: 1200,
      height: 400,
      footerButtonAlign: 'right',
      url: g.url(arr)
    })
  }

  /**
   * 归批弹框操作
   * @param g : string 全局对象
   * @param data : obj json配置文件数据
   * @param tbID : num 单表id
   */
  function mergeModalAction (g, data, tbID) {
    let db = window.top.cjDb
    let serverInfo = cacheOpt.get('server-config')
    let reqHost = serverInfo['server']['ipAddress']
    let reqPort = serverInfo['server']['httpPort']
    let reqParam = {
      reqHost: reqHost,
      reqPort: reqPort
    }
    let selectBlack = 'select F_CHEHAO from ti_web_zsh_blank'
    let selectedId = tbID.jqGrid('getGridParam', 'selrow')
    tbID.jqGrid('saveRow', selectedId)
    let config = data.modal
    let arr = config[0].url
    let arrs = []
    arrs = arr.split('?')
    if (config[0].filter !== undefined) {
      let filter = config[0].filter
      let selectedId = tbID.jqGrid('getGridParam', 'selrow')
      tbID.jqGrid('saveRow', selectedId)
      let sel = tbID.jqGrid('getCell', selectedId, filter)
      if (sel === undefined) {
        alert('请选择一行数据！')
        return
      }
      arrs[1] = arrs[1] + '!' + filter + ' = ' + '\'' + sel + '\''
    }
    sessionStorage.setItem('tbName', arrs[1])
    // let mergeData = []
    let str = ''
    let records = tbID.jqGrid('getRowData')
    let flag = 0
    db.load(selectBlack, function fn (e, v) {
      if (e) {
        console.log(e)
      } else {
        for (let i = 0; i < records.length; i++) {
          if (records[i].isCheck === '1') {
            for (let j = 0; j < v.length; j++) {
              if (records[i].F_CHEHAO === v[j].F_CHEHAO) {
                window.alert('车辆' + records[i].F_CHEHAO + '在黑名单！')
                flag = 0
                return
              }
            }
            if (records[i].F_SFGP === '1') {
              window.alert('第' + records[i].rowID + '行已归批！')
            } else {
              flag = 1
              str = str + JSON.stringify(records[i]) + '!'
              sessionStorage.setItem('merge', str)
            }
          }
        }
        if (flag === 1) {
          g.iframe({
            title: config[0].title,
            ajaxWindow: false,
            show: true,
            // backdrop: true,
            type: 'iframe', // iframe / html / alert / confirm
            width: 1200,
            height: 400,
            footerButtonAlign: 'right',
            button: {text: '确定',
              callback: function () {
                this.close()
              }},
            url: g.url(arr)
          })
        } else {
          window.alert('请选择未归批数据！')
        }
      }
    }, reqParam)
  }

  /**
   * 归批操作
   * @param tbID : num 单表id
   * @param tbName : string 数据库名
   */
  function mergeAction (tbID, tbName) {
    let selectedId = tbID.jqGrid('getGridParam', 'selrow')
    tbID.jqGrid('saveRow', selectedId)
    let data = getJQAllData(tbID)
    let updateSql = ''
    let maxNum
    let log = '归批,'
    let no = '3' // 流水号位数
    let code
    let date = utils.time.getDate('none')
    let sql = 'select F_PICI,F_WUZHI from ' + tbName + ' where F_WUZHI = ' + '\'' + data[0].F_WUZHI + '\'' + ' and F_PICI like ' + '\'' + '%' + date + '%' + '\'' + ' order by F_PICI asc'
    let db = window.top.cjDb
    let serverInfo = cacheOpt.get('server-config')
    let reqHost = serverInfo['server']['ipAddress']
    let reqPort = serverInfo['server']['httpPort']
    let reqParam = {
      reqHost: reqHost,
      reqPort: reqPort
    }
    db.load(sql, function fn (err, vals) {
      if (err) {
        console.log(err)
      } else {
        let maxDbNum = vals[vals.length - 1]
        if (maxDbNum === undefined || maxDbNum['F_PICI'] === null || maxDbNum['F_PICI'] === '') {
          maxDbNum = 0
        } else {
          maxDbNum = maxDbNum['F_PICI'].substr(maxDbNum['F_PICI'].length - Number(no))
        }
        maxNum = Number(maxDbNum) + 1
        if (maxNum.toString().length !== Number(no)) {
          let len = Number(no) - maxNum.toString().length
          for (let k = 0; k < len; k++) {
            maxNum = '0' + maxNum
          }
          // maxNum.toString().padStart(len, '0')
        }
        if (data[0].F_WUZHI === '兰炭') {
          code = 'L' + date + maxNum
        }
        if (data[0].F_WUZHI === '石灰石') {
          code = 'S' + date + maxNum
        }
        log = log + '批次号:' + code + ',归批车号:'
        for (let i = 0; i < data.length; i++) {
          updateSql = updateSql + 'update ' + tbName + ' set F_SFCY = ' + data[i].F_SFCY +
            ',F_PICI = ' + '\'' + code + '\'' + ',F_SFGP = 1 where ID = ' + data[i].ID + ';'
          log = log + data[i].F_CHEHAO + ','
        }
        db.load(updateSql, function f (e, v) {
          if (e) {
            console.log(e)
          } else {
            sessionStorage.setItem('tbName', 'merge_sampling')
            alert('归批成功')
            $('.modal', window.parent.document).hide()
            $('.modal-backdrop', window.parent.document).remove()
            $('#box_content iframe', window.parent.document).last()[0].contentWindow.location.reload(true)
          }
        }, reqParam)
      }
    }, reqParam)
  }

  /**
   * 导出csv操作(暂不支持)
   * @param tbID : num 单表id
   */
  function exportToCsv (tbID) {
    tbID.jqGrid('exportToCsv', {
      separator: ',',
      separatorReplace: '', // in order to interpret numbers
      quote: '"',
      escquote: '"',
      newLine: '\r\n', // navigator.userAgent.match(/Windows/) ?	'\r\n' : '\n';
      replaceNewLine: ' ',
      includeCaption: true,
      includeLabels: true,
      includeGroupHeader: true,
      includeFooter: true,
      fileName: 'jqGridExport.csv',
      returnAsString: false
    })
    let log = '导出数据'
    recordLog(log)
  }

  /**
   * 上移操作
   * @param tbID : num 单表id
   * @param tbName : string 数据库名
   * @param limit : obj 调整限值
   */
  function upAction (tbID, tbName, limit) {
    let log = ''
    let selectedId = tbID.jqGrid('getGridParam', 'selrow')
    tbID.jqGrid('saveRow', selectedId)
    let ids = tbID.jqGrid('getDataIDs')
    let rowIDs = []
    let maxRowId
    let data = tbID.jqGrid('getRowData')
    let adjust = limit.adjustLimit
    if (adjust !== undefined) {
      let arrs = adjust.split('=')
      for (let i = 0; i < data.length; i++) {
        if (data[i][arrs[0]] !== arrs[1]) {
          if (selectedId === ids[i]) {
            window.alert('该行不能移动！')
            return
          }
          rowIDs.push(ids[i])
        }
      }
      maxRowId = Math.max.apply(Math, rowIDs) + 1
    }
    let $tr = $('.select')
    if ($tr.index() !== maxRowId) {
      $tr.fadeOut().fadeIn()
      $tr.prev().before($tr)
      let id = []
      let maxId
      for (let i = 0; i < data.length; i++) {
        id.push(Number(data[i].ID))
      }
      let currRowData = tbID.jqGrid('getRowData', selectedId)
      let prevRowData = tbID.jqGrid('getRowData', selectedId - 1)
      let currId = currRowData.ID
      if (currId === undefined) {
        alert('请选择一行数据！')
        return
      }
      let prevId = prevRowData.ID
      // 获取最大ID
      maxId = -1
      log = '上移车号:' + currRowData.F_CHEHAO
      let sql = 'update ' + '`' + tbName + '`' + ' set ID = ' + maxId + ' where ID = ' + prevId + ';' +
        'update ' + '`' + tbName + '`' + ' set ID = ' + prevId + ' where ID = ' + currId + ';' +
        'update ' + '`' + tbName + '`' + ' set ID = ' + currId + ' where ID = ' + maxId + ';'
      executeSql(sql, log)
    }
  }

  /**
   * 下移操作
   * @param tbID : num 单表id
   * @param tbName : string 数据库名
   * @param limit : obj 调整限值
   */
  function downAction (tbID, tbName, limit) {
    let log
    let selectedId = tbID.jqGrid('getGridParam', 'selrow')
    tbID.jqGrid('saveRow', selectedId)
    let ids = tbID.jqGrid('getDataIDs')
    let data = tbID.jqGrid('getRowData')
    let adjust = limit.adjustLimit
    if (adjust !== undefined) {
      let arrs = adjust.split('=')
      for (let i = 0; i < data.length; i++) {
        if (data[i][arrs[0]] !== arrs[1]) {
          if (selectedId === ids[i]) {
            window.alert('该行不能移动！')
            return
          }
        }
      }
    }
    let $down = $('.ui-row-ltr')
    let len = $down.length
    let $tr = $('.select')
    if ($tr.index() !== len) {
      $tr.fadeOut().fadeIn()
      $tr.next().after($tr)

      let id = []
      let maxId
      let data = tbID.jqGrid('getRowData')
      for (let i = 0; i < data.length; i++) {
        id.push(Number(data[i].ID))
      }
      let currRowData = tbID.jqGrid('getRowData', selectedId)
      let nextRowData = tbID.jqGrid('getRowData', Number(selectedId) + 1)
      let currId = currRowData.ID
      if (currId === undefined) {
        alert('请选择一行数据！')
        return
      }
      let nextId = nextRowData.ID
      // 获取最大ID
      maxId = -1
      log = '下移车号:' + currRowData.F_CHEHAO
      let sql = 'update ' + '`' + tbName + '`' + ' set ID = ' + maxId + ' where ID = ' + nextId + ';' +
        'update ' + '`' + tbName + '`' + ' set ID = ' + nextId + ' where ID = ' + currId + ';' +
        'update ' + '`' + tbName + '`' + ' set ID = ' + currId + ' where ID = ' + maxId + ';'
      executeSql(sql, log)
    }
  }

  /**
   * 置顶操作
   * @param tbID : num 单表id
   * @param tbName : string 数据库名
   * @param limit : obj 调整限值
   */
  function foremostAction (tbID, tbName, limit) {
    let log = ''
    let selectedId = tbID.jqGrid('getGridParam', 'selrow')
    tbID.jqGrid('saveRow', selectedId)
    let ids = tbID.jqGrid('getDataIDs')
    let sql
    let rowIDs = []
    let maxRowId
    let data = tbID.jqGrid('getRowData')
    let adjust = limit.adjustLimit
    if (adjust !== undefined) {
      let arrs = adjust.split('=')
      for (let i = 0; i < data.length; i++) {
        if (data[i][arrs[0]] !== arrs[1]) {
          rowIDs.push(ids[i])
        }
      }
      if (rowIDs.length === 0) {
        let $tr = $('.select')
        $tr.fadeOut().fadeIn()
        $('.jqgfirstrow').after($tr)
        let id = []
        let maxId
        // let data = tbID.jqGrid('getRowData')
        for (let i = 0; i < data.length; i++) {
          id.push(Number(data[i].ID))
        }
        let currRowData = tbID.jqGrid('getRowData', selectedId)
        let currId = currRowData.ID
        if (currId === undefined) {
          alert('请选择一行数据！')
          return
        }
        log = '置顶车号:' + currRowData.F_CHEHAO
        // 获取最大ID
        maxId = -1
        sql = 'update ' + '`' + tbName + '`' + ' set ID = ' + maxId + ' where ID = ' + currId + ';'
        for (let i = 0; i < currId - 1; i++) {
          sql = sql + 'update ' + '`' + tbName + '`' + ' set ID = ' + (currId - i) + ' where ID = ' + (currId - i - 1) + ';'
        }
        sql = sql + 'update ' + '`' + tbName + '`' + ' set ID = ' + 1 + ' where ID = ' + maxId + ';'
      } else {
        maxRowId = Math.max.apply(Math, rowIDs)
        let $tr = $('.select')
        $tr.fadeOut().fadeIn()
        $('#' + maxRowId).after($tr)
        let id = []
        let maxId
        for (let i = 0; i < data.length; i++) {
          id.push(Number(data[i].ID))
        }
        let currRowData = tbID.jqGrid('getRowData', selectedId)
        let foremostRowData = tbID.jqGrid('getRowData', maxRowId + 1)
        let currId = currRowData.ID
        let foremostId = foremostRowData.ID
        if (currId === undefined) {
          alert('请选择一行数据！')
          return
        }
        log = '置顶车号:' + currRowData.F_CHEHAO
        // 获取最大ID
        maxId = -1
        sql = 'update ' + '`' + tbName + '`' + ' set ID = ' + maxId + ' where ID = ' + currId + ';'
        for (let i = 0; i < currId - foremostId; i++) {
          sql = sql + 'update ' + '`' + tbName + '`' + ' set ID = ' + (currId - i) + ' where ID = ' + (currId - i - 1) + ';'
        }
        sql = sql + 'update ' + '`' + tbName + '`' + ' set ID = ' + foremostId + ' where ID = ' + maxId + ';'
      }
    } else {
      let $tr = $('.select')
      $tr.fadeOut().fadeIn()
      $('.jqgfirstrow').after($tr)
      let id = []
      let maxId
      // let data = tbID.jqGrid('getRowData')
      for (let i = 0; i < data.length; i++) {
        id.push(Number(data[i].ID))
      }
      let currRowData = tbID.jqGrid('getRowData', selectedId)
      let currId = currRowData.ID
      if (currId === undefined) {
        alert('请选择一行数据！')
        return
      }
      log = '置顶车号:' + currRowData.F_CHEHAO
      // 获取最大ID
      maxId = -1
      sql = 'update ' + '`' + tbName + '`' + ' set ID = ' + maxId + ' where ID = ' + currId + ';'
      for (let i = 0; i < currId - 1; i++) {
        sql = sql + 'update ' + '`' + tbName + '`' + ' set ID = ' + (currId - i) + ' where ID = ' + (currId - i - 1) + ';'
      }
      sql = sql + 'update ' + '`' + tbName + '`' + ' set ID = ' + 1 + ' where ID = ' + maxId + ';'
    }
    // alert(sql)
    executeSql(sql, log)
  }

  /* 获取表中所有数据 */
  function getJQAllData (tbID) {
    let o = tbID
    // 获取当前显示的数据
    // let allData = o.jqGrid('getRowData')
    let rowNum = o.jqGrid('getGridParam', 'rowNum') // 获取显示配置记录数量
    let total = o.jqGrid('getGridParam', 'records') // 获取查询得到的总记录数量
    // 设置rowNum为总记录数量并且刷新jqGrid，使所有记录现出来调用getRowData方法才能获取到所有数据
    o.jqGrid('setGridParam', { rowNum: total, page: 1 }).trigger('reloadGrid')
    let rows = o.jqGrid('getRowData')  // 此时获取表格所有匹配的
    o.jqGrid('setGridParam', { rowNum: rowNum }).trigger('reloadGrid') // 还原原来显示的记录数量
    return rows
  }
  // *获取form数据 */
  function getFormData (id) {
    return $('#' + id).serializeArray()
  }

  function checkChange (arr, copyData, colName) {
    let flag = false
    for (let i = 0; i < colName.length; i++) {
      if (arr[colName[i]] !== copyData[colName[i]]) {
        flag = true
      }
    }
    return flag
  }

  function checkLimit (arr, def, copyData, rowID) {
    let flag = true
    for (let i = 0; i < def.length; i++) {
      if (def[i].required === 0) {
        if (arr[def[i].colName] === '') {
          window.alert(def[i].propName + '不能为空！')
          flag = false
          return flag
        }
      }
      if (def[i].unique === 1) {
        for (let j = 0; j < copyData.length; j++) {
          if (j !== rowID) {
            if (arr[def[i].colName] === copyData[j][def[i].colName]) {
              window.alert(def[i].propName + '不能重复！')
              flag = false
              return flag
            }
          }
        }
      }
    }
    return flag
  }

  function checkObjLimit (arr, def) {
    let flag = true
    for (let i = 0; i < def.length; i++) {
      if (def[i].colName === arr.name) {
        if (def[i].required === 0) {
          if (arr.value === '') {
            window.alert(def[i].propName + '不能为空！')
            flag = false
            return flag
          }
          if (def[i].unique === 0) {

          }
        }
      }
    }
    return flag
  }

  function recordLog (log) {
    let db = window.top.cjDb
    let serverInfo = cacheOpt.get('server-config')
    let reqHost = serverInfo['server']['ipAddress']
    let reqPort = serverInfo['server']['httpPort']
    let reqParam = {
      reqHost: reqHost,
      reqPort: reqPort
    }
    let menuName = sessionStorage.getItem('menuName')
    let time = utils.time.locale2Utc(utils.time.getDateTime('/'))
    let sql = 'insert into ti_log_web(F_T,F_USER,F_V) values(' + time + ',' + '\'' + sessionStorage.getItem('s_user') + '\'' +
      ',' + '\'' + '操作菜单:' + menuName + ',操作:' + log + '\'' + ')'
    db.loadT(sql, function fn (err, vals) {
      if (err) {
        console.log(err)
      } else {

      }
    }, reqParam)
  }

  function updateRegister (data, mysql, log) {
    let db = window.top.cjDb
    let serverInfo = cacheOpt.get('server-config')
    let reqHost = serverInfo['server']['ipAddress']
    let reqPort = serverInfo['server']['httpPort']
    let reqParam = {
      reqHost: reqHost,
      reqPort: reqPort
    }
    let flag = 1
    let querySql = 'select ID from ti_web_zsh_register where F_CHEHAO = ' + '\'' + data[0].value + '\''
    db.load(querySql, function fn (err, vals) {
      let updateSql = ''
      let insertSql = ''
      if (vals.length > 0) {
        for (let j = 1; j < 7; j++) {
          updateSql = updateSql + data[j].name + ' = ' + '\'' + data[j].value + '\'' + ','
        }
        updateSql = updateSql + data[7].name + ' = ' + '\'' + data[8].value + '\''
        updateSql = 'update ti_web_zsh_register set ' + updateSql + ' where F_CHEHAO = ' + '\'' + data[0].value + '\''
      } else {
        let col = ''
        let colData = ''
        for (let k = 1; k < 8; k++) {
          col = col + data[k].name + ','
          colData = colData + '\'' + data[k].value + '\'' + ','
        }
        insertSql = 'insert into ti_web_zsh_register(F_CHEHAO,' + col + 'F_CLASS) values(' + '\'' + data[0].value + '\'' + ',' + colData + '\'' + '0' + '\'' + ')'
      }
      let sql = insertSql + updateSql
      db.load(sql, function f (e, v) {
        if (e) {
          console.log(e)
        } else {
          executeSql(mysql, log)
          $('.modal', window.parent.document).hide()
          $('.modal-backdrop', window.parent.document).remove()
          $('#box_content iframe', window.parent.document).last()[0].contentWindow.location.reload(true)
        }
      }, reqParam)
    }, reqParam)
  }

  function checkRegister (data, sql, log) {
    let db = window.top.cjDb
    let serverInfo = cacheOpt.get('server-config')
    let reqHost = serverInfo['server']['ipAddress']
    let reqPort = serverInfo['server']['httpPort']
    let reqParam = {
      reqHost: reqHost,
      reqPort: reqPort
    }
    let flag = 0
    let cardNo = ''
    let carNo = ''
    for (let i = 0; i < data.length; i++) {
      if (data[i].name === 'F_KAHAO') {
        cardNo = data[i].value
      }
      if (data[i].name === 'F_CHEHAO') {
        carNo = data[i].value
      }
    }

    let selectCardSql = 'select F_ZT from ti_web_zsh_cardno where F_MM = ' + '\'' + cardNo + '\'' + ';'
    let selectCarSql = 'select F_res0 from ti_web_zsh_reg where F_CHEHAO = ' + '\'' + carNo + '\'' + ';'
    db.load(selectCardSql, function fn (e, v) {
      if (e) {
        console.log(e)
      } else {
        if (v.length === 0) {
          alert('不存在该卡信息，请先登记该卡信息！')
          flag = 1
          return flag
        } else {
          if (v[0].F_ZT !== '1') {
            alert('该卡未处于空闲状态或状态异常，请先解绑！')
            flag = 1
            return flag
          } else {
            db.load(selectCarSql, function f (err, val) {
              if (err) {
                console.log(err)
              } else {
                if (val.length !== 0) {
                  for (let i = 0; i < val.length; i++) {
                    if (val[i].F_res0 === '0') {
                      alert('该车号还未出厂！')
                      flag = 1
                      return flag
                    }
                  }
                }
                sessionStorage.setItem('tbName', 'car_in-out')
                updateRegister(data, sql, log)
              }
            }, reqParam)
          }
        }
      }
    }, reqParam)
  }

  function executeSql (sql, log) {
    let db = window.top.cjDb
    let serverInfo = cacheOpt.get('server-config')
    let reqHost = serverInfo['server']['ipAddress']
    let reqPort = serverInfo['server']['httpPort']
    let reqParam = {
      reqHost: reqHost,
      reqPort: reqPort
    }
    db.loadT(sql, function fn (err, vals) {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          alert('数据重复，请重新添加')
        }
        console.log(err)
      } else {
        // recordLog(log)
        // alert('保存成功！')
        window.location.reload()
      }
    }, reqParam)
  }

  async function loadSql (sql) {
    let db = window.top.cjDb
    let serverInfo = cacheOpt.get('server-config')
    let reqHost = serverInfo['server']['ipAddress']
    let reqPort = serverInfo['server']['httpPort']
    let reqParam = {
      reqHost: reqHost,
      reqPort: reqPort
    }
    return new Promise(function (resolve, reject) {
      db.load(sql, (e, v) => {
        resolve(v)
      }, reqParam)
    })
  }

  function testSql () {
    let db = window.top.cjDb
    let serverInfo = cacheOpt.get('server-config')
    let reqHost = serverInfo['server']['ipAddress']
    let reqPort = serverInfo['server']['httpPort']
    let reqParam = {
      reqHost: reqHost,
      reqPort: reqPort
    }
    let sql = ''
    // let string = randomString(10)
    // let double = Math.random() * 9999999
    // let int = Math.floor(Math.random() * 9999999)
    for (let i = 0; i < 10000; i++) {
      sql = sql + 'insert into test2(ColStr,ColDouble,ColInt) values(' + '\'' + randomString(10) + '\'' +
        ',' + Math.random() * 9999999 + ',' + Math.floor(Math.random() * 9999999) + ');'
    }
    db.loadT(sql, function fn (err, vals) {
      if (err) {
        console.log(err)
      } else {
        alert('ok')
      }
    }, reqParam)
  }

  function randomString (len) {
    len = len || 32
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'    /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let maxPos = $chars.length
    let pwd = ''
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
  }
})
