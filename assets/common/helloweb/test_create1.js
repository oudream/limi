let s1 = 'aa'
let s2 = 'bb'
let testCreate11 = function () {
  let obj1 = Object.create({}, {
    p: {value: 42, writable: true, enumerable: true, configurable: true},
    p2: {value: 42, writable: true, enumerable: true, configurable: true}
  })
  console.log(obj1)
}
testCreate11()

let testCreate12 = function () {
  let o1 = {}
  o1[s1] = 'ccc'
  console.log(o1)
  console.log(({}.a) = 3)
  console.log(function () {
    let r = {}
    r[s1] = '555'
    r[s2] = '666'
    return r
  }())
}
testCreate12()

let testCreate13 = function () {
  var Car2 = new Function('sColor', 'iDoors',
    'this.color = sColor;' +
    'this.doors = iDoors;' +
    'this.showColor = function(){ return this.color; }'
  )
  console.log(new Car2('blue', 3).showColor())
}
testCreate13()

let testCreate14 = function () {
  var function_name = new Function('param1', 'pram2', 'console.log(param1);')
  console.log(function_name(3333, 2))
}
testCreate14()

