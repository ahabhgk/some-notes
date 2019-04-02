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
