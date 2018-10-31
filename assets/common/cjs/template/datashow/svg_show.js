/**
 * Created by nielei on 2018/5/4.
 */
'use strict';
define(['jquery', 'global', 'async', 'd3', 'jqGrid', 'panelConfig', 'uix-date', 'jqGridConfig', 'action', 'cjcommon', 'cjstorage', 'cjdatabaseaccess', 'cjajax', 'treeConfig', 'utils', 'cache', 'jqGridExtension'], function($, g, async, d3) {
    let gDb = null;
    let gReqParam = null;
    // let iUserID = sessionStorage.getItem('s_user_ID');
    let aSignal = [];
    let aNeCfg= JSON.parse(sessionStorage.getItem('neConfig'));
    let aSigalUrl= JSON.parse(sessionStorage.getItem('signalUrl'));

    let oSvg = {
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
            // svgInit();
        },
    };

    function analysisSvgJson(id, value, cfg, svgMeasure, obj) {
        cfg.forEach(item =>{
            if (item.id === id) {
                item.conditions.forEach(items => {
                    if (items.condition) {
                        switch (items.condition){
                            case '>':
                                if (Number(value) > items.value) {
                                    setSvgAttr (svgMeasure, items.action, obj)
                                }
                                break;
                            case '>=':
                                if (Number(value) >= items.value) {
                                    setSvgAttr (svgMeasure, items.action, obj)
                                }
                                break;
                            case '<':
                                if (Number(value) < items.value) {
                                    setSvgAttr (svgMeasure, items.action, obj)
                                }
                                break;
                            case '<=':
                                if (Number(value) < items.value) {
                                    setSvgAttr (svgMeasure, items.action, obj)
                                }
                                break;
                            case '=':
                                if (Number(value) === items.value) {
                                    setSvgAttr (svgMeasure, items.action, obj)
                                }
                                break;
                            default:
                                if (Number(value) === items.value) {
                                    setSvgAttr (svgMeasure, items.action, obj)
                                }
                                break;
                        }
                    } else {
                        setSvgAttr (svgMeasure, items.action, obj)
                    }
                })
            }
        })
    }

    function getUrlPram(name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return (r[2]); return null;
    }
    async function load_svg() {
        let arr = getUrlPram('json');
        if (arr ===null) arr = sessionStorage.getItem('tbName');
        let arrs = arr.split('!');
        let projectName = sessionStorage.getItem('projectName');
        let configUrl = '/ics/' + projectName + '/config/template_config/' + arrs[0] + '.json';
        let cfg = await $.getJSON(configUrl);
        analysisSvgJson(cfg.actions);
    }

    function setSvgAttr (svg, attr, obj) {
        if (attr.hasOwnProperty('attr')) {
            let arr = attr.attr.split(':');
            if (arr[0] === 'fillRandom') {
                let a = '#' + (Date.now() % 0xffffff).toString(16);
                svg.attr('fill', a);
            } else {
                svg.attr(arr[0], arr[1])
            }

        }
        if (attr.hasOwnProperty('text')) {
            svg.text(attr.text)
        }
        if (attr.hasOwnProperty('style')) {
            svg.style(attr.style)
        }
        if (attr.hasOwnProperty('next') || attr.hasOwnProperty('method')) {
            svg.on('click', function () {
                if (attr.hasOwnProperty('method')) {
                    attr.method['code'] = obj.code;
                    attr.method['url'] = obj.url;
                    action.register(attr.method);
                }
                if (attr.hasOwnProperty('next')) {
                    window.location = attr.next;
                }
            })
        }
    }

    // function setSvgMethod(svg) {
    //     svg.next = function () {
    //
    //     }
    // }
    /**
     * 模块返回调用接口
     */
    // oSvg.init();
    return {
        beforeOnload: function() {
        },
        onload: function() {
            oSvg.init();
        },
    };
});
