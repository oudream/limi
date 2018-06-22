/* Electron 兼容 jQuery */
if (typeof module === 'object') {
    window.module = module;
    module = undefined;
}

/* 获取根目录，  Electron 中  __dirname 为 html 文件绝对路径 */
let BASEURL = '/';

if (window.top['__dirname']) {
    BASEURL = window.top['__dirname'].split('\\');
    BASEURL = BASEURL.splice(0, BASEURL.length - 1).join('\\') + '\\';
}

let config = {
    baseUrl: BASEURL,
    paths: {
        'global': 'common/cjs/other/global',
        'jquery': 'common/3rd/jquery-2.1.1.min',
        // 'jquery': 'common/3rd/jquery-3.1.1',
        'd3': 'common/3rd/d3-4.4.1',
        'util': 'common/cjs/other/util',
        'uix': 'common/3rd/uix/uix.layout',
        'bootstrap': 'common/3rd/bootstrap-2.3.2/js/bootstrap-2.3.2',
        'server': 'common/cjs/other/server',
        'app': 'common/cjs/other/app',
        'es5': 'common/cjs/other/es5',
        'json': 'common/3rd/require-plus/json',
        'text': 'common/3rd/require-plus/text',
        'domready': 'common/cjs/other/domReady',
        'echart3': 'common/3rd/echarts-3.6.2/echarts',
    // 'angular': 'lib/angular/angular-1.2.32',
        'jquery.treegrid.bootstrap2': 'common/3rd/jquery.treegrid/jquery.treegrid.bootstrap2',
        'perfectScrollbar': 'common/3rd/perfect-scrollbar/js/perfect-scrollbar',
        'ztree': 'common/3rd/ztree-3.5.29/js/jquery.ztree.all',
        'bs.ics.modal': 'common/3rd/bootstrap.modal/bootstrap.modal',
        'MD5': 'common/cjs/other/md5',
        'bootstrap-date': 'common/3rd/bootstrap-datetimepicker-master/js/bootstrap-datetimepicker',
        'bootstrap-dateCN': 'common/3rd/bootstrap-datetimepicker-master/js/locales/bootstrap-datetimepicker.zh-CN',
        'uix-date': 'common/3rd/bootstrap-datetimepicker-master/js/uix-date',
        'drag': 'common/3rd/drag/drag',
        'jquery.cookie': 'common/3rd/jquery.cookie/jquery.cookie',
        'dataBind': 'common/3rd/jquery.dataBind/jquery.dataBind',
        'jqGrid': 'common/3rd/jqGrid-4.6.0/jquery.jqGrid.src',
        'padMake': 'common/3rd/pdfmake.min',
        'vfs_fonts': 'common/3rd/vfs_fonts',
    // 'bootstrap-select': 'lib/bootstrap-select/js/bootstrap-select',
        'contextMenu': 'common/cjs/contextmenu/contextmenu',
        'pickcolor': 'common/3rd/pick-a-color-master/src/js/pick-a-color',
        'papaparse': 'common/3rd/importCSV/papaparse',
        'jschardet': 'common/3rd/importCSV/jschardet',
        'base64': 'common/3rd/importCSV/base64',
        'ipmortCSV': 'common/3rd/importCSV/csv2arr',
        'exportCSV': 'common/3rd/importCSV/exportCSV',
    },
    shim: {
        'bs.ics.modal': {
            deps: ['css!' + BASEURL + 'common/3rd/bootstrap.modal/bootstrap.modal.css'],
        },
        'bootstrap': {
            deps: ['jquery', 'css!' + BASEURL + 'common/3rd/bootstrap-2.3.2/css/bootstrap-2.3.2.css'],
            exports: 'bootstrap',
        },
        'uix': {
            deps: ['jquery', 'css!' + BASEURL + 'common/3rd/uix/uix.layout.css'],
            exports: '$.uix',
        },
        'echart3': {
            exports: 'echart',
        },
    // 'angular': {
    //   deps: ['jquery'],
    //   exports: 'angular'
    // },
        'jquery.treegrid.bootstrap2': {
            deps: ['jquery',
                BASEURL + 'common/3rd/jquery.treegrid/jquery.treegrid.js',
                'css!' + BASEURL + 'common/3rd/jquery.treegrid/jquery.treegrid.css'],
            exports: '$.fn.treegrid',
        },
        'perfectScrollbar': {
            deps: ['jquery',
                'css!' + BASEURL + 'common/3rd/perfect-scrollbar/css/perfect-scrollbar.min.css'],
            exports: '$.fn.perfectScrollbar',
        },
        'ztree': {
            deps: ['jquery', 'css!' + BASEURL + 'common/3rd/ztree-3.5.29/css/metro.css'],
            exports: '$.fn.zTree',
        },
        'bootstrap-dateCN': {
            deps: ['jquery', 'bootstrap', 'bootstrap-date', 'css!' + BASEURL + 'common/3rd/bootstrap-datetimepicker-master/css/bootstrap-datetimepicker.css'],
            exports: 'bootstrap-date',
        },
        'drag': {
            deps: ['jquery', 'css!' + BASEURL + 'common/3rd/drag/drag.css'],
            exports: 'drag',
        },
        'jqGrid': {
            deps: [
                BASEURL + 'common/3rd/jqGrid-4.6.0/grid.locale-cn.js',
                'css!' + BASEURL + 'common/3rd/jqGrid-4.6.0/jquery-ui-1.8.16.custom.css',
                'css!' + BASEURL + 'common/3rd/jqGrid-4.6.0/ui.jqgrid.css',
            ],
            exports: '$.fn.jqGrid',
        },
    // 'pickcolor': {
    //   deps: [
    //     BASEURL + 'lib/pick-a-color-master/build/dependencies/tinycolor-0.9.15.min.js',
    //     'css!' + BASEURL + 'lib/pick-a-color-master/build/1.2.3/css/pick-a-color-1.2.3.min.css',
    //     'css!' + BASEURL + 'lib/pick-a-color-master/src/css/pickcolor.sinopec.css',
    //     'bootstrap',
    //     'jquery'
    //   ],
    //   exports: 'pickcolor'
    // }
    },
    waitSeconds: 15,
    map: {
        '*': {
            'css': BASEURL + 'common/3rd/require-plus/css.js',
        },
    },
    deps: ['app', 'es5'],
  // urlArgs: "bust=" + (new Date()).getTime(),
    callback: function(app) {
    /* Electron 兼容 jQuery */
        if (window.module) module = window.module;

        app.log('app - 启动完成');
    },
};

// 重命名 Electron 提供的 require
if (!window.nodeRequire) {
    window.nodeRequire = window.top.nodeRequire;
    delete window.require;
    delete window.exports;
    delete window.module;
}

// let _tmp = window.location.pathname.split('/');
// let pageName = _tmp[_tmp.length - 1];
//
// if (pageName === 'addDevice.html') {
// 	requirejs.config(config);
// }
// else {
requirejs([BASEURL + 'common/cjs/require/ics-main.js'], function(ics) {
    ics.loadIcsMain(config);
    console.log(config);
    requirejs.config(config);
});
