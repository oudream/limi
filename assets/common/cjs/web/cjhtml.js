/**
 * Created by oudream on 2017/1/11.
 */

(function() {
    'use strict';

    var CjHtml = CjHtml || {};

    if ( typeof window === 'object' ) {
        window.cjs = window.cjs || {};
    } else {
        throw Error('cjs only run at  web browser');
    }

    cjs.CjHtml = CjHtml;
    /**
     * escape html character
     * @param {string} str
     * @returns {string}
     */
    CjHtml.escapeHtml = function escapeHtml(str) {
        return str.replace(/[<>'&]/g,
            function(match) {
                switch (match) {
                case '<':
                    return '&lt;';
                case '>':
                    return '&gt;';
                case '&':
                    return '&amp;';
                case '\'':
                    return '&quot;';
                }
            }
        );
    };

    CjHtml.cumulativeOffset = function(element) {
        let top = 0, left = 0;
        do {
            top += element.offsetTop || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while (element);

        return {
            top: top,
            left: left,
        };
    };
})();
