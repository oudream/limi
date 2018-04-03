/**
 * Created by liuchaoyu on 2016-10-25.
 *
 * add-start-init.js
 *
 * 添加加载后初始化界面，清空上次留下的数据
 */

var pageDataInit = function () {

    /** 根据项目ID从后台下载页数据 */
    var pageId = cjCommon.getUrlParam('page_id');

    svgWorkArea.curPageId = pageId;




};



