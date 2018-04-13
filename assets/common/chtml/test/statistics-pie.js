/**
 * Created by ygct on 2016/3/23.
 */


let StatisticsPie = {
    version: '1.0.0',
};


/*
 * 饼图生成入口函数
 */
StatisticsPie.start = function() {
    let mainDiv = document.getElementById('main');
    let myChart = echarts.init(mainDiv);

    let json;
    if (arguments.length > 0) {
        json = cjEchartsPieConfig.buildJsonObjByUrl(arguments[0], arguments[1]);
    } else {
        json = cjEchartsPieConfig.buildJsonObjByUrl();
    }

    myChart.showLoading();
    // cjAjax.post(sql,"post","req.sql.",true,req_resp_measures,myChart);

    cjAjax.post(JSON.stringify(json), StatisticsPie.req_resp_measures, myChart);
};

/*
 * 获取后台返回数据函数
 */
StatisticsPie.req_resp_measures = function(Request, chart) {
    chart.hideLoading();

    /* 创建一个饼图的option对象 */
    let option = cjEchartsPieOptionClass.createNew();
    let jsonobj = JSON.parse(Request);
    let data = jsonobj.data;

    if ( data.length && data.length > 0 ) {
        let mainDiv = document.getElementById('main');

        option.setTitle(cjEchartsPieConfig.title, cjEchartsPieConfig.subTitle, cjEchartsPieConfig.x);

        option.setSeries('', data, cjEchartsPieConfig.legendMap);

        chart.setOption(option);
    }
};
