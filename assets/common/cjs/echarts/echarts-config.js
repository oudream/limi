/**
 * Created by nielei on 2018/2/28.
 */
'use strict';
let echartsConfig = {

};

define(['jquery', 'echart3'], function($, echarts) {
  /**
   * 配置折线图
   * @param ID : string echart id
   * @param config : obj 配置
   */
    echartsConfig.lineConfig = function(ID, config) {
        let myChart = echarts.init($('#' + ID)[0]); // 基于准备好的dom，初始化echarts实例
        let series = [];
        let seriesAllData = [];
        let obj = {};
        for (let i = 0; i < config.legend.length; i++) {
            obj = {
                name: config.legend[i],
                type: 'line',
                showSymbol: false,
                data: config.seriesData[i],
            };
            series.push(obj);
            seriesAllData.push(...config.seriesData[i]);
        }
    // 指定图表的配置项和数据
        let option = {
            title: {
                text: config.title, // 标题
                textStyle: {
                    fontWeight: 'normal',
                    color: '#008ACD',
                },
            },
            color: config.color,
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                type: 'scroll',
                data: config.legend, // 图例
            },
            toolbox: {
                feature: {
                    saveAsImage: {},
                    magicType: {
                        type: ['line', 'bar'],
                    },
                    right: '3%',
                },
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: config.xData,
            },
            yAxis: {
                name: config.yName || '',
                type: 'value',
                axisLabel: {
                    formatter: '{value}' + config.yUnit,
                },
            },
            series: series,
        };
    // y轴值上下浮动0.2
        option.yAxis.max = Math.max(...seriesAllData) + Math.max(...seriesAllData) * 0.2;
        let min = Math.min(...seriesAllData) - Math.min(...seriesAllData) * 0.2;
        if (min < 0) {
            min = 0;
        }
        option.yAxis.min = min;
        if (config.xData === 'day') {
            option.xAxis.data = xAxisDay();
            option.dataZoom = [
                {
                    type: 'slider',
                    show: true,
                    startValue: xAxisDay().length - 7,
                    endValue: xAxisDay().length - 1,
                    filterMode: 'filter',
                },
            ];
        }
        myChart.setOption(option);
    };

  /**
   * 配置柱状图
   * @param ID : string echart id
   * @param config : obj 配置
   */
    echartsConfig.barConfig = function(ID, config) {
        let myChart = echarts.init($('#' + ID)[0]); // 基于准备好的dom，初始化echarts实例
        let series = [];
        let seriesAllData = [];
        let obj = {};
        for (let i = 0; i < config.legend.length; i++) {
            obj = {
                name: config.legend[i],
                type: 'bar',
                data: config.seriesData[i],
            };
            series.push(obj);
            seriesAllData.push(...config.seriesData[i]);
        }
    // 指定图表的配置项和数据
        let option = {
            title: {
                text: config.title, // 标题
                textStyle: {
                    fontWeight: 'normal',
                    color: '#008ACD',
                },
            },
            color: config.color,
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                type: 'scroll',
                data: config.legend, // 图例
            },
            toolbox: {
                feature: {
                    saveAsImage: {},
                    magicType: {
                        type: ['line', 'bar'],
                    },
                    right: '3%',
                },
            },
            xAxis: {
                type: 'category',
        // boundaryGap: false,
                data: config.xData,
            },
            yAxis: {
                name: config.yName || '',
                type: 'value',
                axisLabel: {
                    formatter: '{value}' + config.yUnit,
                },
            },
            series: series,
        };
    // y轴值上下浮动0.2
        option.yAxis.max = Math.max(...seriesAllData) + Math.max(...seriesAllData) * 0.2;
        let min = Math.min(...seriesAllData) - Math.min(...seriesAllData) * 0.2;
        if (min < 0) {
            min = 0;
        }
        option.yAxis.min = min;
        if (config.xData === 'day') {
            option.xAxis.data = xAxisDay();
            option.dataZoom = [
                {
                    type: 'slider',
                    show: true,
                    startValue: xAxisDay().length - 7,
                    endValue: xAxisDay().length - 1,
                    filterMode: 'filter',
                },
            ];
        }
        myChart.setOption(option);
    };

  /**
   * 配置饼图
   * @param ID : string echart id
   * @param config : obj 配置
   */
    echartsConfig.pieConfig = function(ID, config) {
        let myChart = echarts.init($('#' + ID)[0]); // 基于准备好的dom，初始化echarts实例
        let series = [];
        let seriesData = [];
        let obj = {};
        let obj1 = {};
        for (let i = 0; i < config.legend.length; i++) {
            obj = {
                name: config.legend[i],
                value: config.seriesData[i],
            };
            seriesData.push(obj);
        }
        obj1 = {
            type: 'pie',
            radius: '50%',
            data: seriesData,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
            },
        };
        series.push(obj1);
    // 指定图表的配置项和数据
        let option = {
            title: {
                text: config.title, // 标题
                textStyle: {
                    fontWeight: 'normal',
                    color: '#008ACD',
                },
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b} : {c} ({d}%)',
            },
            legend: {
                type: 'scroll',
                data: config.legend, // 图例
            },
            color: config.color,
            toolbox: {
                feature: {
                    saveAsImage: {},
                    right: '3%',
                },
            },
            series: series,
        };

        myChart.setOption(option);
    };

    /**
     * 配置混合图
     * @param ID : string echart id
     * @param config : obj 配置
     */
    echartsConfig.mixConfig = function(ID, config) {
        let myChart = echarts.init($('#' + ID)[0]); // 基于准备好的dom，初始化echarts实例
        // 指定图表的配置项和数据
        let option = {
            title: {
                text: config.title, // 标题
                textStyle: {
                    fontWeight: 'normal',
                    color: '#008ACD',
                },
            },
            color: config.color,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999',
                    },
                },
            },
            legend: {
                type: 'scroll',
                data: config.legend, // 图例
            },
            toolbox: {
                feature: {
                    saveAsImage: {},
                    magicType: {
                        type: ['line', 'bar'],
                    },
                    right: '3%',
                },
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: config.xData,
                axisPointer: {
                    type: 'shadow',
                },
            },
            yAxis: config.yAxis,
            series: config.seriesData,
        };
        if (config.xData === 'day') {
            option.xAxis.data = xAxisDay();
            option.dataZoom = [
                {
                    type: 'slider',
                    show: true,
                    startValue: xAxisDay().length - 7,
                    endValue: xAxisDay().length - 1,
                    filterMode: 'filter',
                },
            ];
        }
        myChart.setOption(option);
    };

    /**
     * 配置动态时间图
     * @param ID : string echart id
     * @param config : obj 配置
     */
    echartsConfig.dynamicTimeConfig = function(ID, config) {
        let seriesAllData = [];
        echarts.dispose($('#' + ID)[0]);
        let myChart = echarts.init($('#' + ID)[0]); // 基于准备好的dom，初始化echarts实例
        // 指定图表的配置项和数据
        let option = {
            title: {
                text: config.title, // 标题
                textStyle: {
                    fontWeight: 'normal',
                    color: '#008ACD',
                },
            },
            color: config.color,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                },
            },
            legend: {
                type: 'scroll',
                data: config.legend, // 图例
            },
            toolbox: {
                feature: {
                    saveAsImage: {},
                    // magicType: {
                    //     type: ['line', 'bar'],
                    // },
                    right: '3%',
                },
            },
            xAxis: {
                // type: 'value',
                type: 'time',
                // boundaryGap: true,
                splitLine: {
                    show: false,
                },
            },
            yAxis: config.yAxis,
            series: config.seriesData,
        };
        if (config.float) {
            for (let i = 0; i < option.series.length; i++) {
                let seriesData = [];
                for (let j = 0; j < option.series[i].data.length; j++) {
                    seriesData.push(option.series[i].data[j].value[1]);
                }
                seriesAllData.push(seriesData);
            }
            for (let i = 0; i < seriesAllData.length; i++) {
                let max = Math.max(...seriesAllData[i]) + Math.max(...seriesAllData[i]) * 0.2;
                option.yAxis[i].max = max.toFixed(0);
                let min = Math.min(...seriesAllData[i]) - Math.min(...seriesAllData[i]) * 0.2;
                if (min < 0) {
                    min = 0;
                }
                option.yAxis[i].min = min.toFixed(0);
            }
        }
        myChart.setOption(option);
    };

    echartsConfig.seriesUpDate = function(ID, data) {
        let myChart = echarts.getInstanceByDom($('#' + ID)[0]);
        myChart.setOption({
            series: data,
        });
    };

    echartsConfig.setAxis = function(ID, data) {
        let myChart = echarts.getInstanceByDom($('#' + ID)[0]);
        myChart.setOption({
            xAxis: data,
        });
    };

  // 获取本月到当前日期
    function xAxisDay() {
        let d = new Date();
        let arr = [];
        d = d.getDate();
        let m = new Date();
        m = m.getMonth() + 1;
        if (m < 10) {
            m = '0' + m;
        }
        let y = new Date();
        y = y.getFullYear();
        for (let i = 1; i <= d; i++) {
            if (i < 10) {
                i = '0' + i;
            }
            arr.push(y + '-' + m + '-' + i);
        }
        return arr;
    }
});
