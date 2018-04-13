define(['jquery', 'server', 'global', 'bootstrap', 'uix-date'], function($, server, g) {
    let action = {
        init: function() {
			// 默认情况
            $('#dtp_input_date').uixDate();
			// 原生写法
            $('#datetimepicker').datetimepicker();

            $('#dtp_input_datetime').uixDate({
                dateType: 'form_datetime',
            });
            $('#dtp_input_time').uixDate({
                dateType: 'form_time',
            });

			// 各参数说明
            $('#dtp_input2').uixDate({
                value: '2017-03-21',
                dateType: 'form_date',
                readonly: true,
                startDate: '2017-03-19',
                endDate: '2017-03-25',
                changeDate: function() {
                    $('#dtp_input3').uixDate('setStartDate', $('#dtp_input2').val());
                },
            });
            $('#dtp_input3').uixDate({
                value: '2017-03-21',
                dateType: 'form_date',
                readonly: true,
            });
            $('#dtp_input_date').datetimepicker();
            $('#removeDate').click(function() {
                $('#dtp_input_date').uixDate('remove');
            });
            $('#removeDate2').click(function() {
                $('#datetimepicker').datetimepicker('remove');
            });
        },
    };

    return {
        beforeOnload: function() {
			// alert("beforeOnload");
        },

        onload: function() {
			// alert("onload");
            action.init();
        },
    };
});
