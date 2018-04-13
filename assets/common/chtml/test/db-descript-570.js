/**
 * Created by oudream on 2016/3/24.
 */
(function() {
    window.cjDescript570 = {};
    let cjDescript570 = window.cjDescript570;

    cjDescript570.isVisible = function( url, attr ) {
        let obj = cjDescript570[url];
        return (obj && obj.hasOwnProperty(attr));
    };

    cjDescript570.getTitle = function( url, attr ) {
        let obj = cjDescript570[url];
        if (obj) return obj[attr];
    };

    cjDescript570.ticket_todo = cjDescript570.ticket_doing = cjDescript570.ticket_done = {
        'F_ID': 'ID',
        'F_NAME': '名称',
        'F_DESC': '描述',
        'F_TYPE': '类型',
        'F_STATUS': '状态',
        'F_MODE_OP': '操作模式',
        'F_RESULT': '操作票结果',
        'F_MAX_TIMEOUT': '超时时间',
        'F_USER_MON': '审批人',
        'F_USER_AUD': '值班人',
        'F_USER_OP': '操作人',
        'F_DT_CRT': '创建日期',
        'F_DT_START_PLAN': '计划开始时间',
        'F_DT_END_PLAN': '计划结束时间',
        'F_DT_START_OP': '执行开始时间',
        'F_DT_END_OP': '执行结束时间',
        'F_ERROR': '错误码',
        'F_ERR_INFO': '错误信息',
        'F_DT': '时间',
        'F_RES0': '扩展',
        'detail': {
            'F_ID': 'ID',
            'F_PID': '归属ID',
            'F_ORDER': '当前序号',
            'F_TYPE': '样品类型',
            'F_OBJ_OP': '操作目标',
            'F_CODE_TYPE': '码类型',
            'F_CODE_1': '明码',
            'F_CODE_2': '暗码',
            'F_CODE_3': '瓶底码',
            'F_CODE_4': '自定义码',
            'F_CODE_5': '第三方系统码',
            'F_CODE_6': '保留码',
            'F_DT_START_OP': '执行开始时间',
            'F_DT_END_OP': '执行结束时间',
            'F_RES_OP': '操作结果',
            'F_STATUS': '状态',
            'F_ERROR': '错误码',
            'F_ERR_INFO': '错误信息',
            'F_RES0': '扩展',
        },
    };

    cjDescript570.box_state = {
        'F_ID_M': '柜子仓位ID',
        'F_ID_3RD': '第三方仓位ID',
        'F_TYPE': '样品类型',
        'F_IS_USED': '是否使用中',
        'F_STATION': '柜子编号',
        'F_SAMPLE_SRC': '存样来源',
        'F_CODE_TYPE': '码类型',
        'F_CODE_1': '明码',
        'F_CODE_2': '暗码',
        'F_CODE_3': '瓶底码',
        // "F_CODE_4"  : "自定义码",
        // "F_CODE_5"  : "第三方系统码",
        // "F_CODE_6"  : "保留码",
        // "F_PCH"  : "批次号",
        // "F_USER"  : "用户",
        'F_DT': '时间',
        'F_FLAG': '标志',
        // "F_RES0"  : "保留",
        // "F_RES1"  : "保留"
    };

    cjDescript570.sample_log = {
        'F_ID_M': '柜子仓位ID',
        'F_STATION': '柜子编号',
        'F_TYPE': '操作类型',
        'F_CODE_TYPE': '码类型',
        'F_CODE_1': '明码',
        'F_CODE_2': 'RFID码',
        'F_CODE_3': '瓶底码',
        'F_CODE_4': '自定义码',
        'F_CODE_5': '第三方系统码',
        'F_CODE_6': '保留码',
        'F_USER': '用户',
        'F_DT': '时间',
    };

    cjDescript570.t_evt_570 = {
        'F_ID': 'ID',
        'F_USER_OP': '操作人',
        'F_DT': '时间',
        'FROM_UNIXTIME(F_DT)': '时间',
        'F_SRC': '事件源',
        'F_TYPE': '事件类型',
        'F_ACTION': '事件动作',
        'F_DESC': '事件信息',
        'F_SYN_FLAG': '同步标志',
        'F_RES0': '保留',
        'F_RES1': '保留',
    };

    cjDescript570.rt_measure = {
        'url': 'url',
        'mid': 'mid',
        'v': '值',
        'q': '质量',
        't': '时间',
        'srcid': '原tid',
        'srcurl': '原url',
        'state': '信息体的状态码',
    };
})();
