// 在对象（的原型）上添加方法
Function.prototype.method = function (name, fn) {
  if (!this.prototype[name]) {
    this.prototype[name] = fn
  }
  return this
}

// 模拟 Object.create
Object.method('icreate', function (prototype) {
  function F() {}
  F.prototype = prototype
  return new F()
})

// 为子类添加 `继承父类方法` 的方法
Function.method('inherits', function (Super) {
  this.prototype = Object.icreate(Super.prototype)
  this.prototype.constructor = this
  return this
})

// 为子类添加 `方法` 的方法
Function.method('addMethod', function (name, fn) {
  // 与 method 类似，不同在于 method 会延原型链查找，addMethed 则不会，防止给子类添加与父类同名的方法添加失败
  if (!this.prototype.hasOwnProperty(name)) {
    this.prototype[name] = fn
  }
  return this
})



// Person 类的创建
function Person(name) {
  this.name = name
}

Person.prototype.say = function () {
  console.log(this.name)
}

// PropPerson 类的创建与继承
const PropPerson = function PropPerson(name, prop) {
  Person.call(this, name) // 继承父类属性
  this.prop = prop
} // **变量** function () { /* ... */ } 是 Function 的实例，所以后面可以跟 .inherits
  .inherits(Person)
  .addMethod('shout', function () {
    console.log(`I'm ${this.name}, my prop is ${this.prop}!!!`)
  })

// function PropPerson(name, prop) {
//   Person.call(this, name)
//   this.prop = prop
// }
// PropPerson
//   .inherits(Person)
//   .addMethod('shout', function () {
//     console.log(`I'm ${this.name}, my prop is ${this.prop}!!!`)
//   })


const p1 = new Person('ahabhgk')
p1.say()

const p2 = new PropPerson('baha', 'noob')
p2.shout()

console.log(p1, p1.__proto__)
console.log(p2, p2.__proto__)
