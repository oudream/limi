/**
 * Created by nielei on 2017/10/24.
 */

'use strict'

define(['jquery', 'async', 'global', 'jqGrid', 'ztree', 'cjcommon', 'cjstorage', 'cjdatabaseaccess', 'cjajax', 'loadNode', 'structure', 'model', 'view', 'controller', 'utils', 'cache', 'jqGridExtension'], function ($, async, g) {
  let gDb = null
  let gReqParam = null
  let action = {
    init: function () {
      let db = window.top.cjDb
      gDb = db
      initJgGrid()
      uiResizeListener()
      let serverInfo = cacheOpt.get('server-config')
      let reqHost = serverInfo['server']['ipAddress']
      let reqPort = serverInfo['server']['httpPort']
      let reqParam = {
        reqHost: reqHost,
        reqPort: reqPort
      }
      gReqParam = reqParam
      loadUserDataInTable()
    }
  }
  function initJgGrid () {
    var lastsel
    var data = [
    ]
    $('#tbList').jqGrid({
      datatype: 'local', // 本地加载模式
      data: data,
      width: 'auto',
      height: 'auto',
      autowidth: true,
      rownumbers: true, // 序号
      shrinkToFit: true,
      colNames: [
        'newTag', 'oldTag', '序号', '账号', '密码',
        '用户名',
        '选中'
      ],
      colModel: [
        {name: 'newTag', hidden: true},
        {name: 'oldTag', hidden: true},
        {name: 'ID', hidden: true},
        {name: 'UserName', width: 100, editable: true},
        {name: 'PassWord', width: 100, editable: true},
        {name: 'Name', width: 100, editable: true},
        {name: 'isCheck', hidden: true}
      ],
      // rowNum : 10,
      rowList: [ 5, 12, 24 ],
      pager: '#pager',
      // pginput: false,
      sortname: 'id',
      // loadonce: true,
      // mtype : "get",
      viewrecords: true,
      multiselect: false,
      multiboxonly: false,
      sortorder: 'desc',
      rowNum: 10,
      onSelectRow: function (id) {
        if (id && id !== lastsel) {
          $('#tbList').jqGrid('saveRow', lastsel)
          $('#tbList').jqGrid('editRow', id, true)
          lastsel = id
        }
        let oldRow = {}
        oldRow.oldTag = 'old'
        $('#tbList').jqGrid('setRowData', id, oldRow)
      }
    })
  }
  function loadUserDataInTable () {
    let jqGridTable = $('#tbList')
    let copyData = null
    if (jqGridTable.jqGrid) {
      jqGridTable.jqGrid('clearGridData', false)
    }
    let recordCountSpan = $('#data_record_count_span')
    let colModel = [
      'UserName',
      'PassWord', 'Name'
    ]

    let sql = 'SELECT * FROM omc_sys_user;'
    gDb.load(sql, function fn (err, vals) {
      if (err) {
        console.log(err)
        throw err
      }

      let recordLength = vals.length
      for (let i = 0; i < recordLength; i++) {
        let aGroup = vals[i]
        jqGridTable.jqGrid('addRowData', i + 1, aGroup)
      }
      copyData = jqGridTable.jqGrid('getRowData')
      recordCountSpan.text('共' + recordLength.toString() + '条记录')
    }, gReqParam)
    let newBtn = $('#addBtn')
    newBtn.unbind('click')
    newBtn.click(function () {
      newFunc()
    })

    let delBtn = $('#delBtn')
    delBtn.unbind('click')
    delBtn.click(function () {
      if (window.confirm('确定删除？')) {
        delFunc()
      }
    })

    let saveBtn = $('#saveBtn')
    saveBtn.unbind('click')
    saveBtn.click(function () {
      saveFunc(colModel, copyData)
    })
  }

  function newFunc (evt) {
    let newRow = {
    }

    let propConfGrid = $('#tbList')
    let sRowIds = propConfGrid.jqGrid('getDataIDs')

    let rowIds = []
    for (let i = 0; i < sRowIds.length; i++) {
      rowIds.push(parseInt(sRowIds[i], 10))
    }

    let newRowId = utils.number.getVaildIndex(rowIds)
    newRow.newTag = 'new'
    propConfGrid.jqGrid('addRowData', newRowId, newRow)
  }

  function delFunc () {
    let propConfGrid = $('#tbList')
    let selectedId = propConfGrid.jqGrid('getGridParam', 'selrow')
    let view = Controller.getView('tbList')
    let col = 'ID'
    let del = propConfGrid.jqGrid('getCell', selectedId, col)

    let deleteSql = 'DELETE FROM omc_sys_user WHERE ID = ' + '\'' + del + '\''
    gDb.load(deleteSql, function (err, vals) {
      if (err) {
        console.log(err)
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
          alert('删除失败！请先将该用户移除所有用户组！')
        }
        window.location.reload()
      } else {
        if (selectedId) {
          propConfGrid.jqGrid('delRowData', selectedId)
        }
        alert('删除成功！')
      }
    }, gReqParam)
  }

  function saveFunc (columnNames, copyData) {
    let propConfGrid = $('#tbList')
    let selectedId = propConfGrid.jqGrid('getGridParam', 'selrow')
    propConfGrid.jqGrid('saveRow', selectedId)
    let updateSql
    let insertSql
    let maxId
    let id = []
    let updateTag = -1
    let data = getJQAllData()
        // 获取最大ID
    for (let i = 0; i < data.length; i++) {
      id.push(Number(data[i].ID))
    }
    maxId = Math.max.apply(Math, id) + 1

    for (let len = 0; len < data.length; len++) {
      if (data[len].newTag === 'new') {
        let arr = data[len]
        let insData = []
        let ins = ''
        for (let i = 0; i < columnNames.length; i++) {
          insData.push(arr[columnNames[i]])
          if (i < columnNames.length - 1) {
            if (insData[i] === '') {
              alert(columnNames[i] + '列不能为空！')
              break
            } else {
              ins = ins + '\'' + insData[i] + '\'' + ','
            }
          }
          if (i === columnNames.length - 1) {
            if (insData[i] === '') {
              alert(columnNames[i] + '列不能为空！')
              break
            } else {
              ins = ins + '\'' + insData[i] + '\''
            }
          }
        }
        insertSql = 'insert into omc_sys_user' + '(' + 'ID,' + columnNames + ')' +
                    ' values' + '(' + maxId + ',' + ins + ')' + ';'
        maxId = maxId + 1
        gDb.load(insertSql, function (err, vals) {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              alert('已存在该账户！')
            }
            if (len === data.length - 1) {
              alert('保存失败！')
            }
            console.log(err)
            throw err
          } else {
            insertSql = ''
            let tag = {}
            tag.newTag = ''
            tag.oldTag = ''
            $('#tbList').jqGrid('setRowData', len + 1, tag)
            copyData.push(data[len])
            if (len === data.length - 1) {
              alert('保存成功！')
              window.location.reload()
            }
          }
        }, gReqParam)
      } else if (data[len].oldTag === 'old') {
        let arr = data[len]
        let upID = data[len].ID
        let copyArr = copyData[len]
        let upDate = []
        let upD = ''
        if (checkData(arr, copyArr)) {
          for (let i = 0; i < columnNames.length; i++) {
            upDate.push(arr[columnNames[i]])
            if (i < columnNames.length - 1) {
              if (upDate[i] === '') {
                upD = upD + columnNames[i] + '=' + null + ','
              } else {
                upD = upD + columnNames[i] + '=' + '\'' + upDate[i] + '\'' + ','
              }
            }
            if (i === columnNames.length - 1) {
              upD = upD + columnNames[i] + '=' + '\'' + upDate[i] + '\''
            }
          }
          updateSql = 'update omc_sys_user set ' + upD +
                        ' where ID = ' + upID + ';'
          gDb.load(updateSql, function (err, vals) {
            if (err) {
              updateTag = 0
              if (err.code === 'ER_DUP_ENTRY') {
                alert('已存在该账户,保存失败！')
              }
            } else {
              updateSql = ''
              let tag = {}
              tag.newTag = ''
              tag.oldTag = ''
              $('#tbList').jqGrid('setRowData', len + 1, tag)
              for (let n = len + 1; n < data.length; n++) {
                if (data[n].oldTag === 'old') {
                  break
                } else if (n === data.length - 1) {
                  updateTag = 1
                }
              }
              if (len + 1 === data.length) {
                updateTag = 1
              }
              if (updateTag === 1) {
                alert('保存成功！')
              }
              document.location.reload()
            }
          }, gReqParam)
        }
      }
    }
  }

    /* 获取表中所有数据 */
  function getJQAllData () {
    let o = $('#tbList')
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

  function checkData (data, copyData) {
    if (data.ID === copyData.ID && data.UserName === copyData.UserName &&
            data.PassWord === copyData.PassWord && data.Name === copyData.Name) {
      return false
    } else {
      return true
    }
  }

  function uiResizeListener () {
    $(document).on('window-resize', function fn (evt) {
      {
        let tableId = 'tbList'
        let parentBox = $('#gbox_' + tableId).parent()
        let gridBox = $('#' + tableId)
        gridBox.setGridWidth(parentBox.innerWidth() - 2)
        let height = parentBox.innerHeight() -
                    $('#gbox_' + tableId + ' .ui-jqgrid-hdiv').outerHeight() -
                    $('#pager').outerHeight() -
                    $('.toolbar').outerHeight() -
                    2
        gridBox.setGridHeight(height)
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
      action.init()
    }
  }
})
