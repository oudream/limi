/**
 * Created by nielei on 2017/10/24.
 */
define(['jquery', 'server', 'global', 'echart3', 'dataBind', 'jqGrid', 'bootstrap', 'uix-date', 'drag'], function ($, server, g, echarts, dataBind) {
  var action = {
    init: function (common) {
      var data = [
      ]
      var tableId = 'tbList'
      var grIdBox = $('#tbList').jqGrid({
        datatype: 'local', // 本地加载模式
        data: data,
        width: 'auto',
        height: 'auto',
        autowidth: true,
        rownumbers: true, // 序号
        shrinkToFit: true,
                // caption: '用户组',
        colNames: [
          '序号', '组名'
        ],
        colModel: [
                    {name: 'ID', hidden: true},
                    {name: 'GroupName', width: 100}
        ],
                // rowNum : 10,
                // rowList: [ 5, 12, 24 ],
        pager: '#pager',
        pginput: false,
        sortname: 'id',
                // loadonce: true,
                // mtype : "get",
        viewrecords: true,
        multiselect: false,
        sortorder: 'desc'
                // rowNum: 10
      })

      common.addResizeEvent('tbWarning_filter_resize', function () {
        var parentBox = $('#gbox_' + tableId).parent()
        grIdBox.setGridWidth(parentBox.innerWidth() - 2)
        var height = parentBox.innerHeight() -
                    $('#gbox_' + tableId + ' .ui-jqgrid-hdiv').outerHeight() -
                    $('#pager').outerHeight() - 40
        grIdBox.setGridHeight(height)
      })
    }
  }

  return {
    beforeOnload: function () {
            // alert("beforeOnload");
    },

    onload: function (common) {
            // alert("onload");
      action.init(common)
      common.callResize()
      $(window).resize(function () {
        common.callResize()
      })
    }
  }
})
