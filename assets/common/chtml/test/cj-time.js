/**
 * Created by liuchaoyu on 2016-10-28.
 */

(function() {
    window.cjTime = {};

    let cjTime = window.cjTime;

    cjTime.now = function() {
        return new Date().getTime();
    };
})();
