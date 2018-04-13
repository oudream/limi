const testClass21 = function() {
    class Animal {
        constructor() {
            this.name = 'a';
        }

        speak() {
            return this;
        }

        static eat() {
            return this;
        }
  }

    const obj = new Animal();
    const speak = obj.speak;
    const s1 = speak(); // undefined

    console.log(s1);

    const eat = Animal.eat;
    const s2 = eat(); // undefined

    console.log(s2);
};

testClass21();

const testClass22 = function() {
    function Animal() {
    }

    Animal.prototype.speak = function() {
        return this;
    };

    Animal.eat = function() {
        return this;
    };

    const obj = new Animal();
    const speak = obj.speak;
    const s1 = speak(); // global object

    console.log(s1.hasOwnProperty('speak'));

    const eat = Animal.eat;
    const s2 = eat(); // global object

    console.log(s2.hasOwnProperty('eat'));

    return speak;
};

testClass22();

