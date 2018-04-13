/**
 * Created by liuchaoyu on 2017-03-17.
 */

define(function() {
    function init(config) {
        /* 获取根目录，  Electron 中  __dirname 为 html 文件绝对路径 */
        let URL = '../../../../';
        if (window.top['__dirname']) {
            URL = window.top['__dirname'].split('\\');
            URL = URL.splice(0, URL.length - 1).join('\\') + '\\';
        }

        let _config = {
            paths: {
                'cjcommon': 'common/cjs/web/common/cj-common',
                // 'cjdatabase': URL + 'cjs/cjs/nodejs/cj-database',
                'cjdatabaseaccess': 'common/cjs/web/database/cj-database-access',
                'cjstorage': 'common/cjs/web/storage/cj-storage',
                'cjajax': 'common/cjs/web/ajax/cj-ajax',
                'loadNode': 'common/cjs/web/other/loadNode',
                'structure': 'common/cjs/web/common/structure',
                'model': 'common/cjs/web/common/model',
                'view': 'common/cjs/web/common/view',
                'controller': 'common/cjs/web/common/controller',
                'utils': 'common/cjs/web/common/utils',
                'jqGridConfig': 'common/cjs/web/jqGrid/jqGrid-config',
                'echartConfig': 'common/cjs/web/echarts/echarts-config',
                'panelConfig': 'common/cjs/web/panel/panelConfig',
                'action': 'common/cjs/web/common/action',
                'alarmModal': 'ics/sinopec/js/custom/alarmModal',
                'registerListener': 'ics/sinopec/js/custom/register-listener',
                'sinopec_authority': 'ics/sinopec/js/authority/authority',
                'omc_authority': 'ics/omc/js/authority/authority',
                'cache': 'common/cjs/web/storage/cache',
                'treeManager': 'common/cjs/web/z-tree/tree-manager',
                'treeConfig': 'common/cjs/web/z-tree/tree-config',
                'async': 'common/3rd/async/async.min',
                'jqGridExtension': 'common/cjs/web/jqGrid/jqGrid-extension',
                'ics_app': 'common/cjs/web/common/ics-app',
            },
            shim: {
                'cjcommon': {},
                'cjstorage': {},
                'loadNode': {},
                'structure': {},
                'model': {},
                'view': {},
                'controller': {},
                'utils': {},
                'treeManager': {},

            },

        };

        for (let t in _config.paths) {
            config.paths[t] = _config.paths[t];
        }

        for (let t in _config.shim) {
            config.shim[t] = _config.shim[t];
        }

        config.deps.push('ics_app');

        console.log(config.paths);
    }

    return {
        loadIcsMain: init,
    };
});
