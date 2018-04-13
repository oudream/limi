/**
 * Created by liuchaoyu on 2016-12-20.
 */


(function() {
    window.cjEvent = {};

    let cjEvent = window.cjEvent;

    let bind = function(elem, param, procFunc) {
        let _elem;

        if (elem.jquery) {
        /** 是jQuery对象时 */
            _elem = elem[0];
        } else {
        /** 是Dom对象时 */
            _elem = elem;
        }

        let mutation = new MutationObserver(procFunc);

        mutation.observe(_elem, param);
    };

    cjEvent.resize = function(elem, callback_fn) {
        let procFunc = function(mutationRec) {
            let hasChange = false;

            for (let i = 0; i < mutationRec.length; i++) {
                let rec = mutationRec[i];
                if (rec.type == 'attributes' && rec.attributeName == 'style' && cjString.isContain(rec.oldValue, 'width') != -1) {
                    hasChange = true;
                    break;
                }
            }

            if (hasChange) {
                callback_fn();
            }
        };

        let param = {
            'attributes': true,
            'attributeOldValue': true,
        };

        bind.apply(this, [elem, param, procFunc]);
    };

    cjEvent.subChange = function(elem, callback_fn) {
        let procFunc = function(mutationRec) {
            let hasChange = false;

            for (let i = 0; i < mutationRec.length; i++) {
                let rec = mutationRec[i];
                if (rec.type == 'subtree' || rec.type == 'attributes' || rec.type == 'childList') {
                    hasChange = true;
                    break;
                }
            }

            if (hasChange) {
                callback_fn();
            }
        };

        let param = {
            'attributes': true,
            'childList': true,
            'subtree': true,
        };

        bind.apply(this, [elem, param, procFunc]);
    };
})();

