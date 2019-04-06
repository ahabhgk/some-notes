// Generator(生成器) Iterator(迭代器)

// generator模拟
function read(books) {
  let index = 0
  return {
    next() {
      const done = index === books.length
      const value = done ? undefined : books[index]
      index += 1
      return {
        done,
        value,
      }
    },
  }
}

const it = read(['js', 'node', 'monogo'])
let result
do {
  result = it.next()
  console.log(result)
} while (!result.done)

// 使用 generator
// 内部生成很多块小函数
function* read1(books) {
  for (let i = 0; i < books.length; i++) {
    yield books[i]
  }
  return 'overover'
}
const it1 = read1(['js', 'node', 'monogo'])
console.log(it1.next())
console.log(it1.next())
console.log(it1.next())
console.log(it1.next())


// Thunk 函数
/**
 * Thunk 函数的定义，它是"传名调用"的一种实现策略，用来替换某个表达式。
 * 在 JavaScript 语言中，Thunk 函数替换的不是表达式，而是多参数函数，将其替换成单参数的版本，且只接受回调函数作为参数。
 */
const fs = require('fs')

const thunkify = function (fn) {
  return function (...args) {
    return function (cb) {
      args.push(cb)
      return fn.apply(this.args)
    }
  }
}
const readFile = thunkify(fs.readFile)
readFile('./some-file.ext')((err, data) => {
  if (err) throw err
  console.log(data)
})
