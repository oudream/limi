/**
 * Created by liuchaoyu on 2016-10-13.
 */

gCommon = {
    curPageId : '',
};

$(function () {

    if (!window.icsCommon) {
        window.icsCommon = {};
    }

    var libFiles = [
        //'../ics/cj-storage.js',
        '../../../cjs/html/cj-common.js',
        //'../ics/cj-time.js',
        //'../ics/cj-string.js',
        //'../ics/cj-network.js',
        //'../../../cjs/html/cj-ajax.js',
        //'../ics/config.js',
        //'../ics/data-interaction.js',
        //'../ics/data-structure.js',
        //'../ics/data-storage.js',
        //'../ics/data-process.js',
    ];

    var jsFiles = [
        '../ics/js/add-start-init.js',
        '../ics/js/add-right-tools.js',
        '../ics/js/update-tools-panel.js',
        '../ics/js/sub-page-func.js',
        '../ics/js/load-end.js'
    ];

    var icsFunc = function () {
        $.each(jsFiles, function () {
            var jsName = this;

            //$.getScript(jsName.toString(), function(d) {
                // Fails locally in Chrome 5
                //if (!d) {
                    var s = document.createElement('script');
                    s.src = jsName;
                    document.querySelector('head').appendChild(s);
                //}
            //});
        });
    };

    var loadCss = function () {
        var head = $('head');
        head.append("<link rel=\"stylesheet\" href=\"../ics/ics-style.css\" type=\"text/css\"/>");
    };

    var loadLib = function () {
        $.each(libFiles, function () {
            var jsName = this;

            var s = document.createElement('script');
            s.src = jsName;
            document.querySelector('head').appendChild(s);

        });
    };

    setTimeout(loadLib,10);

    setTimeout(icsFunc,10);

    setTimeout(loadCss,250);
});