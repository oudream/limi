/**
 * Created by ygct on 2016/3/23.
 */


let StatisticsHistogram = {
    version: '1.0.0',
};


/*
 * 柱状图生成入口函数
 */
StatisticsHistogram.start = function() {
    let mainDiv = document.getElementById('main');
    let myChart = echarts.init(mainDiv);

    let json;
    if (arguments.length > 0) {
        json = cjEchartsHistConfig.buildJsonObjByUrl(arguments[0], arguments[1]);
    } else {
        json = cjEchartsHistConfig.buildJsonObjByUrl();
    }

    myChart.showLoading();
    // cjAjax.post(sql,"post","req.sql.",true,req_resp_measures,myChart);
    cjAjax.post(JSON.stringify(json), StatisticsHistogram.req_resp_measures, myChart);
};

/*
 * 获取后台返回数据函数
 */
StatisticsHistogram.req_resp_measures = function(Request, chart) {
    chart.hideLoading();

    /* 创建一个柱状图的option对象 */
    let option = cjEchartsHistOptionClass.createNew();
    let jsonobj = JSON.parse(Request);
    let data = jsonobj.data;

    if ( data.length && data.length > 0 ) {
        let mainDiv = document.getElementById('main');

        let dateArray = getArrayBetweenDate(cjEchartsHistConfig.xAxisStartPoint, cjEchartsHistConfig.xAxisEndPoint);

        option.setTitle(cjEchartsHistConfig.title, cjEchartsHistConfig.subTitle);
        option.setXaxis(dateArray, cjEchartsHistConfig.xAxisUnit);
        option.setYaxis(cjEchartsHistConfig.yAxisUnit);

        option.setSeries('', data, cjEchartsHistConfig.legendMap);

        chart.setOption(option);
    }
};
