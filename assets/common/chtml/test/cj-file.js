/**
 * Created by liuchaoyu on 2016-07-15.
 */

let cjFile = {
    version: '1.0.1',
};

/**
 * 文件导出的函数
 * @param fileType ：导出文件的类型（ CSV,JSON ）
 * @param data ：导出的数据，CSV格式需传入二维数组，JSON格式需传入JSON对象
 * @param fileName ：文件名
 */
cjFile.out = function(fileType, data, fileName) {
    let outDataStr = '';
    let outType = '';

    if (fileType == 'csv') {
        if (Array.isArray(data) == false) {
            console.log('data参数不是一个数组!');
            return;
        }

        if (data.length == 0) {
            console.log('data数组为空!');
            return;
        }

        var dataStr = '';
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                dataStr += data[i][j];
                if (j < (data[i].length - 1)) {
                    dataStr += ',';
                }
            }

            if (i < (data.length - 1)) {
                dataStr += '\n';
            }
        }

        let exportContent = '\uFEFF';
        outDataStr = exportContent + dataStr;
        outType = 'text/csv;charset=utf-8';
    } else if (fileType == 'json') {
        if (typeof data === 'object') {

        } else {
            console.log('data参数不是一个对象!');
            return;
        }

        var dataStr = JSON.stringify(data);
        outDataStr = dataStr;
        outType = 'text/json;charset=utf-8';
    }

    let blob = new Blob([outDataStr], {type: outType});
    saveAs(blob, fileName);
};

/**
 * 文件导入的函数
 * @param fileType ：导入文件的格式（ CSV,JSON ）
 * @param file ：导入文件的file对象
 * @param deal_func ：获取数据回调函数，CSV文件以二维数组传入回调函数，JSON文件以对象传入回调函数
 * @returns {null} ：读取失败，返回null
 */
cjFile.in = function(fileType, file, deal_func) {
    if (window.FileReader) {
        let fileReader = new FileReader();

        fileReader.onload = (function(thisFile, type) {
            return function(evt) {
                let data;
                let msg = evt.target.result;

                if (type == 'csv') {
                    let rows = msg.split('\n');

                    let dataArray = [];
                    for (let i = 0; i < rows.length; i++) {
                        if (rows[i] != '') {
                            let cells = rows[i].split(',');
                            dataArray.push(cells);
                        }
                    }

                    data = dataArray;
                } else if (type == 'json') {
                    let jsonObj = JSON.parse(msg);

                    data = jsonObj;
                } else if (type == 'svg') {
                    data = msg;
                }

                deal_func(data, thisFile);
            };
        })(file, fileType);

        if (fileType == 'svg') {
            fileReader.readAsText(file);
        } else {
            fileReader.readAsText(file, 'gb2312');
        }
    } else {
        console.log('File Reader不支持,请使用Chrome浏览器');
        return null;
    }
};

cjFile.hiddenIn = function(fileType, filePath, deal_func) {
    if (fileType == 'xml') {
        d3.xml(filePath, deal_func);
    } else if (fileType == 'text') {
        d3.text(filePath, deal_func);
    }
};
