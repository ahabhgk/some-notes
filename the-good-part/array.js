/* eslint-disable */
var iisArray = function (value) {
  return Object.prototype.toString.apply(value) === '[object Array]'
}


// reduce 模拟
Array.prototype.ireduce = function (reducer, initialVal) {
  for (let i = 0; i < this.length; i++) {
    initialVal = reducer(initialVal, this[i], i, this)
  }
  return initialVal
}

const arr = [1, 2, 3, 4]
console.log(arr.ireduce((val, item) => val + item, 0))

// filter 模拟
Array.prototype.ifilter = function (fn) {
  const newArr = []
  for (let i = 0; i < this.length; i++) {
    const flag = fn(this[i])
    flag && newArr.push(this[i]) // && 和 || 的执行
  }
}

// 数组就是对象，所以可以给一个数组实例添加方法
var data = [1, 2, 3]
function add(a, b) {
  return a + b
}
data.total = function () { // total 不是整数，所以不会改变他的 length，数组同对象一样，可以接受任何字符串作为属性名
  return this.ireduce(add, 0)
}
console.log(data.total())
