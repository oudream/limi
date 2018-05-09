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
            let grIdBox = $('#tbList').jqGrid({
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
                    '选中',
                ],
                colModel: [
            {name: 'newTag', hidden: true},
            {name: 'oldTag', hidden: true},
            {name: 'ID', hidden: true},
            {name: 'UserName', width: 100, editable: true},
            {name: 'PassWord', width: 100, editable: true},
            {name: 'Name', width: 100, editable: true},
            {name: 'isCheck', hidden: true},
                ],
                // rowNum : 10,
                rowList: [5, 12, 24],
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
            });
            common.addResizeEvent('tbWarning_filter_resize', function() {
                let parentBox = $('#gbox_' + tableId).parent();
                grIdBox.setGridWidth(parentBox.innerWidth() - 2);
                let height = parentBox.innerHeight() -
                    $('#gbox_' + tableId + ' .ui-jqgrid-hdiv').outerHeight() -
                    $('#pager').outerHeight() -
                    $('.toolbar').outerHeight() -
                    2;
                grIdBox.setGridHeight(height);
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
