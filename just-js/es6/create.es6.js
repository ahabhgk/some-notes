/* eslint-disable no-unused-vars */

class Parent {
  // constructor方法默认返回实例对象（即this），完全可以指定返回另外一个对象
  constructor(name) {
    this.name = name
  }

  // 静态方法不会被实例继承，而是直接通过类来调用：Parent.getAge()
  static getAge() {
    console.log('no age, haha')
  }

  getName() {
    console.log(this.name)
  }
}
