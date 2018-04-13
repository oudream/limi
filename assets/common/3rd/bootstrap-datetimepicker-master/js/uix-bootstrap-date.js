define(['jquery', 'util', 'bootstrap', 'bootstrap-dateCN'], function($, util) {
    let FormatType = {
        'form_date': {
            type: 'form_date',
            minView: 2,
            startView: 2,
            format: 'yyyy-mm-dd',
        },
        'form_datetime': {
            type: 'form_date',
            minView: 0,
            startView: 2,
            format: 'yyyy-mm-dd hh:ii',
        },
        'form_datetime': {
            type: 'form_datetime',
            minView: 0,
            startView: 2,
            maxView: 0,
            format: 'yyyy-mm-dd hh:ii',
        },
    };
    FormatType['default'] = FormatType['form_date'];

    let getHtml = function(type) {
        let ft = type && FormatType[type];
        ft = ft || FormatType['default'];

        return ['<div class="input-append date ', ft.type,
            '" data-date-format="', format, '"  data-date ="', value,
            '" data-link-field="', $(this).attr('id'), '"><input size="16" type="text" value="', value,
            '" ', readonly, '><span class="add-on"><i class="icon-th"></i></span></div>'].join('');
    };

    let UixBootstrapDate = function(element, option) {
        let $ele = $(element);
        this.element = $ele;

    	this.formatType = options.formatType || this.element.data('format-type') || defauls.formatType;

        this.datapickerElement = $(getHtml(this.formatType));

        a.datetimepicker(defaults);
        a.datetimepicker().on('changeDate', params && params.changeDate);
        if (readonly == 'readonly') {
            a.unbind('click');
        }

        this.element.after(this.datapickerElement);
    };

    UixBootstrapDate.prototype = {
	    constructor: Datetimepicker,
	    remove: function() {

	    },
    };

    $.fn.uixBootstrapDate = function(option) {
	    let args = Array(...arguments);
	    args.shift();
	    let internal_return;
	    this.each(function() {
	      let $this = $(this),
	        data = $this.data('uixdatetimepicker'),
	        options = typeof option === 'object' && option;
	      if (!data) {
	        $this.data('uixdatetimepicker', (data = new UixBootstrapDate(this, $.extend({}, $.fn.uixBootstrapDate.defaults, options))));
	      }
	      if (typeof option === 'string' && typeof data[option] === 'function') {
	        internal_return = data[option](...args);
	        if (internal_return !== undefined) {
	          return false;
	        }
	      }
	    });
	    if (internal_return !== undefined) {
        return internal_return;
    } else {
        return this;
    }
    };

    $.fn.uixBootstrapDate.defaults = {
        dateType: 'form_date',
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

    $.fn.uixBootstrapDate.Constructor = UixBootstrapDate;

    $.fn.extend({
        'uixDate': function(params) {
			// 获取参数
            let value, type, readonly, format, disabled;
            if (params != undefined) {
                value = params.value || $(this).val();
                type = params.dateType || $(this).attr('dateType') || 'form_date';
				//				var hideRemove = params.hideRemove == undefined ?
				//					($(this).attr("hideRemove") == undefined ? false : true) : params.hideRemove;
                readonly = params.readonly == undefined
					? ($(this).attr('readonly') == undefined ? '' : 'readonly') : (params.readonly == true ? 'readonly' : '');
                defaults.startDate = params.startDate || $(this).attr('startDate') || undefined;
                defaults.endDate = params.endDate || $(this).attr('endDate') || undefined;
                disabled = params.disabled;
            } else {
                type = 'form_date';
                value = util.dateFormat(new Date(), 'yyyy-MM-dd');
                readonly = '';
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
                    format = 'yyyy-mm-dd hh:ii';
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

            let template = '<div class="input-append date ' + type + '" data-date-format="' + format + '"  data-date ="' + value + '" data-link-field="' + $(this).attr('id') + '"><input size="16" type="text" name="time" value="' + value + '" ' + readonly + '>';
			//			if(!hideRemove) {
			//				template += '<span class="add-on remo"><i class="icon-remove"></i></span>';
			//			}
            template += '<span class="add-on"><i class="icon-th"></i></span></div>';
            let a = $(template);
            $(this).after(a);
            a.datetimepicker(defaults);
            a.datetimepicker().on('changeDate', params && params.changeDate);
            if (readonly == 'readonly') {
                a.unbind('click');
            }
        },
        'uixSetStartDate': function(dateVal) {
            $(this).next().datetimepicker('setStartDate', dateVal);
        },
        'uixSetEndDate': function(dateVal) {
            $(this).next().datetimepicker('setStartDate', dateVal);
        },
        'uixSetDate': function(dateVal) {
            $(this).val(dateVal);
            $(this).next().find('input').val(dateVal);
            $(this).next().datetimepicker('update');
        },
    });
});
