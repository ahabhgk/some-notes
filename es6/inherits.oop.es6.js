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


// es5 中的简单继承（寄生组合式继承）
// Object.create 模拟
Object.icreate = function (prototype) {
  // 先创建一个空的函数
  function Fn() {}
  // new Fn() 时让 Fn 的实例的 __proto__ 指向 prototype
  Fn.prototype = prototype
  // 返回函数实例
  return new Fn()
}
function Super() {}
function Sub() {}
Sub.prototype = Object.icreate(Super.prototype)
Sub.prototype.constructor = Sub
const sub = new Sub()
console.log(sub.constructor)
console.log(sub.__proto__.__proto__ === Super.prototype)
