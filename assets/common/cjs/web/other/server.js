define(['jquery'], function(e) {
    return {
        getData: function(url, callback, errCallback) {
            requirejs(['json!'+url], function(res) {
                if (res.error == 1) {
					// 重新登录
                    return;
                }
                if (res.error == 0) {
                    callback(res.data);
                    return;
                }				else {
                    errCallback&&errCallback(res);
                }
            });
        },
    };
});
