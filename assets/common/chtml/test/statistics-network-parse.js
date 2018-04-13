/**
 * Created by ygct on 2016/3/23.
 */


let StatisticsParse = {
    version: '1.0.0',
};

/*
 * parseHistogramData(str)  柱状图数据解析 返回对象
 * */
StatisticsParse.parseHistogramData = function(str) {
    return parseJson(str);
};

/*
 * parseHistogramData(str)  饼状图数据解析 返回对象
 * */
StatisticsParse.parsePieData = function(str) {
    return parseJson(str);
};

/*
 * parseHistogramData(str)  折线图数据解析 返回对象
 * */
StatisticsParse.parseLineData = function(str) {
    return parseJson(str);
};


/*
 * parseHistogramData(str)  仪表盘数据解析 返回对象
 * */
StatisticsParse.parseDashboardData = function(str) {
    return parseJson(str);
};


/*
 * parseJson(str)  解析json 返回对象
 * */
function parseJson(str) {
    let retArray = getDetectionJson(str);
    if (retArray==undefined) return;
    let dataArray = retArray.data;

    let x_dec = new Array();
    let AllDataArray = {};
    for (let j=0; j<retArray.f_name.length; j++) {
        AllDataArray[retArray.f_name[j]] = new Array();
    }
    for (let i=0; i<dataArray.length; i+=retArray.f_name.length) {
        x_dec.push(dataArray[i].g1);
        for (let m=0; m<retArray.f_name.length; m++) {
            AllDataArray[dataArray[i+m].g2].push(dataArray[i+m].data);
        }
    }
    let backData = {};
    backData.f_name = retArray.f_name;
    backData.x_dec = x_dec;
    backData.data = AllDataArray;
    return backData;
}


/*
 * inArrayHasPointData 查看数组里是否存在某个数据
 * */
function isArrayHasPointData(array, needle) {
    let ret_is = -1;
    for (let i=0; i<array.length; i++) {
        if (array[i] == needle) {
            ret_is = i;
            break;
        }
    }
    return ret_is;
}

/*
 *
 * findGroupgridName(jsonData)  获取所有的g2，返回数组
 *
 * */
function findGroupgridName(jsonData) {
    let nameArray = new Array();
    for (let i=0; i<jsonData.length; i++) {
        let ret = isArrayHasPointData(nameArray, jsonData[i].g2.toString());
        if (ret<0) {
            nameArray.push(jsonData[i].g2.toString());
        }
    }
    return nameArray;
}


/**
 * //遍历数据，缺少的数据补上
 * getDetectionJson(jsonArray)
 * */
function getDetectionJson(jsonArray) {
    if (jsonArray.length==0) return;
    let str = jsonArray[0].g1;
    let count = 0;
    let f_name = findGroupgridName(jsonArray);   // 先找出所以的g1名称
    let maxCount = f_name.length;  // 一个g下存在多少种数据
    let backArray = new Array();

    for (var i=0; i<jsonArray.length; i++) {
        if (str == jsonArray[i].g1)    // 依次以g1为基准，查看缺少什么数据
        {
            count++;
        } else {
            if (count<maxCount)   // 缺少多少个就依次加上添加
            {
                addLack(false);
            }
            count = 1;
            str = jsonArray[i].g1;
        }


        // 添加缺少的数据
        function addLack(islastOne) {
            let namehasArray = new Array();
            for (let nameCount = 0; nameCount<count; nameCount++)  // 倒回去查找哪个g1已经存在
            {
                if (islastOne) {
                    namehasArray.push(jsonArray[i-nameCount].g2);
                } else {
                    namehasArray.push(jsonArray[i-1-nameCount].g2);
                }
            }
            let nothasArray = new Array();
            for (let f_nameCount = 0; f_nameCount<maxCount; f_nameCount++) {
                let len = namehasArray.length;
                let found = false;
                for (let x =0; x<len; x++) {
                    if (namehasArray[x] == f_name[f_nameCount])  // 说明g1已经存在
                    {
                        found = true;    //
                        break;
                    }
                }
                if (!found) {
                    nothasArray.push(f_name[f_nameCount]);
                }
            }
            for (let j=0; j<nothasArray.length; j++) {
                let location = {};
                if (islastOne) {
                    location.g1 = jsonArray[i].g1;
                } else {
                    location.g1 = jsonArray[i-1].g1;
                }

                location.g2 = nothasArray[j];
                location.data = 0;
                backArray.push(location);
            }
        }
        backArray.push(jsonArray[i]);
        if (i+1==jsonArray.length && count!=maxCount)  // 最后一次时，因为循环已经结束所以再判断一次
        {
            addLack(true);
        }
    }
    let backClassArray = {};
    backClassArray.f_name = f_name;
    backClassArray.data = backArray;
    return backClassArray;
}


