/**
 * Created by liuchaoyu on 2016-12-20.
 */


(function () {

    window.cjEvent = {};

    var cjEvent = window.cjEvent;

    var bind = function (elem, param, procFunc) {

        var _elem;

        if (elem.jquery) {
        /** 是jQuery对象时 */
            _elem = elem[0];
        }
        else{
        /** 是Dom对象时 */
            _elem = elem;
        }

        var mutation = new MutationObserver(procFunc);

        mutation.observe(_elem,param);

    };

    cjEvent.resize = function (elem, callback_fn) {

        var procFunc = function (mutationRec) {

            var hasChange = false;

            for (var i = 0; i < mutationRec.length; i++) {

                var rec = mutationRec[i];
                if (rec.type == 'attributes' && rec.attributeName == 'style' && cjString.isContain(rec.oldValue,"width") != -1) {
                    hasChange = true;
                    break;
                }
            }

            if (hasChange){
                callback_fn();
            }
        };

        var param = {
            'attributes': true,
            'attributeOldValue': true,
        };

        bind.apply(this,[elem,param,procFunc]);

    };

    cjEvent.subChange = function (elem, callback_fn) {

        var procFunc = function (mutationRec) {

            var hasChange = false;

            for (var i = 0; i < mutationRec.length; i++) {

                var rec = mutationRec[i];
                if (rec.type == 'subtree' || rec.type == 'attributes' || rec.type == 'childList') {
                    hasChange = true;
                    break;
                }
            }

            if (hasChange){
                callback_fn();
            }
        };

        var param = {
            'attributes': true,
            'childList': true,
            'subtree': true
        };

        bind.apply(this,[elem,param,procFunc]);

    }







})();

