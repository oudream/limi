/**
 * Created by nielei on 2017/10/25.
 */

'use strict'

define(['jquery', 'async', 'global', 'jqGrid', 'ztree', 'cjcommon', 'cjstorage', 'cjdatabaseaccess', 'cjajax', 'loadNode', 'structure', 'model', 'view', 'controller', 'utils', 'cache', 'jqGridExtension'], function ($, async, g) {
  let gDb = null
  let gReqParam = null

  let mainDBCol = ['GroupName']
  let mainDBName = '`omc_sys_group`'

  let tbList = $('#tbList')
  let tbListC = $('#tbList_c')
  let copyData = null

  let mainColNames = [
    'newTag', 'oldTag', '序号', '组名'
  ] // newTag,OldTag为增加，修改标记，其余为表名
  let childColName = [
    '序号', '账号', '用户名'
  ]
  let childColModel = [
      {name: 'ID', hidden: true},
      {name: 'UserName', width: 100},
      {name: 'Name', width: 100}
  ]
  let mainColModel = [
      {name: 'newTag', hidden: true},
      {name: 'oldTag', hidden: true},
      {name: 'ID', hidden: true},
      {name: 'GroupName', width: 100, editable: true}
  ] // newTag,OldTag为增加，修改标记，其余为数据库字段名，根据jqGrid文档配置相关属性

  let loadMainSql = 'SELECT omc_sys_group.ID,omc_sys_group.GroupName FROM `omc_sys_group` order by GroupName;'
  let delGroupSql = 'DELETE FROM `omc_sys_group` WHERE ID = '
  let delUserGroupSql = 'DELETE FROM omc_sys_user_group WHERE UID = '
  let delUserGroupSql1 = ' and GID = '

  let action = {
    init: function () {
      gDb = window.top.cjDb
      let serverInfo = cacheOpt.get('server-config')
      let reqHost = serverInfo['server']['ipAddress']
      let reqPort = serverInfo['server']['httpPort']
      gReqParam = {
        reqHost: reqHost,
        reqPort: reqPort
      }
      mainTableInit(tbList, mainColNames, mainColModel)
      childTableInit(tbListC, childColName, childColModel)
      uiResizeListener()
      loadTBData(loadMainSql, tbList)
      addMainButton(tbList)
      // addChildButton(tbListC)
    }
  }

  function mainTableInit (tbID, colNames, colModel) {
    let lastsel
    tbID.jqGrid({
      datatype: 'local', // 本地加载模式
      // data: data,
      width: 'auto',
      height: 'auto',
      autowidth: true,
      rownumbers: true, // 序号
      shrinkToFit: true,
          // caption: '用户组',
      colNames: colNames,
      colModel: colModel,
          // rowNum : 10,
          // rowList: [ 5, 12, 24 ],
      pager: '#pager',
      pginput: false,
      pgbuttons: false,
      sortname: 'id',
          // loadonce: true,
          // mtype : "get",
      viewrecords: false,
      multiselect: false,
      sortorder: 'desc',
      onSelectRow: function (id) {
        if (id && id !== lastsel) {
          tbID.jqGrid('saveRow', lastsel)
          tbID.jqGrid('editRow', id, true)
          lastsel = id
        }
        let oldRow = {}
        oldRow.oldTag = 'old'
        tbID.jqGrid('setRowData', id, oldRow)
        let ID = tbID.jqGrid('getRowData', id).ID
        let loadChildSql = 'SELECT omc_sys_user.ID,omc_sys_user.UserName,omc_sys_user.Name from omc_sys_user,`omc_sys_group`,omc_sys_user_group where omc_sys_user.ID = omc_sys_user_group.UID and `omc_sys_group`.id = omc_sys_user_group.GID and GID = ' + ID + ' order by UserName'
        loadTBData(loadChildSql, tbListC)
        addChildButton(tbListC, ID)
      }
    })
  }

  function childTableInit (tbID, colNames, colModel) {
    tbID.jqGrid({
      datatype: 'local', // 本地加载模式
      // data: data,
      width: 'auto',
      height: 'auto',
      autowidth: true,
      rownumbers: true, // 序号
      shrinkToFit: true,
      colNames: colNames,
      colModel: colModel,
          // rowNum : 10,
      rowList: [ 5, 12, 24 ],
      pager: '#pager_c',
      pginput: false,
      pgbuttons: true,
      sortname: 'id',
          // loadonce: true,
          // mtype : "get",
      viewrecords: true,
      multiselect: false,
      sortorder: 'desc',
      onSelectRow: function () {

      }
    })
  }

  function addMainButton (tbID) {
    tbID.navGrid('#pager', {edit: false, add: false, del: false, search: false, refresh: false})
          .navButtonAdd('#pager',
      {
        caption: '添加用户组',
        buttonicon: 'icon_add_btn',
        onClickButton: function () {
          newFunc(tbList)
                      // $(document).trigger('alarm_confirm')
        },
        position: 'last',
        title: '添加用户组',
        id: 'add_group_btn'
      })
          // .navSeparatorAdd('#pager', {sepclass: 'separator', sepcontent: ''})
          .navButtonAdd('#pager',
      {
        caption: '删除用户组',
        buttonicon: 'icon_del_btn',
        onClickButton: function () {
          if (window.confirm('确定删除？')) {
            delFunc(tbList, delGroupSql)
          }
                      // $(document).trigger('alarm_confirm')
        },
        position: 'last',
        title: '删除用户组',
        id: 'del_group_btn'
      })
          // .navSeparatorAdd('#pager', {sepclass: 'separator', sepcontent: ''})
          .navButtonAdd('#pager',
      {
        caption: '保存',
        buttonicon: 'icon_del_btn',
        onClickButton: function () {
          saveFunc(tbList, mainDBName, mainDBCol, copyData)
                      // $(document).trigger('alarm_confirm')
        },
        position: 'last',
        title: '保存',
        id: 'save_group_btn'
      })
  }

  function addChildButton (tbID, NO) {
    sessionStorage.setItem('GID', NO)
    tbID.navGrid('#pager_c', {edit: false, add: false, del: false, search: false, refresh: false})
          .navButtonAdd('#pager_c',
      {
        caption: '添加用户',
        buttonicon: 'icon_add_btn',
        onClickButton: function () {
          g.iframe({
            title: '新增用户列表',
            ajaxWindow: true,
            show: true,
                // backdrop: true,
            type: 'iframe', // iframe / html / alert / confirm
            width: '450',
            height: '400',
            footerButtonAlign: 'right',
            url: g.url('common/chtml/authority/group_detail.html')
          })
        },
        position: 'last',
        title: '添加用户',
        id: 'add_group_btn'
      })
          // .navSeparatorAdd('#pager_c', {sepclass: 'separator', sepcontent: ''})
          .navButtonAdd('#pager_c',
      {
        caption: '移除本组',
        buttonicon: 'icon_del_btn',
        onClickButton: function () {
          if (window.confirm('确定删除？')) {
            delFunc(tbListC, delUserGroupSql, delUserGroupSql1)
          }
                      // $(document).trigger('alarm_confirm')
        },
        position: 'last',
        title: '移除本组',
        id: 'del_group_btn'
      })
  }

  function loadTBData (sql, tbID) {
    let UID = []
    if (tbID.jqGrid) {
      tbID.jqGrid('clearGridData', false)
    }
    let recordCountSpan = $('#data_record_count_span')
    gDb.load(sql, function fn (err, vals) {
      if (err) {
        console.log(err)
        throw err
      }

      let recordLength = vals.length
      for (let i = 0; i < recordLength; i++) {
        let aGroup = vals[i]
        UID.push(vals[i].ID)
        tbID.jqGrid('addRowData', i + 1, aGroup)
      }
      sessionStorage.setItem('UID', UID)
      copyData = tbID.jqGrid('getRowData')
      recordCountSpan.text('共' + recordLength.toString() + '条记录')
    }, gReqParam)
  }

  function newFunc (tbID) {
    let newRow = {
    }

    let propConfGrid = tbID
    let sRowIds = propConfGrid.jqGrid('getDataIDs')

    let rowIds = []
    for (let i = 0; i < sRowIds.length; i++) {
      rowIds.push(parseInt(sRowIds[i], 10))
    }

    let newRowId = utils.number.getVaildIndex(rowIds)
    newRow.newTag = 'new'
    propConfGrid.jqGrid('addRowData', newRowId, newRow)
  }

  function delFunc (tbID, sql, sql1) {
    let propConfGrid = tbID
    let selectedId = propConfGrid.jqGrid('getGridParam', 'selrow')
    let view = Controller.getView('tbList')
    let col = 'ID'
    let del = propConfGrid.jqGrid('getCell', selectedId, col)
    let GID = sessionStorage.getItem('GID')

    let deleteSql = 'delete from omc_sys_group_authority where GID = ' + GID + ';' + sql + '\'' + del + '\''
    if (sql1 !== undefined) {
      deleteSql = deleteSql + sql1 + '\'' + GID + '\''
    }
    gDb.loadT(deleteSql, function (err, vals) {
      if (err) {
        console.log(err)
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
          alert('删除失败！请先将该用户组内所有用户移除！')
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

  function saveFunc (tbID, dbName, columnNames, copyData) {
    let propConfGrid = tbID
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
        insertSql = 'insert into' + dbName + '(' + 'ID,' + columnNames + ')' +
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
          updateSql = 'update ' + dbName + 'set ' + upD +
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
    if (data.GroupName === copyData.GroupName) {
      return false
    } else {
      return true
    }
  }

  function uiResizeListener () {
        // let tableId = 'tbList'
    let parentBox = $('#gbox_tbList').parent()
    let gridBox = $('#tbList')
    gridBox.setGridWidth(parentBox.innerWidth() - 2)
    let height = parentBox.innerHeight() -
                    $('#gbox_tbList.ui-jqgrid-hdiv').outerHeight() -
                    $('#pager').outerHeight() - 70
    gridBox.setGridHeight(height)

    let parentBoxC = $('#gbox_tbList_c').parent()
    let gridBoxC = $('#tbList_c')
    gridBoxC.setGridWidth(parentBoxC.innerWidth() - 2)
    let heightC = parentBoxC.innerHeight() -
                    $('#gbox_tbList_c.ui-jqgrid-hdiv').outerHeight() -
                    $('#pager_c').outerHeight() - 70
    gridBoxC.setGridHeight(heightC)
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
