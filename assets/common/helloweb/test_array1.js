
let testArray11 = function() {
    function isBigEnough(element, index, array) {
        return (element >= 10);
    }

    let passed = [2, 5, 8, 1, 4].some(isBigEnough);
    console.log(passed);
// passed is false
    passed = [12, 5, 8, 1, 4].some(isBigEnough);
    console.log(passed);
};
testArray11();

let testArray12 = function() {
    let vegetables = ['parsnip', 'potato'];
    let moreVegs = ['celery', 'beetroot'];

// 将第二个数组融合进第一个数组
// 相当于 vegetables.push('celery', 'beetroot');
    Array.prototype.push.apply(vegetables, moreVegs);
//   vegetables.push(moreVegs); 不能用这个

    console.log(vegetables);
// ['parsnip', 'potato', 'celery', 'beetroot']
};
testArray12();
