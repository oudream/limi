
let testObject21 = function() {
    let obj1 = {
        a: 'a',
        b: 1,
        c: 'c',
        o: {
            e: 1,
        },
    };

    function editObj(o) {
        o.b = 'b';
    }

    console.log(obj1.b);
    editObj(obj1);
    console.log(obj1.b);
};
testObject21();

let testObject22 = function() {
    let r = 3;
// let o1 = Object.create(r)
    let o2 = new Object(r);
    o2.a2 = 'xx';

// console.log(o1)
    console.log(r);
    console.log(o2);
    console.log(typeof o2);
    console.log(typeof o2.valueOf());
    console.log(JSON.stringify(o2));
};
testObject22();
