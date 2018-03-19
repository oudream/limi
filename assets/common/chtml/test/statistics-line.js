/**
 * Created by ygct on 2016/3/23.
 */


var StatisticsLine = {
    version: "1.0.0"
};


/*
 * 柱状图生成入口函数
 */
StatisticsLine.start = function()
{
    var mainDiv = document.getElementById('main');
    var myChart = echarts.init(mainDiv);

    var json;
    if (arguments.length > 0){
        json = cjEchartsLineConfig.buildJsonObjByUrl(arguments[0],arguments[1]);
    }
    else{
        json = cjEchartsLineConfig.buildJsonObjByUrl();
    }

    myChart.showLoading();
    //cjAjax.post(sql,"post","req.sql.",true,req_resp_measures,myChart);
    cjAjax.post(JSON.stringify(json),StatisticsLine.req_resp_measures,myChart);
}

/*
 * 获取后台返回数据函数
 */
StatisticsLine.req_resp_measures = function(Request,chart)
{
    chart.hideLoading();

    /* 创建一个柱状图的option对象 */
    var option = cjEchartsLineOptionClass.createNew();
    var jsonobj = JSON.parse(Request);
    var data = jsonobj.data;

    if ( data.length && data.length > 0 ) {

        var mainDiv = document.getElementById('main');

        var dateArray = getArrayBetweenDate(cjEchartsLineConfig.xAxisStartPoint,cjEchartsLineConfig.xAxisEndPoint);

        option.setTitle(cjEchartsLineConfig.title,cjEchartsLineConfig.subTitle);
        option.setXaxis(dateArray,cjEchartsLineConfig.xAxisUnit);
        option.setYaxis(cjEchartsLineConfig.yAxisUnit);

        option.setSeries("line",data,cjEchartsLineConfig.legendMap);

        chart.setOption(option);
    }
}
