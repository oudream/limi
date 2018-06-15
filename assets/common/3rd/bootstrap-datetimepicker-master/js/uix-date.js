define(['jquery', 'util', 'bootstrap', 'bootstrap-dateCN', 'utils'], function($, util) {
	// 默认配置
    let defaults = {
        language: 'zh-CN', // 语言包
        weekStart: 1, // 一周从哪一天开始。0（星期日）到6（星期六）
        todayBtn: 1, // 是否出现选择今天的按钮
        autoclose: 1, // 选择日期后是否自动关闭
        todayHighlight: 1, // 当前日期是否高亮显示
        startView: 2, // 默认显示视图，0：小时；1：天；2：月；3：年；4：十年
        forceParse: true, // 强制解析为正确的时间
        showMeridian: true,
        minView: 2, // 最小显示视图，2代表月
        startDate: undefined, // 开始时间
        endDate: undefined, // 结束时间
    };
	// 操作方法
    let opt={
        setStartDate: function(dateVal) {
            $(this).next().datetimepicker('setStartDate', dateVal);
        },
        setEndDate: function(dateVal) {
            $(this).next().datetimepicker('setEndDate', dateVal);
        },
        setDate: function(dateVal) {
            $(this).val(dateVal);
            $(this).next().find('input').val(dateVal);
            $(this).next().datetimepicker('update');
        },
        remove: function() {
            $(this).next().datetimepicker('remove');
        },
    };

    $.fn.extend({
        'uixDate': function(params, val) {
		    let name = params.name;
			// 判断是否执行方法，如remove等
            if (typeof params=='string'&&opt[params]!=undefined) {
                opt[params].call(this, val);
                return;
            }
			// 实例化时间选择控件，获取参数
            let value, type, readonly, format, disabled;
            if (params != undefined) {
                value = params.value || $(this).val();
                type = params.dateType || $(this).attr('dateType') || 'form_date';
				//				var hideRemove = params.hideRemove == undefined ?
				//					($(this).attr("hideRemove") == undefined ? false : true) : params.hideRemove;
                readonly = params.readonly == undefined ?
					($(this).attr('readonly') == undefined ? '' : 'readonly') : (params.readonly == true ? 'readonly' : '');
                defaults.startDate = params.startDate || $(this).attr('startDate') || undefined;
                defaults.endDate = params.endDate || $(this).attr('endDate') || undefined;
                disabled=params.disabled;
            }			else {
                type='form_date';
                value = util.dateFormat(new Date(), 'yyyy-MM-dd');
                readonly='';
            }
            switch (type) {
            case 'form_date':
                {
                    defaults.minView = 2;
                    defaults.startView = 2;
                    format = 'yyyy-mm-dd';
                    break;
                }
            case 'form_datetime':
                {
                    defaults.minView = 0;
                    defaults.startView = 2;
                    format = 'yyyy-mm-dd hh:ii:ss';
                    break;
                }
            case 'form_time':
                {
                    defaults.startView = 0;
                    defaults.maxView = 0;
                    defaults.minView = 0;
                    format = 'hh:ii';
                    break;
                }
            default:
                {
                    defaults.minView = 2;
                    defaults.startView = 2;
                    format = 'yyyy-mm-dd';
                    break;
                }
            }
			// end获取参数
            let template = '<div class="input-append date ' + type + ' ' + $(this).attr('id') + '" data-date-format="' + format + '"  data-date ="' + value + '" data-link-field="' + $(this).attr('id') + '"><input size="16" name="' + name + '" type="text" value="' + value + '"' + readonly + '>';
			//			if(!hideRemove) {
			//				template += '<span class="add-on remo"><i class="icon-remove"></i></span>';
			//			}
            template += '<span class="add-on"><i class="icon-th"></i></span></div>';
            let a = $(template);
            $(this).after(a);
            a.datetimepicker(defaults);
            a.datetimepicker().on('changeDate', params&&params.changeDate);
            if (readonly=='readonly') {
//				a.datetimepicker("remove");
            }
        },
    });
});
