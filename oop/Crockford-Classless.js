/**
 * 解除了对象方法对属性的依赖
 * 但对象方法依赖于工厂函数词法作用域中的变量，而不依赖于返回的对象
 * 所以使用 Object.freeze 来防止对象属性的改变（只能访问，不能修改）
 * 
 * 
 * [或许我们在 JavaScript 中不需要 this 和 class](https://zhuanlan.zhihu.com/p/59917327)
 * function cat(spec) {
 *   const { name } = spec
 *   function meow() {
 *     console.log(name + 'meows!');
 *   }
 * 
 *   return Object.freeze({
 *     name,
 *     meow,
 *   });
 * }
 * 
 * Tom.meow(); // Tom meows!
 * 
 * // `如果不加 freeze，修改 name 后调用 meow 仍然输出 Tom meows！`
 * 
 * Tom.name = 'Jerry'; //TypeError: Cannot add property name, object is not extensible
 * 
 * Tom.meow = null; //TypeError: Cannot add property name, object is not extensible
 */

const Person = spec => {
  let { name, age } = spec
  const talk = () => {
    console.log(`Hello! My name is ${name}, I'm ${age} years.`)
  }
  const grow = (years) => {
    age += years
    console.log(`I'm ${age} years old now.`)
  }

  return {
    name,
    talk,
    grow,
  }
}

const Superman = spec => {
  let { name, age, power } = spec
  const laserAttack = () => {
    console.log(`Attack!!! (Attack power: ${power})`)
  }

  return Object.assign(
    Person({ name, age }),
    { power, laserAttack },
  )
}

// test
const ahab = Person({ name: 'ahab', age: 18 })
const klk = Superman({ name: 'klk', age: 26, power: 100 })

ahab.talk()
klk.talk()

ahab.grow(2)
klk.grow(4)

klk.laserAttack()

console.log(ahab)
console.log(klk)
