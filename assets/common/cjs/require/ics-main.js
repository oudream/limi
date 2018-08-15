/**
 * Created by liuchaoyu on 2017-03-17.
 */

define(function() {
    function init(config) {
        /* 获取根目录，  Electron 中  __dirname 为 html 文件绝对路径 */
        let URL = '../../../';
        if (window.top['__dirname']) {
            URL = window.top['__dirname'].split('\\');
            URL = URL.splice(0, URL.length - 1).join('\\') + '\\';
        }

        let _config = {
            paths: {
                'cjcommon': 'common/cjs/common/cj-common',
                // 'cjdatabase': URL + 'cjs/cjs/nodejs/cj-database',
                'cjdatabaseaccess': 'common/cjs/database/cj-database-access',
                'cjstorage': 'common/cjs/storage/cj-storage',
                'cjajax': 'common/cjs/ajax/cj-ajax',
                'loadNode': 'common/cjs/other/loadNode',
                'structure': 'common/cjs/common/structure',
                'model': 'common/cjs/common/model',
                'view': 'common/cjs/common/view',
                'controller': 'common/cjs/common/controller',
                'utils': 'common/cjs/common/utils',
                'jqGridConfig': 'common/cjs/jqGrid/jqGrid-config',
                'echartConfig': 'common/cjs/echarts/echarts-config',
                'panelConfig': 'common/cjs/panel/panelConfig',
                'comAction': 'common/cjs/common/action',
                'action': 'common/cjs/common/actionRoute',
                // 'alarmModal': 'ics/sinopec/js/custom/alarmModal',
                'registerListener': 'ics/sinopec/js/custom/register-listener',
                'sinopec_authority': 'ics/sinopec/js/authority/authority',
                'omc_authority': 'ics/omc/js/authority/authority',
                'cache': 'common/cjs/storage/cache',
                'watch': 'common/cjs/watch',
                'treeManager': 'common/cjs/z-tree/tree-manager',
                'treeConfig': 'common/cjs/z-tree/tree-config',
                'modal': 'common/cjs/components/modal/modal',
                'async': 'common/3rd/async/async.min',
                'jqGridExtension': 'common/cjs/jqGrid/jqGrid-extension',
                'ics_app': 'common/cjs/common/ics-app',
                'asm550c_authority': 'ics/asm550c/js/authority/authority',
                'neConfig': 'ics/systemInit/config/neConfig',
                'templates': 'common/cjs/template/templates',
                'analysis': 'common/cjs/analysis/analysis',
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
                'modal': {
                    deps: ['css!' + URL + 'common/ccss/modal.css'],
                },

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
