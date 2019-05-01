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