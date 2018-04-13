/**
 * Created by ygct on 2016/3/23.
 */


let StatisticsDashBoard = {
    version: '1.0.0',
};


/*
 * 仪表盘生成入口函数
 */
StatisticsDashBoard.start = function() {
    let mainDiv = document.getElementById('main');
    let myChart = echarts.init(mainDiv);

    let sqlCommand = cjEchartsDashBoardConfig.getSqlOfTotalCount();
    let url = {
        'sql': sqlCommand,
    };

    cjAjax.post(JSON.stringify(url), StatisticsDashBoard.req_get_total_count, myChart);

    myChart.showLoading();
};

/*
 * 查询数据库获取总仓位数
 */
StatisticsDashBoard.req_get_total_count = function(Request, chart) {
    let jsonobj = JSON.parse(Request);
    let data = jsonobj.data;

    cjTempStorage.save('totalCount', data[0].data);

    let json = cjEchartsDashBoardConfig.buildJsonObjByUrl();

    cjAjax.post(JSON.stringify(json), StatisticsDashBoard.req_resp_measures, chart);
};


/*
 * 获取后台返回数据函数
 */
StatisticsDashBoard.req_resp_measures = function(Request, chart) {
    chart.hideLoading();

    /* 创建一个饼图的option对象 */
    let option = cjEchartsDashBoardOptionClass.createNew();
    let jsonobj = JSON.parse(Request);
    let data = jsonobj.data;

    if ( data.length && data.length > 0 ) {
        let mainDiv = document.getElementById('main');
        let totalCountStr = cjTempStorage.load('totalCount');
        let totalCount = parseInt(totalCountStr, 10);

        option.setTitle(cjEchartsDashBoardConfig.title, cjEchartsDashBoardConfig.subTitle, cjEchartsDashBoardConfig.x);

        option.totalCount = totalCount;

        option.setSeries('', data, cjEchartsDashBoardConfig.name);

        chart.setOption(option);
    }
};
