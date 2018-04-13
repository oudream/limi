/**
 * Created by liuchaoyu on 2016-12-15.
 *
 * cj-rtCharts.js
 */

let CjRtCharts = {
    version: '1.1.0',
};


/**
 * 创建图表
 * @param dom : Object 图表容器DIV
 * @param showParam : Object 展示参数
 * {
 *      chartCount : xx        曲线个数
 * }
 * @return rtChart : Object 实时图表对象
 */
CjRtCharts.init = function(dom, showParam) {
    let rtChart = {
        chartCount: 0,
        chart: null,
        // cases:[],
        option: null,
        isFirstTime: true,
    };

    rtChart.setChartParams = setChartParams;
    rtChart.setDataCases = setDataCases;
    // rtChart.getDataCases = getDataCases;
    rtChart.addSerie = addSerie;
    // rtChart.addDataOfToBeShow = addDataOfToBeShow;

    setDispalyParams(rtChart, showParam);

    let _chart = CjCharts.init(dom);
    // charts.chart.showLoading();
    rtChart.chart = _chart;
    _chart = null;

    return rtChart;
};

/**
 * 清空实时曲线图表
 * @param rtChart : Object 目标对象
 * @param isDispose : Boolean 是否销毁实例
 */
CjRtCharts.clear = function(rtChart, isDispose) {
    let t = null;
    for (t in rtChart) {
        if (t === 'chart') {
            let _cjCharts = rtChart[t];
            CjCharts.clear(_cjCharts, isDispose);
            _cjCharts = null;
        }

        rtChart[t] = null;
    }

    rtChart = null;
};

/**
 * 设置图表配置参数
 * @param paramObj : 参数对象
 *
 * {
        'type': 'line',         //图表类型：line,bar,pie

        'title': {
            'text': '测试用',      //主标题
            'subtext': '测试子标题'    //子标题
        },

        //'legendData': ['图样1','图样2'],     //图例标签

        'xAxis': {
            'type': 'category',      //x轴类型：value，category，time
            'name': '时间',      //x轴名称
            'data':[]
            //'data': ['2016-10-20','2016-10-21','2016-10-22','2016-10-23','2016-10-24','2016-10-25']      //x轴显示数据数组
        },

        'yAxis': {
            'type': 'value',      //y轴类型：value，category，time
            'name': '区域',      //y轴名称
            //'data': ['1A','2A','3A','4A','5A','6A']      //y轴显示数据数组
        },

        'markPoint': {
            'show': false      //是否显示标记点
        },

        'markLine': {
            'show': false      //是否显示标记线
        }
    }
 */
function setChartParams(paramObj) {
    let option = CjCharts.getCjOption(paramObj);

    option.toolbox = {'show': false};

    this.option = option;

    this.chart.setCjOption(option, true);

    option = null;
}

/**
 * 设置数据实例数组
 * @param cases : 数据实例数组
 */
function setDataCases(cases) {
    let _caseLength = cases.length;
    let _curCase = null;
    let series = null;
    let _serie = null;
    let _param = null;
    let _caseDataLength = null;
    let _option = null;
    let option = null;

    if (this.isFirstTime) {
        this.isFirstTime = false;

        series = [];
        let legendData = [];
        for (let i = 0; i < _caseLength; i++) {
            _curCase = cases[i];
            _param = {
                type: this.option.cjChart.type,
                name: _curCase.name,
                data: _curCase.data,
                xAxisData: _curCase.xAxisData,
                lineColor: _curCase.lineColor,
                needMarkPoint: false,
                needMarkLine: false,
            };

            _serie = CjCharts.getSerie(_param);
            _serie.areaStyle = _curCase.areaStyle;
            _param = null;

            _caseDataLength = _curCase.falseFlag.length;
            for (let j = 0; j < _caseDataLength; j++) {
                if (_curCase.falseFlag[j] != 1) {
                    _serie.data[j].itemStyle = {
                        normal: {
                            color: '#ccc',
                        },
                    };
                }
            }

            series.push(_serie);
            _serie = null;
            legendData.push(_curCase.name);
        }

        option = {
            legend: {
                data: legendData,
            },
            xAxis: {
                data: cases[0].xAxisData,
            },
            series: series,
        };

        // this.option.legend.data = legendData;
        // this.option.xAxis.data = cases[0].xAxisData;
        // this.option.series = series;

        let _newOption = Object.assign({}, this.option, option);
        this.option = null;

        let newOption = JSON.parse(JSON.stringify(_newOption));

        this.option = newOption;

        _newOption = null;
        newOption = null;

        let optionStr = JSON.stringify(option);
        _option = JSON.parse(optionStr);
        optionStr = null;
        legendData = null;
        series = null;
        option = null;

        this.chart.setCjOption(_option);
        _option = null;
    } else {

        // this.addDataOfToBeShow(cases);

    }
}

/**
 * 获取缓存数据实例数组
 * 描述：获取缓存的数据数组的第一个点的数据数组（如果多条曲线，就是多条曲线的第一个点的数组）
 * @return {Array}
 */
function getDataCases() {
    let points = [];
    let caseLength = this.cases.length;
    for (let i = 0; i < caseLength; i++) {
        let _case = this.cases[i];
        let _point = null;
        if (_case.length > 0) {
            _point = _case.shift();
        } else {
            _point = {
                falseFlag: 1,
            };
        }

        points.push(_point);
        _point = null;
    }

    return points;
}


/**
 * 添加数据序列
 * @param cases : 同一时刻所有曲线的一个数据点对象所组成的数组
 */
function addSerie(cases) {
    let caseCount = cases.length;
    // var _this = this;
    let _delData = null;
    let _firstCase = cases[0];
    let _curCase = null;
    let _curPoint = null;
    let _seriesData = null;
    let _tmpDataObj = null;
    let _option = null;
    let _optionStr = null;

    _delData = this.option.xAxis.data.shift();
    _delData = null;

    if (_firstCase.xAxisData) {
        let _newData = this.option.xAxis.data.concat(_firstCase.xAxisData);
        let newData = JSON.parse(JSON.stringify(_newData));
        this.option.xAxis.data = null;
        _newData = null;

        this.option.xAxis.data = newData;
    } else {
        console.log('没有找到X轴的类目数组');
    }

    for (let i = 0; i < caseCount; i++) {
        _delData = this.option.series[i].data.shift();
        _delData = null;

        _curCase = cases[i];
        if (_curCase.data) {
            for (let j = 0; j < _curCase.data.length; j++) {
                _tmpDataObj = {};

                _tmpDataObj.value = _curCase.data[j];
                _tmpDataObj.itemStyle = {
                    normal: {
                        color: _curCase.lineColor,
                    },
                };

                if (_curCase.falseFlag != 1) {
                    _tmpDataObj.itemStyle.normal.color = '#ccc';
                }

                this.option.series[i].data.push(_tmpDataObj);
                _tmpDataObj = null;
            }
        } else {
            console.log('data is error');
        }
    }

    _optionStr = JSON.stringify(this.option);
    _option = JSON.parse(_optionStr);
    _optionStr = null;

    // CjCharts.clear(this.chart);
    this.chart.load(_option);
}

/**
 * 追加数据点到待显示的缓存队列中
 * @param cases : 数据对象的数组
 */
function addDataOfToBeShow(cases) {
    let caseLength = cases.length;
    for (let i = 0; i < caseLength; i++) {
        let points = [];
        let xAxisLength = cases[i].xAxisData.length;
        for (let j = 0; j < xAxisLength; j++) {
            let pointObj = {};

            pointObj.data = cases[i].data[j];
            pointObj.xAxisData = cases[i].xAxisData[j];
            pointObj.falseFlag = cases[i].falseFlag[j];

            points.push(pointObj);
            pointObj = null;
        }

        if (this.cases[i]) {
            let _cases = JSON.parse(JSON.stringify(this.cases[i]));
            this.cases[i] = null;
            this.cases[i] = _cases.concat(points);
        } else {
            this.cases.push(points);
        }
        points = null;
    }
}


/**
 * 设置图表展示选项
 * @param chart : Object 实时图表对象
 * @param param : Object 参数对象
 * {
 *      chartCount : xx        曲线个数
 * }
 *
 */
function setDispalyParams(chart, param) {
    chart.chartCount = param.chartCount;
}


