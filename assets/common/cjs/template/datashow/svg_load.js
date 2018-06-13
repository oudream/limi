/**
 * Created by nielei on 2018/5/4.
 */
'use strict';
define(['jquery'], function($) {
    var oSvg = {
        init: function() {
            load_svg();
        },
    };
    function load_svg() {
        let arr = sessionStorage.getItem('tbName');
        let arrs = [];
        arrs = arr.split('!');
        let projectName = sessionStorage.getItem('projectName');
        let configUrl = '/ics/' + projectName + '/config/template_config/' + arrs[0] + '.json';
        $.getJSON(configUrl, function(data) {
             let svgFullPath =  '/ics/' + projectName + '/img/svg/'+ data.svgName;
             $("#ShowSvg").load(svgFullPath);
        });
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
