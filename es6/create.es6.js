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
