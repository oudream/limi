/**
 * Created by liuchaoyu on 2016-04-20.
 */

let DatePicker = {
    version: '1.0.0',
};

DatePicker.init = function(elem) {
    let startLabel = document.createElement('label');
    let endLabel = document.createElement('label');
    let startInput = document.createElement('input');
    let endInput = document.createElement('input');
    let button = document.createElement('input');

    startInput.id = 'startDate';
    startInput.type = 'text';
    endInput.id = 'endDate';
    endInput.type = 'text';
    startInput.style.marginRight = '20px';
    endInput.style.marginRight = '20px';

    startLabel.for = 'startDate';
    endLabel.for = 'endDate';
    startLabel.textContent = '开始日期：';
    endLabel.textContent = '结束日期：';
    startLabel.style.fontFamily = 'microsoft yahei';
    startLabel.style.fontWeight = 'bold';
    endLabel.style.fontFamily = 'microsoft yahei';
    endLabel.style.fontWeight = 'bold';

    button.id = 'commitButton';
    button.type = 'button';
    button.value = '查询';
    button.style.fontFamily = 'microsoft yahei';
    button.style.fontWeight = 'bold';

    elem.style.margin = '5px';
    elem.appendChild(startLabel);
    elem.appendChild(startInput);
    elem.appendChild(endLabel);
    elem.appendChild(endInput);
    elem.appendChild(button);
};

DatePicker.setOption = function(option) {
    let i18n = { // 本地化
        previousMonth: '上个月',
        nextMonth: '下个月',
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        weekdaysShort: ['日', '一', '二', '三', '四', '五', '六'],
    };

    let startDatepicker = new Pikaday({
        field:	document.getElementById('startDate'),
        minDate:	new Date(option.minDate),
        maxDate:	new Date(option.maxDate),
        yearRange:	option.yearRange,  // [2000,2050],
        i18n: i18n,
        onSelect: function() {
            let date = document.createTextNode(this.getMoment().format('YYYY-MM-DD') + ' '); // 日期格式 2016-04-20
            document.getElementById('startDate').appendChild(date);
        },
    });

    let endDatepicker = new Pikaday({
        field:	document.getElementById('endDate'),
        minDate:	new Date(option.minDate),
        maxDate:	new Date(option.maxDate),
        yearRange:	option.yearRange, // [2000,2050],
        i18n: i18n,
        onSelect: function() {
            let date = document.createTextNode(this.getMoment().format('YYYY-MM-DD') + ' '); // 日期格式 2016-04-20
            document.getElementById('endDate').appendChild(date);
        },
    });

    let button = document.getElementById('commitButton');
    if (option.buttonText != undefined && option.buttonText != '' ) {
        button.textContent = option.buttonText;
    }

    button.onclick = function() {
        let startValue = document.getElementById('startDate').value;
        let endValue = document.getElementById('endDate').value;
        if (startValue != '' && endValue != '') {
            // endValue = moment(endValue).add('days',1).format('YYYY-MM-DD');
            option.buttonOnClick(startValue, endValue);
        }
    };
};


