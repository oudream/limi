let fn = function() {
    if (typeof exports === 'object' && typeof global === 'object') {
        global.cjs = global.cjs || {};
    } else if (typeof window === 'object') {
        window.cjs = window.cjs || {};
    } else {
        throw Error('cjs only run at node.js or web browser');
    }

    let O1 = cjs.O1 || {};

    if (O1 instanceof Function) return;

    O1 = cjs.O1 = function() {
        this._name = 1;
    };

    O1.prototype.show = function() {
        console.log('ss');
    };

    console.log((new O1).show());
};

fn();
fn();
fn();
fn();
fn();
