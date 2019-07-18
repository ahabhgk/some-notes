/**
 * 关注于对象做什么（方法）
 * 对象的属性不适合暴露
 * 方法依赖于属性（state），不能实现私有
 * 
 * [Composition over Inheritance](https://medium.com/humans-create-software/composition-over-inheritance-cb6f88070205)
 * const barker = (state) => ({
 *   bark: () => console.log('Woof, I am ' + state.name)
 * })
 * const driver = (state) => ({
 *   drive: () => state.position = state.position + state.speed
 * })
 * 
 * const murderRobotDog = (name)  => {
 *   let state = {
 *     name,
 *     speed: 100,
 *     position: 0
 *   }
 *   return Object.assign(
 *     {},
 *     barker(state),
 *     driver(state),
 *   )
 * }
 * 
 * const bruno =  murderRobotDog('bruno')
 * bruno.bark() // "Woof, I am Bruno"
 */

const talker = state => ({
  talk: () => console.log(`Hello! My name is ${state.name}, I'm ${state.age} years.`),
})

const grower = state => ({
  grow: (years) => {
    state.age += years
    console.log(`I'm ${state.age} years old now.`)
  },
})

const laserAttacker = state => ({
  laserAttack: () => console.log(`Attack!!! (Attack power: ${state.power})`),
})

const Person = ({ name, age }) => {
  const state = { name, age }

  return Object.assign(
    state, // 必须为第一个参数，方法的引用 state，调用方法修改属性是才能生效
    talker(state),
    grower(state),
  )
}

const Superman = ({ name, age, power }) => {
  const state = { name, age, power }

  return Object.assign(
    Person(state),
    { power },
    laserAttacker(state),
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
