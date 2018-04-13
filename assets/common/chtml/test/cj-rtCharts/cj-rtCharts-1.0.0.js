/**
 * Created by liuchaoyu on 2016-12-15.
 *
 * cj-rtCharts.js
 */

let CjRtCharts = {
    version: '1.0.0',
};


// var cjRtCharts = {
//
//     isShowTogether: true,
//     chartCount: 0,
//     charts: [],
//     cases:[],
//     options:[],
//     isFirstTime:true,
// };

/**
 * 创建图表
 * @param dom : Object 图表容器DIV
 * @param showParam : Object 展示参数
 * {
 *      mode : 0，             模式："0":所有曲线显示在一个图表中；"1":每一个曲线分别显示不同的图表中；
 *      chartCount : xx        曲线个数
 * }
 * @return chart : Object 实时图表对象
 */
CjRtCharts.init = function(dom, showParam) {
    let chart = {
        isShowTogether: true,
        chartCount: 0,
        charts: [],
        cases: [],
        options: [],
        isFirstTime: true,
    };

    chart.setChartParams = setChartParams;
    chart.setDataCases = setDataCases;
    chart.getDataCases = getDataCases;
    chart.addSerie = addSerie;
    chart.addDataOfToBeShow = addDataOfToBeShow;

    setDispalyParams(chart, showParam);

    let graphPanel = dom;
    // graphPanel.style.width = (document.body.scrollWidth - 26) + 'px';
    // graphPanel.style.height = (document.body.scrollHeight - 20) + 'px';


    let charts = null;
    /** 所有曲线在一个图表中展示 */
    if (chart.isShowTogether == true) {
        // graphPanel.style.width = '800px';
        // graphPanel.style.height = '600px';
        charts = cjCharts.init(graphPanel);
        // charts.chart.showLoading();
        chart.charts.push(charts);
        charts = null;
    }
    /** 将曲线分开多个图表展示 */
    else if (chart.isShowTogether == false) {
        let chartWidth = graphPanel.clientWidth / 2;
        let chartHeight = graphPanel.clientHeight / 3;

        for (let i = 0; i < chart.chartCount; i++) {
            let chartDiv = cjCommon.createElement('div', {'id': 'chart_' + i, 'className': 'chart_panel'}, graphPanel);
            chartDiv.style.width = chartWidth + 'px';
            chartDiv.style.height = chartHeight + 'px';

            charts = cjCharts.init(chartDiv);
            // charts.chart.showLoading();
            chart.charts.push(charts);
            charts = null;
        }
    }

    return chart;
};

/**
 * 清空实时曲线图表
 * @param chart : Object 目标对象
 */
CjRtCharts.clear = function(chart) {
    let t = null;
    for (t in chart) {
        if (t === 'charts') {
            let _cjCharts = chart[t];
            for (let i = 0; i < _cjCharts.length; i++) {
                cjCharts.clear(_cjCharts[i], true);
            }
            _cjCharts = null;
        }

        chart[t] = null;
    }

    chart = null;
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
    let option = null;
    if (this.isShowTogether == true) {
        option = cjCharts.getOption(paramObj);

        option.toolbox = {'show': false};
        this.options.push(option);
    } else if (this.isShowTogether == false) {
        for (let i = 0; i < this.chartCount; i++) {
            option = cjCharts.getOption(paramObj);

            option.toolbox = {'show': false};
            this.options.push(option);
        }
    }
}

/**
 * 设置数据实例数组
 * @param cases : 数据实例数组
 */
function setDataCases(cases) {
    let _this = this;
    let _caseLength = cases.length;
    let _curCase = null;
    let series = null;
    let _serie = null;
    let _param = null;
    let _caseDataLength = null;
    let _option = null;


    if (this.isFirstTime) {
        this.isFirstTime = false;

        if (this.isShowTogether === true) {
            series = [];
            let legendData = [];
            for (var i = 0; i < _caseLength; i++) {
                _curCase = cases[i];
                _param = {
                    type: 'line',
                    name: _curCase.name,
                    data: _curCase.data,
                    xAxisData: _curCase.xAxisData,
                    lineColor: _curCase.lineColor,
                    needMarkPoint: false,
                    needMarkLine: false,
                };

                _serie = cjCharts.getSerie(_param);
                _param = null;

                _serie.areaStyle = {'normal': {}};

                _caseDataLength = _curCase.falseFlag.length;
                for (var j = 0; j < _caseDataLength; j++) {
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

            _this.options[0].legend.data = legendData;
            _this.options[0].xAxis.data = cases[0].xAxisData;
            _this.options[0].series = series;

            var optionStr = JSON.stringify(_this.options[0]);
            _option = JSON.parse(optionStr);
            optionStr = null;
            legendData = null;
            series = null;

            cjCharts.setOption(_this.charts[0], _option, true);
            _option = null;
        } else if (this.isShowTogether === false) {
            for (var i = 0; i < _caseLength; i++) {
                _curCase = cases[i];
                series = [];
                _param = {
                    type: 'line',
                    name: _curCase.name,
                    data: _curCase.data,
                    xAxisData: _curCase.xAxisData,
                    lineColor: _curCase.lineColor,
                    needMarkPoint: false,
                    needMarkLine: false,
                };

                _serie = cjCharts.getSerie(_param);
                _param = null;

                _caseDataLength = _curCase.falseFlag.length;
                for (var j = 0; j < _caseDataLength; j++) {
                    if (_curCase.falseFlag[j] != 1) {
                        _serie.data[j].itemStyle = {
                            normal: {
                                color: '#ccc',
                            },
                        };
                    }
                }

                series.push(_serie);

                _this.options[i].legend.data.push(_curCase.name);
                _this.options[i].xAxis.data = cjCommon.clone(_curCase.xAxisData);
                _this.options[i].series = series;

                var optionStr = JSON.stringify(_this.options[i]);
                _option = JSON.parse(optionStr);
                optionStr = null;

                cjCharts.setOption(_this.charts[i], _option, true);
                _option = null;
            }
        }
    } else {
        this.addDataOfToBeShow(cases);
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
 * @param points : 同一时刻所有曲线的数据点对象所组成的数组
 */
function addSerie(points) {
    let pointCount = points.length;
    let _this = this;
    let _delData = null;
    let _firstPoint = points[0];
    let _curPoint = null;
    let _seriesData = null;
    let _tmpDataObj = null;
    let _option = null;
    let _optionStr = null;

    if (this.isShowTogether == true) {
        _delData = _this.options[0].xAxis.data.shift();
        _delData = null;

        for (let n = 0; n < pointCount; n++) {
            if (_firstPoint.xAxisData) {
                _this.options[0].xAxis.data.push(_firstPoint.xAxisData);
                break;
            }

            if (n === pointCount - 1) {
                console.log('没有找到X轴的类目数组');
            }
        }

        for (var i = 0; i < pointCount; i++) {
            _seriesData = _this.options[0].series[i].data;
            _delData = _seriesData.shift();
            _delData = null;

            _curPoint = points[i];
            if (_curPoint.data) {
                if (_curPoint.falseFlag != 1) {
                    _tmpDataObj = {};

                    _tmpDataObj.value = _curPoint.data;
                    _tmpDataObj.itemStyle = {
                        normal: {
                            color: '#ccc',
                        },
                    };

                    _seriesData.push(_tmpDataObj);
                    _tmpDataObj = null;
                } else {
                    _seriesData.push(_curPoint.data);
                }
            }
        }

        _optionStr = JSON.stringify(_this.options[0]);
        _option = JSON.parse(_optionStr);
        _optionStr = null;

        cjCharts.load(_this.charts[0], _option);
    } else if (this.isShowTogether == false) {
        for (var i = 0; i < pointCount; i++) {
            _delData = _this.options[i].xAxis.data.shift();
            _delData = null;

            _curPoint = points[i];
            if (_curPoint.xAxisData) {
                _this.options[i].xAxis.data.push(_curPoint.xAxisData);
            }

            _seriesData = _this.options[i].series[0].data;
            _delData = _seriesData.shift();
            _delData = null;

            if (_curPoint.data) {
                if (_curPoint.falseFlag != 1) {
                    let dataObj = {};

                    dataObj.value = _curPoint.data;
                    dataObj.itemStyle = {
                        normal: {
                            color: '#ccc',
                        },
                    };

                    _seriesData.push(dataObj);
                } else {
                    _seriesData.push(_curPoint.data);
                }
            }

            _optionStr = JSON.stringify(_this.options[i]);
            _option = JSON.parse(_optionStr);
            _optionStr = null;
            cjCharts.load(_this.charts[i], _option);
        }
    }
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
 *      mode : 0，             模式："0":所有曲线显示在一个图表中；"1":每一个曲线分别显示不同的图表中；
 *      chartCount : xx        曲线个数
 * }
 *
 */
function setDispalyParams(chart, param) {
    if (param.chartCount > 6) {
        console.log('图表个数已超过最大上限数6个！！');
        return false;
    }

    chart.chartCount = param.chartCount;

    if (param.mode == 0) {
        chart.isShowTogether = true;
    } else if (param.mode == 1) {
        chart.isShowTogether = false;
    }
}


