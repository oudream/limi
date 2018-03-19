/**
 * Created by ygct on 2016/3/23.
 */


var StatisticsDashBoard = {
    version: "1.0.0"
};


/*
 * 仪表盘生成入口函数
 */
StatisticsDashBoard.start = function()
{
    var mainDiv = document.getElementById('main');
    var myChart = echarts.init(mainDiv);

    var sqlCommand = cjEchartsDashBoardConfig.getSqlOfTotalCount();
    var url = {
        "sql" : sqlCommand
    };

    cjAjax.post(JSON.stringify(url),StatisticsDashBoard.req_get_total_count,myChart);

    myChart.showLoading();
}

/*
 * 查询数据库获取总仓位数
 */
StatisticsDashBoard.req_get_total_count = function (Request,chart)
{
    var jsonobj = JSON.parse(Request);
    var data = jsonobj.data;

    cjTempStorage.save("totalCount",data[0].data);

    var json = cjEchartsDashBoardConfig.buildJsonObjByUrl();

    cjAjax.post(JSON.stringify(json),StatisticsDashBoard.req_resp_measures,chart);
}


/*
 * 获取后台返回数据函数
 */
StatisticsDashBoard.req_resp_measures = function(Request,chart)
{
    chart.hideLoading();

    /* 创建一个饼图的option对象 */
    var option = cjEchartsDashBoardOptionClass.createNew();
    var jsonobj = JSON.parse(Request);
    var data = jsonobj.data;

    if ( data.length && data.length > 0 ) {

        var mainDiv = document.getElementById('main');
        var totalCountStr = cjTempStorage.load("totalCount");
        var totalCount = parseInt(totalCountStr,10);

        option.setTitle(cjEchartsDashBoardConfig.title,cjEchartsDashBoardConfig.subTitle,cjEchartsDashBoardConfig.x);

        option.totalCount = totalCount;

        option.setSeries("",data,cjEchartsDashBoardConfig.name);

        chart.setOption(option);
    }
}
