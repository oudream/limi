/**
 * Created by nielei on 2018/5/4.
 */
'use strict';

define(['jquery', 'global', 'async','d3','jqGrid', 'panelConfig', 'uix-date', 'jqGridConfig', 'action', 'cjcommon', 'cjstorage', 'cjdatabaseaccess', 'cjajax', 'treeConfig', 'utils', 'cache', 'jqGridExtension'], function($, g, async,d3) {
    let gDb = null;
    let gReqParam = null;
    let iUserID = sessionStorage.getItem('s_user_ID');
    let aSignal = [];
    let aNeCfg=[];
    let aSigalUrl=[];

    var oSvg = {
        init: function() {
            let db = window.top.cjDb;
            gDb = db;
            let serverInfo = cacheOpt.get('server-config');
            let reqHost = serverInfo['server']['ipAddress'];
            let reqPort = serverInfo['server']['httpPort'];
            let reqParam = {
                reqHost: reqHost,
                reqPort: reqPort,
            };
            gReqParam = reqParam;

            loadNecfg();
            // loadSinalUrl();
            // svgInit();
        },
    };

    function loadNecfg() {
        let sSql = 'select NeNo,NeAlias from omc_neconfig';
        gDb.load(sSql, function fn(err, val) {
            if (err) {
                console.log(err);
            } else {
                if (val.length === 0) {
                    alert('neconfig为空，请检查！');
                } else {
                    for (let i = 0; i < val.length; i++) {
                        aNeCfg[i] = {
                            NeNo: val[i].NeNo,
                            Name: val[i].NeAlias,
                        }
                    }
                    loadSinalUrl();
                }
            }
        }, gReqParam);
    }
    function  loadSinalUrl(){
        let sSql = 'select * from omc_signalurl';
        gDb.load(sSql, function fn(err, val) {
            if (err) {
                console.log(err);
            } else {
                if (val.length === 0) {
                    alert('omc_signalurl为空，请检查！');
                } else {
                    for (let i = 0; i < val.length; i++) {
                        aSigalUrl[i] = {
                            NeNo: val[i].NeNo,
                            SignalUrl: val[i].SignalUrl,
                            SignalNo:val[i].SignalNo,
                        }
                    }
                    svgInit();
                }
            }
        }, gReqParam);
    }
    /**
     * 初始化svg
     */
    function svgInit() {
        var svgIds = d3.select("svg").selectAll("[id]");
        let temp = 0;
        svgIds.each(function(d, i) {
            var name = this.id;
            var index = name.toUpperCase().indexOf("URI-");
            if (index >= 0) {
                var arr = name.substring(index+4).split("-");
                if (arr.length === 1)  //URI-YG550H01_YX_0001
                {
                    aSignal[temp] ={
                        Name:name,
                        id:-1,
                        v:-1,
                        t:0,
                        q:0,
                        res:0,
                        NeNo:-1,
                        SignalUrl:arr[0],
                        NeName:"",
                        type:1
                    };
                }
                else if (arr.length === 2) //URI-ZYJ01-YG550H_YX_0001
                {
                    aSignal[temp] ={
                        Name:name,
                        id:-1,
                        v:-1,
                        t:0,
                        q:0,
                        res:0,
                        NeNo:-1,
                        SignalUrl:arr[1],
                        NeName:arr[0],
                        type:2
                    };
                    temp ++;
                }
            }
            else
            {
                index = name.toUpperCase().indexOf("MID-");  //MID-0x1000000000,MID-1234567890
                if (index >= 0) {
                    var arr = name.split("-");
                    if (arr.length === 2) {
                        var mid = 0;
                        if (arr[1].toLowerCase().indexOf("0x") >= 0) //MID-0x1000000000
                            mid = parseInt(arr[1].substring(index + 2),16);
                        else  mid = parseInt(arr[1],10); //MID-1234567890

                        if(mid>0)
                        {
                            aSignal[temp] = {
                                Name: name,
                                id: mid,
                                v: -1,
                                t: 0,
                                q: 0,
                                res: 0,
                                NeNo: -1,
                                SignalUrl: "",
                                NeName: "",
                                type: 3
                            };
                            temp++;
                        }
                    }
                }
            }
        });

        if(aSignal.length>0)
        {
            initData();
            dataShow();
        }
    }
    /**
     * 初始化数据
     */

    function initData() {

        for (let i = 0; i < aSignal.length; i++) {
            var neno=0;
            if(aSignal[i].type === 1)//URI-YG550H01_YX_0001
            {
                for(let k =0;k<aSigalUrl.length;k++)
                {
                    if (aSigalUrl[k].SignalUrl ==  aSignal[i].SignalUrl )
                    {
                        aSignal[i].id   = aSigalUrl[k].SignalNo;
                        aSignal[i].NeNo = aSigalUrl[k].NeNo;
                        break;
                    }
                }
            }
            else if(aSignal[i].type === 2) //URI-ZYJ01-YG550H_YX_0001
            {
                for(let j =0;j<aNeCfg.length;j++)
                {
                    if(aNeCfg[j].Name==aSignal[i].NeName)
                    {
                        aSignal[i].NeNo = aNeCfg[j].NeNo;
                        break;
                    }
                }
                if(aSignal[i].NeNo != -1)
                {
                    for(let k =0;k<aSigalUrl.length;k++)
                    {
                        if (aSigalUrl[k].NeNo == aSignal[i].NeNo && aSigalUrl[k].SignalUrl ==  aSignal[i].SignalUrl )
                        {
                            aSignal[i].id = aSigalUrl[k].SignalNo;
                            break;
                        }
                    }
                }
            }
            else if(aSignal[i].type === 3) // MID-0x1000000000,MID-1234567890
            {
                for(let k =0;k<aSigalUrl.length;k++)
                {
                    if (aSigalUrl[k].SignalNo == aSignal[i].id )
                    {
                        aSignal[i].SignalUrl   = aSigalUrl[k].SignalUrl;
                        aSignal[i].NeNo = aSigalUrl[k].NeNo;
                        break;
                    }
                }
            }
        }
    }

    /**
     * 数据展示
     */
    function dataShow() {
        let aData = [];
        let nCallBackCount = 1;

        for (let i = 0; i < aSignal.length; i++) {
            if(aSignal[i].NeNo != -1) cc4k.rtdb.appendMeasureByNenoCode(aSignal[i].NeNo, aSignal[i].SignalUrl);
        }
        cc4k.rtdb.startSyncMeasures();
        //回调函数
        cc4k.rtdb.registerMeasuresChangedCallback(function() {
            //获取数据
            let aMeasure = [];
            for (let i = 0; i < aSignal.length; i++) {
                aMeasure.push(cc4k.rtdb.findMeasureByNenoCode(aSignal[i].NeNo, aSignal[i].SignalUrl));
            }

            //赋值到本地缓冲区
            for (let i = 0; i < aMeasure.length; i++)
            {
                if (!aMeasure[i]) {
                    continue;
                }
                for (let j = 0; j < aSignal.length; j++)
                {
                    if (aMeasure[i].id === aSignal[j].id)
                    {
                         aSignal[j].v  = aMeasure[i].value;
                         aSignal[j].t  = aMeasure[i].refreshTime;
                         aSignal[j].res = aMeasure[i].res;
                         break;
                    }
                }
            }

            if (nCallBackCount === 1) {
                aData = aSignal.concat();
                loadData(aData,nCallBackCount);
                nCallBackCount++;
            } else {
                aData = aSignal.concat();
                loadData(aData,nCallBackCount);
            }
        });
    }
    /**
     * 加载数据
     */
    function loadData(aData,cbCount) {

        for (let i = 0; i < aSignal.length; i++)
        {
            var iMid = Number(aSignal[i].id);
            var svgMeasure = d3.select("[id="+aSignal[i].Name+"]");
            try
            {
                switch (cc4k.rtdb.getMeasureTypeById(iMid))
                {
                    case cc4k.rtdb.EnumMeasureType.monsb:
                    {
                    //     svgMeasure.attr("fill" function () {
                    //         var iColor
                    //         return iCol;
                    // });

                        var iRemain = Number(aSignal[i].v) % 3;
                        if (iRemain==0)
                            svgMeasure.attr("fill", "#ff0000");
                        else if (iRemain==1)
                            svgMeasure.attr("fill", "#00ff00");
                        else
                            svgMeasure.attr("fill", "#0000ff");
                     }
                        break;
                    case cc4k.rtdb.EnumMeasureType.ycadd:
                    {
                        svgMeasure.text(aSignal[i].v);
                    }
                        break;
                    case cc4k.rtdb.EnumMeasureType.straw:
                    {
                        svgMeasure.text(aSignal[i].v);
                    }
                        break;
                    default:
                        break;
                }
            }
            catch (er)
            {
            }
         }
    }
    /**
     * 模块返回调用接口
     */
    return {
        beforeOnload: function() {
        },
        onload: function() {
            oSvg.init();
        },
    };
});
