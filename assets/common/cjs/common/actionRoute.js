/**
 * Created by nielei on 2018/6/14.
 */
'use strict';

let action = {

};
let arr = ['comAction'];
define(arr, function() {
    action.register = function(data, tbID, tbName, def, g, copyData) {
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        let route = data.action;
        let nameSpaces = route.split('.');
        let projectName = sessionStorage.getItem('projectName');
        let url = '/ics/' + projectName + '/js/common/action.js';
        if (nameSpaces.length === 1) {
            comAct(data, tbID, tbName, def, g, copyData);
        } else {
            loadJs(url, data, tbID, tbName, def, g, copyData);
        }
    };

    function comAct(data, tbID, tbName, def, g, copyData) {
        comAction.register(data, tbID, tbName, def, g, copyData);
    }

    function loadJs(url, data, tbID, tbName, def, g, copyData) {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);

        script.onload = function() {
            specAction(data, tbID, tbName, def, g, copyData);
        };
    }
});
