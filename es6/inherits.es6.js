/* eslint-disable */

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
    // super 代表父类的构造函数，用来新建父类的this对象
    super(name)
    this.age = age
  }

  getAge() {
    console.log(this.age)
  }
}

/**
 * ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）
 * ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），然后再用子类的构造函数修改this
 *
 * ES6 允许继承原生构造函数定义子类，因为 ES6 是先新建父类的实例对象this，然后再用子类的构造函数修饰this，使得父类的所有行为都可以继承
 */


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
