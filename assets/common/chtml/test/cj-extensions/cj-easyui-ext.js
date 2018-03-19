/**
 * Created by liuchaoyu on 2016/12/12.
 *
 */
(function($) {
    window.cjExtEasyui = {};

    var cjExtEasyui = window.cjExtEasyui;

    cjExtEasyui.datagrid = {};

    cjExtEasyui.datagrid.adjustColWidth = function (parent, fieldName, width) {

        var dataTable = parent.find("div.datagrid-view2");

        var tds = dataTable.find('td')

        tds.each(function (index,td) {
            var field = $(td).attr('field');
            if (field == fieldName) {
                $(td).css('width',width);
                $(td).children('.datagrid-cell').css('width',width);
            }
        });

    }


    function setTabTitle (container, param) {
        var pp = param.tab;	// the tab panel
        var opts = pp.panel('options');	// get the tab panel options
        var tab = opts.tab;
        opts.title = param.title;
        var titleObj = tab.find("span.tabs-title");
        titleObj.html(param.title);
    }

    function getTabIcs (container, id) {
        var tabs = $.data(container, 'tabs').tabs;
        var tab = null;

        for(var i=0; i<tabs.length; i++) {
            var pp = tabs[i];
            var opts = pp.panel('options');	// get the tab panel options
            if (opts.id == id) {
                tab = pp;
                break;
            }
        }

        return tab;
    }

    function exists(container, which) {
        return getTabIcs(container, which) != null;
    }

    function selectTab(container, which){
        var p = getTabIcs(container, which);
        if (p && !p.is(':visible')){

            $(container).children('div.tabs-panels').each(function(){
                $(this).stop(true, true);
            });

            if (!p.panel('options').disabled){
                p.panel('open');
            }
        }
    }


    $.extend($.fn.tabs.methods, {
        setTabTitle: function (jq, options) {
            return jq.each(function(){
                setTabTitle(this, options);
            });
        },

        getTabById: function (jq, which) {
            var tab;
            jq.each(function(){
                tab = getTabIcs(this, which);
            });
            return tab;
        },

        isExist: function (jq, which) {
            return exists(jq[0], which);
        },

        selectById: function (jq, which) {
            return jq.each(function(){
                selectTab(this, which);
            });
        }

    });




})(jQuery)