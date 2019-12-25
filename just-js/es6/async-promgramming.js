/* eslint-disable */
const fs = require('fs')
// Generator(生成器) 返回 Iterator(迭代器)

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


// promisify
function promisify(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn.apply(null, [...args, (err, data) => { // null(this) 为了以数组形式传参
        err ? reject(err) : resolve(data)
      }])
    })
  }
}
const pReadFile = promisify(fs.readFile)
pReadFile('../useless/1.txt', 'utf8').then(res => { console.log(res) })

// Thunk 函数
/**
 * Thunk 函数的定义，它是"传名调用"的一种实现策略，用来替换某个表达式。
 * 在 JavaScript 语言中，Thunk 函数替换的不是表达式，而是多参数函数，将其替换成单参数的版本，且只接受回调函数作为参数。
 */
const thunkify = function (fn) {
  return function (...args) {
    return function (cb) {
      args.push(cb)
      return fn.apply(this, args)
    }
  }
}
const readFile = thunkify(fs.readFile)
readFile('../useless/1.txt', 'utf8')((err, data) => {
  if (err) throw err
  console.log(data)
})

// co 函数
/**
 * 将 generator 和 promise 自动执行结合 => async/await
 */

function co(gen) {
  const it = gen()
  return new Promise((resolve, reject) => {
    function next(lastVal) {
      const { value, done } = it.next(lastVal)
      if (done) {
        resolve(value)
      } else {
        value.then(next, reject)
      }
    }
    next()
  })
}

// async/await
/**
 * async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里。
 */
async function fn0(args) {
  // ...
}

// 等同于

function fn1(args) {
  return co(function* () {
    // ...
  })
}

// 等同于

function fn2(args) {
  function spawn(genF) {
    return new Promise(((resolve, reject) => {
      const gen = genF()
      function step(nextF) {
        let next
        try {
          next = nextF()
        } catch (e) {
          return reject(e)
        }
        if (next.done) {
          return resolve(next.value)
        }
        Promise.resolve(next.value).then((v) => {
          step(() => gen.next(v))
        }, (e) => {
          step(() => gen.throw(e))
        })
      }
      step(() => gen.next(undefined))
    }))
  }
  return spawn(function* () {
    // ...
  })
}
