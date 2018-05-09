/**
 * Created by nielei on 2018/3/5.
 */
'use strict';
let treeConfig = {

};

define(['jquery', 'ztree'], function($) {
  /**
   * 初始化树
   * @param ID : string zTree id
   * @param setting : obj 配置
   * @param node : obj 节点数据
   */
    treeConfig.initTree = function(ID, setting, node) {
        let myTree = $('#' + ID);
        let zSetting = {
            data: {
                simpleData: {
                    enable: true,
                },
            },
            view: {
                showIcon: true,
            },
            check: {
                enable: false,
            },
        };
    // ztree 是否需要复选框
        if (setting.check !== undefined || setting.check === true) {
            zSetting.check['enable'] = true;
        }
    // zTree 是否有回调函数
        if (setting.callBack) {
            zSetting.callback = setting.callBack;
        }
        $.fn.zTree.init(myTree, zSetting, node);
    };
});
