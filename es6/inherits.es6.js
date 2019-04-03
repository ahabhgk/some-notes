/* eslint-disable no-new-object */
/* eslint-disable no-proto */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */

class Parent {
  constructor(name) {
    this.name = name
  }

  static getAge() {
    console.log('no age, haha')
  }

  getName() {
    console.log(this.name)
  }
}

class Child extends Parent {
  constructor(name, age) {
    // super 指父类的构造函数
    super(name)
    this.age = age
  }

  getAge() {
    console.log(this.age)
  }
}


// new 干了什么？new 的模拟
function inew(...args) {
  const obj = {}
  const Constructor = args.shift()
  obj.__proto__ = Constructor.prototype
  const ret = Constructor.apply(obj, args)
  return typeof ret === 'object' ? ret : obj
}


// new、Object.create、{} 创建对象的不同：
// 使用 Object.create() 是将对象继承到 __proto__ 属性上
const test = Object.create({ x: 123, y: 345 })
console.log(test)// {}
console.log(test.x)// 123
console.log(test.__proto__.x)// 3
console.log(test.__proto__.x === test.x)// true

const test1 = new Object({ x: 123, y: 345 })
console.log(test1)// {x:123,y:345}
console.log(test1.x)// 123
console.log(test1.__proto__.x)// undefined
console.log(test1.__proto__.x === test1.x)// false

const test2 = { x: 123, y: 345 }
console.log(test2)// {x:123,y:345};
console.log(test2.x)// 123
console.log(test2.__proto__.x)// undefined
console.log(test2.__proto__.x === test2.x)// false


// Object.create 模拟
Object.icreate = function (prototype) {
  // 先创建一个空的函数
  function Fn() {}
  // new Fn() 时让 Fn 的实例的 __proto__ 指向 prototype
  Fn.prototype = prototype
  // 返回函数实例
  return new Fn()
}


// es5 中的继承（寄生组合式继承）
function Super() {}
function Sub() {}
Sub.prototype = Object.create(Super.prototype)
Sub.prototype.constructor = Sub
const sub = new Sub()
console.log(sub.constructor)
console.log(sub.__proto__.__proto__ === Super.prototype)
