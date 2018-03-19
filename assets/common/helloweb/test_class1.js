
class Polygon {
    constructor(height, width) {
        this.name = 'Polygon';
        this.height = height;
        this.width = width;
    }

    say() {
        console.log(this.height * this.width);
    }
}

class Square extends Polygon {
    constructor(length) {
        super(length, length);
        this.name = 'Square';
    }

    say() {
        super.say();
        console.log(this.height * this.width * 2);
    }
}

var polygon = new Polygon(11, 12);
polygon.say();

var square = new Square(11);
square.say();

function Class1() {
    this.name = "Class1";
    this.old = 11;
    return this;
}

Class1.prototype.weight = 12;
Class1.prototype.height = 180;

var class1 = Class1();
console.log(class1.name);
console.log(class1.old);
console.log(class1.weight);
console.log(class1.height);
