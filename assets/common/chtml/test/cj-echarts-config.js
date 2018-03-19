/**
 * Created by ygct on 2016/3/23.
 */
/**
 * Created by ygct on 2016/1/27.
 */


var cjEchartsConfig = {
    version: "1.0.0",
};

var sysDate = new Date();

var systemDate = {
    year: sysDate.getFullYear(),
    month: sysDate.getMonth() + 1,
    day: sysDate.getDate()
};

var datePickerOption = {
    "minDate":"2000-1-1",
    "maxDate":"2050-12-31",

    "yearRange":[2000,2050],

    "buttonOnClick":function(startDate,endDate){
        StatisticsLine.start(startDate,endDate);
    }
}


cjEchartsConfig.getExtentByUrl = function(url){

    var days = 0;
    switch (url)
    {
        case "statistics.histogram.week":    //柱状图
        {
            days = 7;
        }
            break;
        case "statistics.histogram.month":   //柱状图
        {
            days = 30;
        }
            break;
        case "statistics.pie.month":  //饼状图
        {
            days = 30;
        }
            break;
        case "statistics.line.null":  //折线图
        {
            days = 30;
        }
            break;
        case "statistics.dashboard.null":  //仪表盘
        {
        }
            break;
    }
    return days;
}


var cjEchartsHistConfig = {
    title:systemDate.year + "年" + systemDate.month + "月" + "存样柜统计数据",
    subTitle:"xxx区域",

    xAxisType:"date",
    xAxisStartPoint:"",
    xAxisEndPoint:"",

    xAxisUnit:"日期",
    yAxisUnit:"个",

    legendMap:{
        "21":"存样",
        "11":"存样",
        "22":"取样",
        "12":"取样",
        "32":"弃样",
        "31":"弃样"
    },

    setStartAndEndPoint:function(start,end){
        this.xAxisStartPoint = start;
        this.xAxisEndPoint = end;
    },

    buildJsonObjByUrl:function(){
        var cjCommon = window.cjCommon;
        var url = cjCommon.getUrlParam("url");
        var type = cjCommon.getUrlParam("type");
        var sql = cjEchartsConfig.getSql570(url,type);
        if( sql == undefined || sql == "" ){
            return;
        }

        var sqlObj = JSON.parse(sql);
        var sqlStr = sqlObj.sql;

        var days = cjEchartsConfig.getExtentByUrl(url);

        var start;
        var end;
        if (arguments.length > 0){
            start = arguments[0];
            end = arguments[1];
        }
        else {
            start = getDatebeforeDay(days);
            end = systemDate.year + "-" + systemDate.month + "-" + systemDate.day;
        }
        //var start = "2016-4-1";
        //var end = "2016-4-11";

        sqlObj.sql = sqlStr.replace(/%t1/g,start);
        sqlStr = sqlObj.sql;
        sqlObj.sql = sqlStr.replace(/%t2/g,end);

        this.setStartAndEndPoint(start,end);

        return sqlObj;
    },

};

var cjEchartsPieConfig = {
    title:systemDate.year + "年" + systemDate.month + "月" + "存样柜统计数据",
    subTitle:"xxx区域",
    x:"center",

    legendMap:{
        "21":"存样",
        "11":"存样",
        "22":"取样",
        "12":"取样",
        "32":"弃样",
        "31":"弃样"
    },

    buildJsonObjByUrl:function(){
        var cjCommon = window.cjCommon;
        var url = cjCommon.getUrlParam("url");
        var type = cjCommon.getUrlParam("type");
        var sql = cjEchartsConfig.getSql570(url,type);
        if( sql == undefined || sql == "" ){
            return;
        }

        var sqlObj = JSON.parse(sql);
        var sqlStr = sqlObj.sql;

        var days = cjEchartsConfig.getExtentByUrl(url);

        var start;
        var end;
        if (arguments.length > 0){
            start = arguments[0];
            end = arguments[1];
        }
        else {
            start = getDatebeforeDay(days);
            end = systemDate.year + "-" + systemDate.month + "-" + systemDate.day;
        }

        //var start = "2016-4-1";
        //var end = "2016-4-11";

        sqlObj.sql = sqlStr.replace(/%t1/g,start);
        sqlStr = sqlObj.sql;
        sqlObj.sql = sqlStr.replace(/%t2/g,end);

        return sqlObj;
    },

};

var cjEchartsLineConfig = {
    title:"存样柜使用统计数据",
    subTitle:"xxx区域",

    xAxisType:"date",
    xAxisStartPoint:"",
    xAxisEndPoint:"",

    xAxisUnit:"日期",
    yAxisUnit:"个",

    legendMap:{
        "21":"存样",
        "11":"存样",
        "22":"取样",
        "12":"取样",
        "32":"弃样",
        "31":"弃样"
    },

    setStartAndEndPoint:function(start,end){
        this.xAxisStartPoint = start;
        this.xAxisEndPoint = end;
    },

    buildJsonObjByUrl:function(){
        var cjCommon = window.cjCommon;
        var url = cjCommon.getUrlParam("url");
        var type = cjCommon.getUrlParam("type");
        var sql = cjEchartsConfig.getSql570(url,type);
        if( sql == undefined || sql == "" ){
            return;
        }

        var sqlObj = JSON.parse(sql);
        var sqlStr = sqlObj.sql;

        var days = cjEchartsConfig.getExtentByUrl(url);

        var start;
        var end;
        if (arguments.length > 0){
            start = arguments[0];
            end = arguments[1];
        }
        else {
            start = getDatebeforeDay(days);
            end = systemDate.year + "-" + systemDate.month + "-" + systemDate.day;
        }
        //var start = "2016-4-1";
        //var end = "2016-4-11";

        sqlObj.sql = sqlStr.replace(/%t1/g,start);
        sqlStr = sqlObj.sql;
        sqlObj.sql = sqlStr.replace(/%t2/g,end);

        this.setStartAndEndPoint(start,end);

        return sqlObj;
    },

};

var cjEchartsDashBoardConfig = {
    title:"存样柜仓位使用率",
    subTitle:"xxx区域",
    x:"center",

    name:"使用率",

    buildJsonObjByUrl:function(){
        var cjCommon = window.cjCommon;
        var url = cjCommon.getUrlParam("url");
        var type = cjCommon.getUrlParam("type");
        var sql = cjEchartsConfig.getSql570(url,type);
        if( sql == undefined || sql == "" ){
            return;
        }

        return JSON.parse(sql);
    },

    getSqlOfTotalCount:function() {
        var sqlCommand = "select count(1) as 'data' from T_570_RT_STATE where F_IS_USED in (0,1)";
        return sqlCommand;
    }

};



/*
 * 获取相应天数前的日期
 * 参数：days，几天前
 * */
function getDatebeforeDay(days)
{
    var retMonth = 0;
    var retDay = 0;

    if( days == undefined || days == "" || days == null || days == 0 ){
        return systemDate.year + "-" + systemDate.month + "-" + systemDate.day;
    }

    days -= 1;

    if( systemDate.day <= days ){
        var beforeDate = new Date(systemDate.year,systemDate.month - 1,0);
        var maxDayBeforeMonth = beforeDate.getDate();

        retDay = maxDayBeforeMonth + (systemDate.day - days);
        retMonth = systemDate.month - 1;
    }
    else{
        retDay = systemDate.day - days;
        retMonth = systemDate.month;
    }

    return systemDate.year + "-" + retMonth + "-" + retDay;
}

/*
 * 获取两个日期之间所有日期的数组
 * 参数：startDate,开始日期
 *       endDate,结束日期
 * */
function getArrayBetweenDate(startDate,endDate)
{
    if( startDate == undefined || endDate == undefined || startDate == "" || endDate == "" ){
        return false;
    }

    function getDate(str)
    {
        var tempDate = new Date();
        var list = str.split("-");
        tempDate.setFullYear(list[0]);
        tempDate.setMonth(list[1] - 1);
        tempDate.setDate(list[2]);
        return tempDate;
    }

    /*
     * 对于单位数月份和日期，进行自动补‘0’
     * */
    function completeZero(date){
        var monthStr;
        var dayStr;
        if( (date.getMonth() + 1) < 10 ){
            monthStr = "0" + (date.getMonth() + 1).toString();
        }
        else{
            monthStr = (date.getMonth() + 1).toString();
        }

        if( date.getDate() < 10 ){
            dayStr = "0" + (date.getDate()).toString();
        }
        else{
            dayStr = (date.getDate()).toString();
        }

        return date.getFullYear() + "-" + monthStr + "-" + dayStr;
    }

    var date1 = getDate(startDate);
    var date2 = getDate(endDate);

    if (date1 > date2) {
        var tempDate = date1;
        date1 = date2;
        date2 = tempDate;
    }

    var dateArray = [];
    while (!(date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate())) {

        var dateStr = completeZero(date1);

        dateArray.push(dateStr);

        date1.setDate(date1.getDate() + 1);
    }

    var dateStr = completeZero(date2);
    dateArray.push(dateStr);

    return dateArray;
}

/*
* 分割线 =============================================
* */

var map = {};

//////////////////////////////////container

function ParseCoordinates(str_xy,pathType)
{

    var xyArray = str_xy.split(" ");
    var xyInfo = {};
    if(xyArray.length>1)
    {
        xyInfo.type = pathType;
        xyInfo.x = xyArray[0];
        xyInfo.y = xyArray[1];
    }
    else if(xyArray.length<2&&xyArray.length>0) {
        if(pathType ==="H")
        {
            xyInfo.type = pathType;
            xyInfo.x = xyArray[0];
            xyInfo.y = pathArray[pathArray.length-1].y;
        }else if(pathType ==="V")
        {
            xyInfo.type =pathType;
            xyInfo.x = pathArray[pathArray.length-1].x;
            xyInfo.y = xyArray[0];
        }

    }
    else
    {
        return null;
    }
    return xyInfo;
}


function tanAngle(width,height)
{
    return height/width;
}
function findPathLocation(path)
{
    var len=path.length;
    var pathLocationArray = new Array();
    for(var i=0;i<len;i++)
    {
        if(path[i] ==="M"||path[i] ==="H"||path[i] ==="L"||path[i] ==="Z")
        {
            var info = {};
            info.type = path[i];
            info.location = i;
            pathLocationArray.push(info);
        }
    }
    return pathLocationArray;
}

/**
 * drawRontainer 漏斗
 * higConfig: 参数对象
 * */
cjEchartsConfig.drawRontainer = function(svgId,emtId,measure)
{
    if(measure>90)
    {
        measure = 90;
    }
    var color = "steelblue";
    var b = measure % 2
    if (b === 0)
    {
        color = "#28ff28";
    }
    var svg = d3.selectAll("[id="+svgId+"]");
    var rontainer = d3.selectAll("[id="+emtId+"]");
    var path_d = rontainer.attr("d");
    var pathArray = ParsePath(path_d);

    var v_Height = pathArray[2].y - pathArray[1].y;
    var heightScale = d3.scale.linear()
        .domain([0,100])
        .range([v_Height,0]);

    //   var angle = getAngle(pathArray[2],pathArray[1]);
    var dd;

    var Y_height = heightScale(measure);
    var tan = tanAngle(pathArray[1].x-pathArray[2].x,v_Height);
    var dd = (v_Height-Y_height)/tan;
    var Mx_first = pathArray[3].x - ((v_Height-Y_height)/tan);

    var My_first = Y_height;

    var Lx_to = Number((v_Height-Y_height)/tan) + Number(pathArray[2].x);
    var Ly_to = Y_height;

    var d = "M"+Mx_first+" "+My_first+" "+"L"+Lx_to+" "+Ly_to+" "+"L"+pathArray[2].x
        +" "+pathArray[2].y+" "+pathArray[3].x+" "+pathArray[3].y;


    var newPathId = null;
    if(emtId in map)
    {
        newPathId = map[emtId];
    }else
    {
        var mysavePathId = {
            nowPathId: "measurePath" + measure,
            beforePathId: null
        };
        map[emtId] = mysavePathId;
    }

    svg.append("path")
        .attr("class","axis")
        .attr("id","measurePath"+measure)
        .attr("stroke","steelblue")
        .attr("stroke-width","2")
        .attr("fill",color)
        .attr("d",d);


    if(newPathId!=null||newPathId!=undefined)
    {

        var beforePath = document.getElementById(newPathId.beforePathId);
        var _parentElement = beforePath.parentNode;
        if(_parentElement){
            _parentElement.removeChild(beforePath);
        }
        //  measurePath.attr("d",d);
    }
    map[emtId].beforePathId = "measurePath"+measure;

}


function ParsePath(path)
{
    var pathArray = new Array();

    var pathLocationArray = findPathLocation(path);
    var len=pathLocationArray.length-1;
    for(var i= 0;i<len;++i)
    {
        var sub = path.substring(pathLocationArray[i].location+1,pathLocationArray[i+1].location-1);
        var xyArray = ParseCoordinates(sub,pathLocationArray[i].type);
        if(xyArray!=null) {
            pathArray.push(xyArray);    //解析XY坐标
        }
    }
    return pathArray;
}



cjEchartsConfig.getSql570 = function(url,type)
{
    var sql = "";
    switch (url)
    {
        case "statistics.histogram.week":
        case "statistics.histogram.month":
        {
            if (type == "21") {
                sql = window.cjSql570.getSqlJson("save", false);
            }
            else if (type == "22") {
                sql = window.cjSql570.getSqlJson("take", false);
            }
            else if (type == "23") {
                sql = window.cjSql570.getSqlJson("throw", false);
            }
        }
            break;

        case "statistics.pie.month":
        {
            sql = window.cjSql570.getSqlJson("pie_sql", false);
        }
            break;

        case "statistics.line.null":  //折线图
        {
            sql = window.cjSql570.getSqlJson("line_sql",false);
        }
            break;

        case "statistics.dashboard.null":  //仪表盘
        {
            sql = window.cjSql570.getSqlJson("dashboard_sql",false);
        }
            break;
    }
    return sql;
}



