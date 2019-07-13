/**
 * 分离出私有变量
 * 私有变量放词法作用域
 * 公有变量通过 state 对象暴露
 */

const Person = spec => {
  let { name, age } = spec
  const state = {
    name,
  }
  const talk = () => {
    console.log(`Hello! My name is ${state.name}, I'm ${age} years.`)
  }
  const grow = (years) => {
    age += years
    console.log(`I'm ${age} years old now.`)
  }

  return Object.assign(
    state,
    { talk, grow },
  )
}

const Superman = spec => {
  let { name, age, power } = spec
  const state = Object.assign(
    Person({ name, age }),
    { power },
  )
  const laserAttack = () => {
    console.log(`Attack!!! (Attack power: ${state.power})`)
  }

  return Object.assign(
    state,
    { laserAttack },
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
