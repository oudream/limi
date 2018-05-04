/**
 * Created by nielei on 2017/10/25.
 */

'use strict'

define(['jquery', 'async', 'global', 'jqGrid', 'ztree', 'cjcommon', 'cjstorage', 'cjdatabaseaccess', 'cjajax', 'loadNode', 'structure', 'model', 'view', 'controller', 'utils', 'cache', 'jqGridExtension'], function ($, async, g) {
  let gDb = null
  let gReqParam = null

  let tbList = $('#tbList')
  let aTree = $('#tree')

  let zSetting = {
    data: {
      key: {
        title: 't'
      },
      simpleData: {
        enable: true
      }
    },
    check: {
      enable: true
    },
    view: {
      showIcon: false
    }
  }

  let mainColNames = [
    '序号', '组名'
  ]
  let mainColModel = [
      {name: 'ID', hidden: true},
      {name: 'GroupName', width: 100}
  ]

  let loadMainSql = 'SELECT omc_sys_group.ID,omc_sys_group.GroupName FROM `omc_sys_group` order by GroupName;'
  let loadTreeSql = 'select * from omc_sys_authority'

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
      uiResizeListener()
      loadTBData(loadMainSql, tbList)
      treeInit(loadTreeSql)
    }
  }

  function mainTableInit (tbID, colNames, colModel) {
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
      pgbuttons: true,
      sortname: 'id',
            // loadonce: true,
            // mtype : "get",
      viewrecords: true,
      multiselect: false,
      sortorder: 'desc',
      onSelectRow: function (id) {
        tbID.jqGrid('setRowData', id)
        let ID = tbID.jqGrid('getRowData', id).ID
        let upSql = 'select omc_sys_authority.*,omc_sys_group_authority.Visible from omc_sys_authority,omc_sys_group_authority,`omc_sys_group` where omc_sys_authority.MenuID = omc_sys_group_authority.AID and omc_sys_group.ID = omc_sys_group_authority.GID and omc_sys_group_authority.GID = ' + ID
        updateTree(upSql)
        $('#save_btn').unbind('click')
        $('#save_btn').click(function () {
          saveFunc(ID)
        })
      }
    })
  }

  function treeInit (treeSql) {
    let nodeTree = []
    gDb.load(treeSql, function (err, vals) {
      if (err) {

      } else {
        for (let i = 0; i < vals.length; i++) {
          let zNode = {
            id: vals[i].MenuID,
            pId: vals[i].MenuPID,
            name: vals[i].Name,
            // menuURL: vals[i].MenuURL,
            // eID: vals[i].ElementID,
            // eName: vals[i].ElementName,
            checked: false,
            open: false
          }
          nodeTree.push(zNode)
        }
        $.fn.zTree.init(aTree, zSetting, nodeTree)
      }
    }, gReqParam)
  }

  function updateTree (upSql) {
    let treeObj = $.fn.zTree.getZTreeObj('tree')
    let node = treeObj.getNodes()
    let nodes = treeObj.transformToArray(node)
    gDb.load(upSql, function (err, vals) {
      if (err) {

      } else {
        for (let t = 0; t < nodes.length; t++) {
          nodes[t].checked = false
          treeObj.updateNode(nodes[t])
        }
        for (let i = 0; i < vals.length; i++) {
          for (let j = 0; j < nodes.length; j++) {
            if (vals[i].MenuID === nodes[j].id) {
              if (vals[i].Visible === 1) {
                nodes[j].checked = true
              }
              treeObj.updateNode(nodes[j])
              break
            }
          }
        }
      }
    }, gReqParam)
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
      recordCountSpan.text('共' + recordLength.toString() + '条记录')
    }, gReqParam)
  }

  function saveFunc (GID) {
    let treeObj = $.fn.zTree.getZTreeObj('tree')
    let node = treeObj.getNodes()
    let nodes = treeObj.transformToArray(node)
    let AID = []
    let insertSql = 'delete from omc_sys_group_authority where GID = ' + GID + ';'
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].checked) {
        AID.push(nodes[i].id)
      }
    }
    for (let j = 0; j < AID.length; j++) {
      insertSql = insertSql + 'insert into omc_sys_group_authority(GID,AID,Visible) ' +
          'values(' + GID + ',' + AID[j] + ',1);'
    }
    gDb.load(insertSql, function (err, vals) {
      if (err) {
        window.alert('保存失败！')
        document.location.reload()
        console.log(err)
      } else {
        window.alert('保存成功！')
        document.location.reload()
      }
    }, gReqParam)
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
