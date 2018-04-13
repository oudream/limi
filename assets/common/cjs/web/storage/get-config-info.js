/**
 * Created by liuchaoyu on 2017-03-14.
 */

'use strict';

(function() {
    cjLocalStorage.clearAll();

    ShareCacheAccess.openShareCache();

    ShareCacheAccess.getAll('', function(id, data, err) {
        alert(data);
        cjLocalStorage.saveObj('sinopec-' + id, data);
    });

    ShareCacheAccess.closeShareCache();
})();
