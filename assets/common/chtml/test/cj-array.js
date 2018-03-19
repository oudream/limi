/**
 * Created by oudream on 2016/3/24.
 * Updated by liuchaoyu on 2016/10/28
 */
(function() {
    window.cjArray = {};

    var cjArray = window.cjArray;

    cjArray.findInArray = function(array,elem) {
        if( array == null || array == undefined) {
            return -2;
        }
        else if (array.length == 0) {
            return -1;
        }
        for( var i = 0; i < array.length; i++ ){
            if( elem == array[i] ){
                return i;
            }
        }

        return -1;
    };

    cjArray.remove = function (array, elem) {
        var index = array.indexOf(elem);
        if (index > -1) {
            array.splice(index, 1);
        }
    };

})()