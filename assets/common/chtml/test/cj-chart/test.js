/**
 * Created by liuchaoyu on 2016-11-01.
 */


let test = function() {
    cjCharts.init(document.getElementById('main'));

    let params = {
        'type': 'line',         // 图表类型：line,bar,pie

        'title': {
            'text': '测试用',      // 主标题
            'subtext': '测试子标题',    // 子标题
        },

        'legendData': ['图样1'],     // 图例标签

        'xAxis': {
            'type': 'category',      // x轴类型：value，category，time
            'name': '时间',      // x轴名称
            'data': ['2016-10-20', '2016-10-21', '2016-10-22', '2016-10-23', '2016-10-24', '2016-10-25'],      // x轴显示数据数组
        },

        'yAxis': {
            'type': 'category',      // y轴类型：value，category，time
            'name': '区域',      // y轴名称
            'data': ['1A', '2A', '3A', '4A', '5A', '6A'],      // y轴显示数据数组
        },

        'markPoint': {
            'show': false,      // 是否显示标记点
        },

        'markLine': {
            'show': false,      // 是否显示标记线
        },
    };

    cjCharts.setParams(params);

    let data = dataExchange(params.xAxis.data, ['3A', '2A', '5A', '1A', '4A', '6A']);


    let cases = [
        {
            'name': '图样1',
            'data': data,
        },
    ];
    cjCharts.load(cases);
};

var dataExchange = function(xData, yData) {
    let dataArray = [];
    for (let i = 0; i < xData.length; i++) {
        let data = [xData[i]];

        if (yData[i] == undefined) {
            data.push('0');
        } else {
            data.push(yData[i]);
        }

        dataArray.push(data);
    }

    return dataArray;
};


window.onload = test;
