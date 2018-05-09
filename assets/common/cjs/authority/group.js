/**
 * Created by nielei on 2017/10/24.
 */
define(['jquery', 'server', 'global', 'echart3', 'dataBind', 'jqGrid', 'bootstrap', 'uix-date', 'drag'], function($, server, g, echarts, dataBind) {
    let action = {
        init: function(common) {
            let lastsel;
            let data = [
            ];
            let tableId = 'tbList';
            let table_dID = 'tbList_d';
            let grIdBox = $('#tbList').jqGrid({
                datatype: 'local', // 本地加载模式
                data: data,
                width: 'auto',
                height: 'auto',
                autowidth: true,
                rownumbers: true, // 序号
                shrinkToFit: true,
        // caption: '用户组',
                colNames: [
                    'newTag', 'oldTag', '序号', '组名',
                ],
                colModel: [
            {name: 'newTag', hidden: true},
            {name: 'oldTag', hidden: true},
            {name: 'ID', hidden: true},
            {name: 'GroupName', width: 100},
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
                sortorder: 'desc',
                onSelectRow: function(id) {
                    if (id && id !== lastsel) {
                        $('#tbList').jqGrid('saveRow', lastsel);
                        $('#tbList').jqGrid('editRow', id, true);
                        lastsel = id;
                    }
                    let oldRow = {};
                    oldRow.oldTag = 'old';
                    $('#tbList').jqGrid('setRowData', id, oldRow);
                },
        // rowNum: 10
            });
            let grIdBox_d = $('#tbList_d').jqGrid({
                datatype: 'local', // 本地加载模式
                data: data,
                width: 'auto',
                height: 'auto',
                autowidth: true,
                rownumbers: true, // 序号
                shrinkToFit: true,
        // caption: '用户',
                colNames: [
                    '序号', '账号', '用户名', '选中',
                ],
                colModel: [
            {name: 'ID', hidden: true},
            {name: 'UserName', width: 100},
            {name: 'Name', width: 100},
            {name: 'isCheck', hidden: true},
                ],
                // rowNum : 10,
                rowList: [5, 12, 24],
                pager: '#pager_d',
                // pginput: false,
                sortname: 'id',
                // loadonce: true,
                // mtype : "get",
                viewrecords: true,
                multiselect: true,
                sortorder: 'desc',
                rowNum: 10,
            });

            $('#tbList').navGrid('#pager', {edit: false, add: false, del: false, search: false, refresh: false})
          .navButtonAdd('#pager',
                {
                    caption: '添加',
                    buttonicon: 'icon_add_btn',
                    onClickButton: function() {
            // $(document).trigger('alarm_confirm')
                    },
                    position: 'last',
                    title: '添加用户组',
                    id: 'add_group_btn',
                })
          .navSeparatorAdd('#pager', {sepclass: 'separator', sepcontent: ''})
          .navButtonAdd('#pager',
                {
                    caption: '删除',
                    buttonicon: 'icon_del_btn',
                    onClickButton: function() {
                      // $(document).trigger('alarm_confirm')
                    },
                    position: 'last',
                    title: '删除用户组',
                    id: 'del_group_btn',
                });

            $('#tbList_d').navGrid('#pager_d', {edit: false, add: false, del: false, search: false, refresh: false})
          .navButtonAdd('#pager_d',
                {
                    caption: '添加用户',
                    buttonicon: 'icon_add_btn',
                    onClickButton: function() {
            // $(document).trigger('alarm_confirm')
                    },
                    position: 'last',
                    title: '添加用户',
                    id: 'add_group_btn',
                })
          .navSeparatorAdd('#pager_d', {sepclass: 'separator', sepcontent: ''})
          .navButtonAdd('#pager_d',
                {
                    caption: '移除本组',
                    buttonicon: 'icon_del_btn',
                    onClickButton: function() {
                      // $(document).trigger('alarm_confirm')
                    },
                    position: 'last',
                    title: '移除本组',
                    id: 'del_group_btn',
                });
            common.addResizeEvent('tbWarning_filter_resize', function() {
                let parentBox = $('#gbox_' + tableId).parent();
                let parentBox_d = $('#gbox_' + table_dID).parent();

                grIdBox.setGridWidth(parentBox.innerWidth() - 2);
                let height = parentBox.innerHeight() -
                    $('#gbox_' + tableId + ' .ui-jqgrid-hdiv').outerHeight() -
                    $('#pager').outerHeight() - 40;
                grIdBox.setGridHeight(height);

                grIdBox_d.setGridWidth(parentBox_d.innerWidth() - 2);
                let height_d = parentBox_d.innerHeight() -
                    $('#gbox_' + table_dID + ' .ui-jqgrid-hdiv').outerHeight() -
                    $('#pager_d').outerHeight() - 40;
                grIdBox_d.setGridHeight(height_d);
            });
        },
    };

    return {
        beforeOnload: function() {
            // alert("beforeOnload");
        },

        onload: function(common) {
            // alert("onload");
            action.init(common);
            common.callResize();
            $(window).resize(function() {
                common.callResize();
            });
        },
    };
});
