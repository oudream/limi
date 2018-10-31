/**
 * Created by nielei on 2018/5/4.
 */
'use strict';
define(['jquery', 'action'], function($) {
    let oSvg = {
        init: function() {
            load_svg();
        },
    };

    function getUrlPram(name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        let url = window.location.href;
        let index = url.indexOf('?');

        let r = url.substring(index+1).match(reg);
        if (r != null) return (r[2]); return null;
    }

    function load_svg() {
        let arr = getUrlPram('svg');
        if (arr ===null) arr = sessionStorage.getItem('tbName');
        let arrs = [];
        arrs = arr.split('!');
        let projectName = sessionStorage.getItem('projectName');
        let svgFullPath = '/ics/' + projectName + '/img/svg/' + arrs[0] + '.svg';
        $('#ShowSvg').load(svgFullPath);
        if (arrs[1]) {
            arrs[1] = arrs[1].replace(/%22/g, '\"');
            arrs[1] = JSON.parse(arrs[1]);
            $('#ShowSvg').click(function(e) {
                if (e.target.id) {
                    arrs[1]['targetID'] = e.target.id;
                } else {
                    arrs[1]['targetID'] = e.target.parentNode.id;
                }

                action.register(arrs[1]);
            });
        }
        // $.getJSON(configUrl, function(data) {
        //      let svgFullPath =  '/ics/' + projectName + '/img/svg/'+ data.svgName;
        //      $("#ShowSvg").load(svgFullPath);
        // });
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
