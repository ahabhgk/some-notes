/* eslint-disable */

// 解构
const destrcturing = () => {
  const obj1 = { name: 'ahab', age: 18 }
  const { name: ahabname, age = 10 } = obj1
  console.log(ahabname, age)
}
// destrcturing()

// 模版字符串
const templateString = function () {
  const [name, age] = ['ahab', 18]
  const str = '${name} is ${age} years old.'
  const replace = function (str) {
    return str.replace(/\$\{([^}]+)\}/g, function (matched, key) {
      return eval(key)
    })
  }
  console.log(replace(str)) // ahab is 18 years old.

  // 有时需要有自己的模版字符串处理逻辑
  const desc = function (string, name, ...rest) {
    console.log(string)
    console.log(name)
    console.log(rest)
  }
  const str1 = desc`haha ${name} is ${age}.`
}
// templateString()

// new API
const newAPI = function () {
  const filename = 'avater.jpg'
  const isPic = function (filename) {
    if (filename.endsWith('jpg') || filename.endsWith('png')) return true
    return false
  }
  console.log(isPic(filename))

  const http = 'http://wolala.com'
  const whichProtocol = function (url) {
    if (url.startsWith('http')) return 'http protocol'
    if (url.startsWith('ftp')) return 'ftp protocol'
    return 'other protocol'
  }
  console.log(whichProtocol(http))

  console.log('6'.repeat(3))

  console.log(`(${'7'.padStart(2, '0')}:${'20'.padStart(2, '0')})`)
}
// newAPI()

// 对象合并
const objAssign = function () {
  // 浅拷贝
  const obj1 = { name: 'ahab' }
  const obj2 = { class: ['fe', 'web', ['ai', 'ml']] }
  const obj = Object.assign(obj1, obj2)
  console.log(obj)
  obj.class[2] = 'be'
  console.log(obj2)
  const objj = { ...obj1, ...obj2 }
  console.log(objj)
  objj.class[3] = 'ai'
  console.log(obj2)
}
// objAssign()

// obj
const obj = function () {
  const obj1 = {
    name: 'ahab',
    getFood() { // getFood: function () {},
      return this
    },
  }
  const obj3 = {
    // __proto__: obj1,
    age: 18,
    getFood() {
      return this.age + super.name
    },
  }
  console.log(obj1.getFood(), obj3.getFood()) // 18 + undefined
  Object.setPrototypeOf(obj3, obj1)
  // obj3.__proto__ = obj1
  // console.log(obj3, obj3.name)
  console.log(obj1.getFood(), obj3.getFood())
}
// obj()
