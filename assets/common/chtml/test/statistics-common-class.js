/**
 * Created by liuchaoyu on 2016-04-06.
 */


/*
 * Echarts图表option基类
 */
let cjEchartsOptionBaseClass = {
    createNew: function() {
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
        obj.legend = {
            'data': [],
        };
        obj.series = [];

        obj.setTitle = function(text, subText, x) {
            obj.title.text = text;
            obj.title.subtext = subText;
            if ( x != undefined ) {
                obj.title.x = x;
            }
        };

        obj.findInArray = function(array, elem) {
            if ( array == null || array.length == 0 ) {
                return false;
            }
            for ( let i = 0; i < array.length; i++ ) {
                if ( elem == array[i] ) {
                    return true;
                }
            }

            return false;
        };

        return obj;
    },
};


/*
 * Echarts柱状图的option通用类 : 从图表基类继承过来
 */
let cjEchartsHistOptionClass = {
    createNewWithParams: function() {

    },
    createNew: function() {
        let obj = cjEchartsOptionBaseClass.createNew();
        obj.tooltip.trigger = 'axis';

        obj.toolbox = {
            'show': true,
            'feature': {
                'dataView': {show: false, readOnly: false},
                'magicType': {show: true, type: ['line', 'bar']},
                'restore': {show: true},
                'saveAsImage': {show: true},
            },
        };
        obj.calculable = true;

        let xAxis = {
            'name': '',
            'type': 'category',
            'data': [],
        };

        let yAxis = {
            'name': '',
            'type': 'value',
            'data': [],
        };

        obj.xAxis = [xAxis];
        obj.yAxis = [yAxis];

        function Series(name, type, data) {
            this.name = name;
            if ( type == '' ) {
                this.type = 'bar';
            } else {
                this.type = type;
            }

            this.data = data;
            this.markPoint = {
                'data': [
                    {'type': 'max', 'name': '最大值'},
                    {'type': 'min', 'name': '最小值'},
                ],
            };
            this.markLine = {
                'data': [
                    {'type': 'average', 'name': '平均值'},
                ],
            };
        };

        obj.setXaxis = function(data, name) {
            xAxis.data = data;
            xAxis.name = name;
        };

        obj.setYaxis = function(name) {
            yAxis.name = name;
        };

        obj.setSeries = function(type, data, map) {
            if ( data && data.length && data.length > 0 ) {
                let needConvert = true;
                if ( map == undefined ) {
                    needConvert = false;
                }

                let dataModel = {};
                let noneData = {};
                let legendData = [];
                for (var i = 0; i < data.length; i++) {
                    if ( needConvert == true ) {
                        if (this.findInArray(legendData, map[data[i].g2]) == false) {
                            var dataName = map[data[i].g2];
                            legendData.push(dataName);
                        }
                    } else {
                        if (this.findInArray(legendData, data[i].g2) == false) {
                            var dataName = data[i].g2;
                            legendData.push(dataName);
                        }
                    }
                }

                for ( var i = 0; i < legendData.length; i++ ) {
                    dataModel[legendData[i]] = [];
                }

                for ( var i = 0; i < obj.xAxis[0].data.length; i++ ) {
                    for ( var j = 0; j < legendData.length; j++ ) {
                        noneData[legendData[j]] = false;
                    }
                    for (var j = 0; j < data.length; j++) {
                        if ( obj.xAxis[0].data[i] == data[j].g1 ) {
                            if ( needConvert == true ) {
                                if ( dataModel[map[data[j].g2]].length > i ) {
                                    dataModel[map[data[j].g2]][i] += data[j].data;
                                } else {
                                    dataModel[map[data[j].g2]].push(data[j].data);
                                }
                                noneData[map[data[j].g2]] = true;
                            } else {
                                dataModel[data[j].g2].push(data[j].data);
                                noneData[data[j].g2] = true;
                            }
                        }
                    }
                    for ( var j = 0; j < legendData.length; j++ ) {
                        if ( noneData[legendData[j]] == false ) {
                            dataModel[legendData[j]].push(0);
                        }
                    }
                }

                obj.legend.data = legendData;

                for ( var i = 0; i < obj.legend.data.length; i++ ) {
                    let series = new Series(obj.legend.data[i], type, dataModel[obj.legend.data[i]]);
                    obj.series.push(series);
                }
            }
        };

        return obj;
    },
};


/*
 * Echarts折线图的option通用类 : 从柱状图继承过来
 */
let cjEchartsLineOptionClass = {
    createNew: function() {
        let obj = cjEchartsHistOptionClass.createNew();

        return obj;
    },
};

/*
 * Echarts饼图的option通用类：从基类继承过来
 */
let cjEchartsPieOptionClass = {
    createNew: function() {
        let obj = cjEchartsOptionBaseClass.createNew();

        obj.tooltip.trigger = 'item';
        obj.tooltip.formatter = '{a} <br/>{b} : {c} ({d}%)';
        obj.legend.orient = 'vertical';
        obj.legend.left = 'left';

        function Series(name, type, data) {
            this.name = name;
            if ( type == '' ) {
                this.type = 'pie';
            } else {
                this.type = type;
            }

            this.radius = '55%';
            this.center = ['50%', '60%'];

            this.data = data;
            this.itemStyle = {
                'emphasis': {
                    'shadowBlur': 10,
                    'shadowOffsetX': 0,
                    'shadowColor': 'rgba(0, 0, 0, 0.5)',
                },
            };
        }

        obj.setSeries = function(type, data, map) {
            if ( data && data.length && data.length > 0 ) {
                let needConvert = true;
                if ( map == undefined ) {
                    needConvert = false;
                }

                let dataModel = {};
                let legendData = [];
                for (var i = 0; i < data.length; i++) {
                    if ( needConvert == true ) {
                        if (this.findInArray(legendData, map[data[i].g2]) == false) {
                            var dataName = map[data[i].g2];
                            legendData.push(dataName);
                        }
                    } else {
                        if (this.findInArray(legendData, data[i].g2) == false) {
                            var dataName = data[i].g2;
                            legendData.push(dataName);
                        }
                    }
                }

                for ( var i = 0; i < legendData.length; i++ ) {
                    dataModel[legendData[i]] = 0;
                }

                // for( var i = 0; i < legendData.length; i++ ) {
                for (let j = 0; j < data.length; j++) {
                    if ( needConvert == true ) {
                        dataModel[map[data[j].g2]] += data[j].data;
                    } else {
                        dataModel[data[j].g2] += data[j].data;
                    }
                }
                // }

                obj.legend.data = legendData;

                let dataArray = [];
                function Data(name, value) {
                    this.name = name;
                    this.value = value;
                }

                for ( var i = 0; i < obj.legend.data.length; i++ ) {
                    let dataObj = new Data(obj.legend.data[i], dataModel[obj.legend.data[i]]);
                    dataArray.push(dataObj);
                }

                let series = new Series('', type, dataArray);
                obj.series.push(series);
            }
        };

        return obj;
    },
};


/*
 * Echarts仪表盘的option通用类：从基类继承过来
 */
let cjEchartsDashBoardOptionClass = {
    createNew: function() {
        let obj = cjEchartsOptionBaseClass.createNew();

        obj.tooltip.formatter = '{a} <br/>{b} : {c}%';

        obj.totalCount = 0;

        function Series(name, type, data) {
            this.name = name;
            if ( type == '' ) {
                this.type = 'gauge';
            } else {
                this.type = type;
            }

            this.detail = {
                'formatter': '{value}%',
            };

            this.data = [data];
        }


        obj.setSeries = function(type, data, name) {
            function Data(name, value) {
                this.value = value;
                this.name = name;
            }

            if ( data && data.length && data.length > 0 ) {
                let dividend = data[0].data;
                let value = (dividend/obj.totalCount).toFixed(2);
                let dataObj = new Data(name, value);

                let series = new Series(name, type, dataObj);

                obj.series.push(series);
            }
        };

        return obj;
    },
};
