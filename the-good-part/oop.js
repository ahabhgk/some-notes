/* eslint-disable */
console.log('------------------------------this 绑定的 4 种方式------------------------------')

global.value = 'Global'
var obj = {
  value: 0,
  plus: function (num) {
    this.value += typeof num === 'number' ? num : 1
  },
  output: function () {
    function con() { console.log(this.value) }
    con()
    return function () {
      console.log(this)
    }
  }
}

// 1 方法调用，this 绑定到调用他的对象上
obj.plus(2)
console.log(obj.value)
// 2 apply 调用，手动指定 this 绑定
obj.plus.apply(global, [2333])
console.log(global.value)
// 3 函数调用
// var op = obj.output() // 调用了 con，con 的 this 为 global
// op() // 调用闭包返回的函数，btn.addEventListener('click', op) op 的 this 为 btn（闭包 return 的是一个 Function 实例）
// 所以 () => {} 被设计为没有 this、arguments、new.target、原型、super、不能用 new 调用的 “non-methed function”
// 4 构造器调用 new



console.log('------------------------------扩充类型的功能------------------------------')

Function.prototype.methed = function (name, func) {
  if (!this.prototype[name]) { // 没有该方法时才添加，防止类库混用时更改类库
    this.prototype[name] = func
  }
  return this
}

String.methed('itrim', function () { // String、Number、Object 等构造 **函数** 是 Function 的实例
  return this.replace(/^\s+|\s+$/g, '')
})

console.log('    this is a trim    '.itrim())



console.log('------------------------------new 模拟------------------------------')

Function.methed('inew', function () {
  var that = Object.create(this.prototype)
  var other = this.apply(that, arguments)
  return (typeof other === 'object' && other) || that // 构造函数最后返回一个对象
})

function Person(name) {
  this.name = name
}

Person.prototype.say = function () {
  console.log('This is ' + this.name)
}

var p = Person.inew('ahab')
console.log(p.name)
p.say()



console.log('------------------------------老道的组合继承------------------------------')

Function.methed('inherits', function (Parent) {
  console.log('s')
  this.prototype = Parent.inew() // 继承 Parent 原型上的方法
  return this
})

Function.methed('addMethed', function (name, func) {
  // 与 method 类似，不同在于 method 会延原型链查找，addMethed 则不会，防止给子类添加与父类同名的方法添加失败
  if (!this.prototype.hasOwnProperty(name)) {
    this.prototype[name] = func
  }
  return this
})

var Mammal = function (name) {
  this.name = name
}

Mammal.prototype.getName = function () {
  return this.name
}

Mammal.prototype.says = function () {
  return this.saying || ''
}

var Cat = function (name) {
  Mammal.apply(this, [name])
  this.saying = 'meow'
}
  .inherits(Mammal) // function () {}.inherits 体现了 JavaScript 一切皆对象，function () {} 是一个 Function 实例
  .methed('purr', function (n) {
    var i, s = ''
    for (i = 0; i < n; i += 1) {
      if (s) {
        s += '-'
      }
      s += 'r'
    }
    return s
  })
  .methed('getName', function () {
    return this.says() + ' ' + this.name + ' ' + this.says()
  })

var cat = new Cat('bhba')
console.log(cat.purr(5))
console.log(cat.getName())



console.log('------------------------------函数化实现私有属性和访问父类方法------------------------------')

var constructor = function (spec, my) {
  var my = my || {} // 在 my 上添加公有方法和公有属性
  var that = Object.create(my) // 在 that 上定义特权方法，以访问私有属性
  that.getAge = function () {
    return spec.age
  }
  return that
}

var pp = constructor({ age: 18 }, { name: 'ahab', getName: function () { return this.name } })
console.log(pp.name)
console.log(pp.getName())
console.log(pp.getAge())



Object.methed('superior', function (name) {
  var that = this
  var methed = that[name]
  return function () {
    return methed.apply(that, arguments)
  }
})

var Coolcat = function (name) {
  var that = new Cat(name)
  console.log(that.getName())
  var superGetName = that.superior('getName')
  that.getName = function () {
    return 'like ' + superGetName() + ' baby'
  }
  return that
}

var myCoolcat = Coolcat('Bix')
console.log(myCoolcat.getName())



console.log('------------------------------es5 继承 Array、Date 等对象------------------------------')
// ref: https://segmentfault.com/a/1190000012841509
// JavaScript 中的原生对象只能被自己的构造函数实例化
// 例：JavaScript 的日期对象只能通过 JavaScript Date 作为构造函数来实例化
// v8 引擎底层代码中有限制，如果调用对象的 [[Class]] 不是 Date，则抛出错误
// 也就是说，要调用 Date 上方法的实例对象必须通过 Date 构造出来，否则不允许调用 Date 的方法

Object.setPrototypeOf = Object.setPrototypeOf || function(obj, proto) { // polyfill
  obj.__proto__ = proto
  return obj
};
// __proto__ 并不是语言本身的特性，这是各大厂商具体实现时添加的私有属性，
// 虽然目前很多现代浏览器的 JS 引擎中都提供了这个私有属性，但依旧不建议在生产中使用该属性，
// 避免对环境产生依赖。生产环境中，可以使用 Object.getPrototypeOf、Object.setPrototypeOf...

// 寄生构造函数模式（es6 中 class extends 继承模拟）
function SpArray(...args) {
  var that = new Array(...args)
  Object.setPrototypeOf(that, SpArray.prototype) // 修改实例 __proto__ 指向
  return that
}

Object.setPrototypeOf(SpArray.prototype, Array.prototype) // 继承 Array

SpArray.prototype.toPipedString = function () {
  return this.join('|')
}

var sa = new SpArray(1, 2, 3)
console.log(sa)
console.log(sa.__proto__)
console.log(sa.toPipedString())


console.log('---es6 中---')
class SpecArray extends Array {
  constructor(...args) {
    // this.tag = 'SpecArray'
    // Must call super constructor in derived class before accessing 'this' or returning from derived constructor
    super(...args)
  }

  toPipedString() {
    return this.join('|')
  }
}

const spa = new SpecArray(1, 2, 3)
console.log(spa)
console.log(spa.__proto__)
console.log(spa.toPipedString())

// es5 中寄生组合式继承与 es6 class extends 的区别
// es5：先由子类（SubClass）构造出实例对象 this
// es6：先由父类（SuperClass）构造出实例对象 this，这也是为什么必须先调用父类的 super() 方法（子类没有自己的 this 对象，需先由父类构造，与寄生构造函数模式一样）
// babel 转译 es6 的继承是用的寄生组合式继承，所以继承 Array、Date 等时会报错
