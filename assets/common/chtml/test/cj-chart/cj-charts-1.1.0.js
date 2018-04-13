/**
 * Created by liuchaoyu on 2016-11-01.
 *
 * cj-charts.js
 */


let CjCharts = {
    'version': '1.1.0',
};

/**
 * @method 图表生成并初始化
 * @param dom : Object div DOM对象
 * @returns {{}} : Object 图表实例对象
 */
CjCharts.init = function(dom) {
    let chart = {};

    chart.setCjOption = setCjOption;
    chart.load = load;

    /** 同一个DIV，单一实例限制 */
    let _chart = echarts.getInstanceByDom(dom);
    if (_chart) {
        chart.chart = _chart;
    } else {
        chart.chart = echarts.init(dom);
    }
    chart.params = {};

    return chart;
};

/**
 * 清除图表
 * @param chart : Object 图表对象
 * @param isDispose : Boolean 是否销毁图表对象（如果否，只清除数据）
 */
CjCharts.clear = function(chart, isDispose) {
    if (! isDispose) {
        chart['chart'].clear();
    } else {
        let t = null;
        for (t in chart) {
            if (t === 'chart') {
                if (chart[t].clear) {
                    chart[t].clear();
                    chart[t].dispose();
                }
            }

            chart[t] = null;
        }

        chart = null;
    }
};


/** 参数对象格式
{
    'type' : '',         //图表类型：line,bar,pie

    'title' : {
        'text': '',      //主标题
        'subtext': ''    //子标题
    },

    'legendData':[],     //图例标签

    'xAxis': {
        'type': '',      //x轴类型：value，category，time
        'name': '',      //x轴名称
        'data': [],      //x轴显示数据数组
    },

    'yAxis': {
        'type': '',      //y轴类型：value，category，time
        'name': '',      //y轴名称
        'data': [],      //y轴显示数据数组
    },

    'dataZoom': {
        'startValue':'',  //平行于x轴缩放滑动轴的起始值
        'endValue':''     //平行于x轴缩放滑动轴的结束值
    },

    'markPoint': {
        'show':true      //是否显示标记点
    },

    'markLine': {
        'show':true      //是否显示标记线
    }
}
 */
/**
 * @method 获取图表标准格式配置
 * @param param : Object 自定义参数的对象
 * @returns {*} : Object 图表标准格式配置对象
 */

CjCharts.getCjOption = function(param) {
    if (param.type == undefined) {
        return -1;
    }

    let chartParam = {};
    if (param.type == 'line' || param.type == 'bar') {
        chartParam = CjChartsCatesian.create(param.type);
    } else {
        return -2;
    }

    if (param.title && param.title.text) {
        chartParam.title.text = param.title.text;
        chartParam.title.subtext = param.title.subtext;
    }

    if (param.legendData && param.legendData.length) {
        chartParam.legend.data = copyArray(param.legendData);
    }

    chartParam.xAxis.type = param.xAxis.type;

    if (param.xAxis.name) {
        chartParam.xAxis.name = param.xAxis.name;
    }

    if (param.xAxis.data) {
        chartParam.xAxis.data = copyArray(param.xAxis.data);
    }

    if (param.xAxis.min) {
        chartParam.xAxis.min = param.xAxis.min;
    }

    if (param.xAxis.max) {
        chartParam.xAxis.max = param.xAxis.max;
    }

    chartParam.yAxis.type = param.yAxis.type;

    if (param.yAxis.name) {
        chartParam.yAxis.name = param.yAxis.name;
    }

    if (param.yAxis.data) {
        chartParam.yAxis.data = copyArray(param.yAxis.data);
    }

    if (param.yAxis.min) {
        chartParam.yAxis.min = param.yAxis.min;
    }

    if (param.yAxis.max) {
        chartParam.yAxis.max = param.yAxis.max;
    }

    if (param.dataZoom && param.dataZoom.type && param.dataZoom.start && param.dataZoom.end) {
        let dataZoom = CjChartsBase.newDataZoom(param.dataZoom.type, param.dataZoom.start, param.dataZoom.end);

        chartParam.dataZoom = [];
        chartParam.dataZoom.push(dataZoom);
    }

    if (param.markPoint && param.markPoint.show == false) {
        chartParam.cjChart.markPoint = false;
        // chartObj.params.markPoint = false;
    } else {
        chartParam.cjChart.markPoint = true;
        // chartObj.params.markPoint = true;
    }

    if (param.markLine && param.markLine.show == false) {
        chartParam.cjChart.markLine = false;
        // chartObj.params.markLine = false;
    } else {
        chartParam.cjChart.markLine = true;
        // chartObj.params.markLine = true;
    }

    // chartParam.series.push({
    //    type:param.type,
    //    data:[]
    // });

    return chartParam;
};

/**
 * @method 设置图表的配置
 * @param option : 图表标准格式配置项对象
 * @param notMerge : 是否与原来的option合并，默认false，合并
 */
function setCjOption(option, notMerge) {
    let _notMerge = false;
    if (notMerge) {
        _notMerge = notMerge;
    }
    this.chart.setOption(option, _notMerge);
    _notMerge = null;
}

/**
 * @method 获取图表标准格式数据项对象
 * @param dataObj : 自定义数据项对象
 * {
 *      'name': '',                          //数据实例名（要跟图例名对上）
 *      'type': 'line' or 'bar' , 'pie'      //图表类型
 *      'data': [],                          //数据数组
 *      'xAxisData': [],                     //X轴类目数组
 *      'lineColor':'#000'                   //曲线颜色，可以不设置，有默认
 *      'needMarkPoint': true or false       //是否需要标记点
 *      'needMarkLine': true or false        //是否需要标记线
 * }
 * @returns {*} : 图表标准格式数据项对象
 *
*/
CjCharts.getSerie = function(dataObj) {
    if (dataObj.type == 'line' || dataObj.type == 'bar') {
        var serie = CjChartsCatesian.newSerie(dataObj);
    }

    if (serie) {
        serie.cjAttr = {
            xAxisData: dataObj.xAxisData,
        };
    }

    return serie;
};


/**
 * @method 加载数据
 * @param data : 数据项对象数组（或者整个配置项对象）
 *
 */
function load(data) {
    let _option = null;
    if (data.series == undefined && typeof data == 'object' && data.length > 0) {
        _option = {
            'xAxis': {
                'data': data[0].cjAttr.xAxisData,
            },
            'series': data,
        };
    } else if (data.series && data.series.length > 0) {
        _option = data;
    } else {
        console.log('传入参数有误，请检查');
        return false;
    }

    let optionStr = JSON.stringify(_option);
    let option = JSON.parse(optionStr);
    _option = null;
    optionStr = null;

    this.setCjOption(option);

    return true;
}


/**
 * @class 图表基类
 * @type {{create: cjChartsBase.'create', newDataZoom: cjChartsBase.'newDataZoom'}}
 */
var CjChartsBase = {

    'create': function() {
        let obj = {};

        obj.title = {
            'text': '',
            'subtext': '',
            'x': '',
        };

        obj.tooltip = {
            'trigger': '',
            'formatter': '',
        };

        obj.toolbox = {
            'show': true,
            'feature': {
                'dataView': {show: false, readOnly: false},
                'dataZoom': {show: false, xAxisIndex: '', yAxisIndex: 'none'},
                'magicType': {show: true, type: ['line', 'bar']},
                'restore': {show: true},
                'saveAsImage': {show: true},
            },
        };

        obj.legend = {
            'orient': '',
            'data': [],
        };

        obj.xAxis = {
            'type': '',
            'name': '',
            'nameLocation': 'end',
            'data': [],
            'axisLabel': {formatter: null},
        };

        obj.yAxis = {
            'type': '',
            'name': '',
            'nameLocation': 'end',
            'data': [],
            'axisLabel': {formatter: null},
        };

        obj.cjChart = {
            'type': '',
            'markPoint': true,
            'markLine': true,
        };

        obj.series = [];

        return obj;
    },

    'newDataZoom': function(type, start, end) {
        let obj = {
            // 第一个 dataZoom 组件
            'type': type,
            'xAxisIndex': 0, // 表示这个 dataZoom 组件控制 第一个 xAxis
            'start': start,
            'end': end,
        };

        return obj;
    },
};

/**
 * @class 直角坐标系的图表类
 * @type {{create: cjChartsCatesian.'create', newSerie: cjChartsCatesian.'newSerie'}}
 */
var CjChartsCatesian = {

    'create': function(type) {
        let obj = CjChartsBase.create();

        obj.title.x = 'left';

        obj.tooltip.trigger = 'axis';

        obj.legend.orient = 'horizontal';

        obj.cjChart.type = type;

        return obj;
    },

    'newSerie': function(param) {
        let _name = param.name,
            _type = param.type,
            _data = param.data,
            _xAxisData = param.xAxisData,
            _lineColor = param.lineColor,
            _needMarkPoint = param.needMarkPoint,
            _needMarkLine = param.needMarkLine;

        if (_data.length > 0 && _xAxisData.length > 0 && _data.length != _xAxisData.length) {
            console.log('数据项个数与X轴类目个数对不上，请检查！！');
            return false;
        }

        let obj = {
            'name': _name,
            'type': _type,
            'itemStyle': {},
            'markPoint': {},
            'markLine': {},
        };

        let dispData = [];
        let loopArray = [];

        if (_xAxisData.length == 0) {
            loopArray = _data;
        } else {
            loopArray = _xAxisData;
        }

        for (let i = 0; i < loopArray.length; i++) {
            var item;
            if (_xAxisData.length == 0) {
                item = loopArray[i];
            } else {
                let dataObj = {};

                if (_data[i]) {
                    // dataObj.value = [_xAxisData[i], _data[i]];
                    dataObj.value = _data[i];
                } else {
                    // dataObj.value = [_xAxisData[i], '-'];
                    dataObj.value = '-';
                }


                item = dataObj;
            }
            dispData.push(item);
        }

        obj.data = dispData;

        if (_lineColor) {
            obj.itemStyle.normal = {
                'color': _lineColor,
            };
        }

        if (_needMarkPoint == true) {
            obj.markPoint = {
                data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'},
                ],
            };
        }

        if (_needMarkLine == true) {
            obj.markLine = {
                data: [
                    {type: 'average', name: '平均值'},
                ],
            };
        }

        return obj;
    },

};

function copyArray(array) {
    let _array = [];
    for (let i = 0; i < array.length; i++) {
        _array[i] = array[i];
    }

    return _array;
}
