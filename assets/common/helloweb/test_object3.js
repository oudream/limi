let ClassA = function () {
    this.name = 'ClassA';
};

ClassA.prototype.showName = function () {
    console.log(this.name);
};

ClassA.prototype.name2 = 'name2';

let ClassAA = function () {
  ClassA.call(this)
};

let ClassAAPrototype = new ClassA();
ClassAA.prototype = ClassAAPrototype;

ClassAA.prototype.nameAA = 'nameAA';

ClassAA.prototype.showNameAA = function () {
    console.log(this.nameAA);
};

let testObject31 = function () {
    let classAA = new ClassAA();
    classAA.showName();
    classAA.showNameAA();
    console.log(classAA.constructor.name);
    console.log(classAA.isPrototypeOf(new ClassA()));
    console.log(classAA.isPrototypeOf(ClassAAPrototype));
    console.log(classAA instanceof ClassA);
    console.log(classAA instanceof ClassAA);
};
// testObject31();

let Super = function () {
    this.val = 1;
    this.arr = [1];
};

Super.prototype.container = [];

let Sub = function () {
    Super.call(this);
    this.name = '';
};
Sub.prototype = new Super();
Sub.prototype.constructor = Sub;

let testObject32 = function () {
    let sub1 = new Sub();
    let sub2 = new Sub();

    sub1.val = 2;
    sub1.arr.push(2);
    sub1.container.push(1);

    console.log(sub1.val);
    console.log(sub2.val);

    console.log(sub1.arr);
    console.log(sub2.arr);
};
// testObject32();


let testObject33 = function () {
    function C(){}
    function D(){}

    let o = new C();


    console.log(o instanceof C); // true，因为 Object.getPrototypeOf(o) === C.prototype


    console.log(o instanceof D); // false，因为 D.prototype不在o的原型链上
};
// testObject33();


let testObject34 = function () {
    var Base = function () {}
    var o1 = new Base();
    var o2 = Object.create(Base);
    console.log(o1.__proto__);
    console.log(o1.prototype);
    console.log(o2.__proto__);
    console.log(o1.prototype);
};
testObject34();