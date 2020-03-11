/* eslint-disable */
var iisArray = function (value) {
  return Object.prototype.toString.apply(value) === '[object Array]'
}


// reduce 模拟
Array.prototype.ireduce = function (reducer, initialVal) {
  let result = initialVal
  for (let i = 0; i < this.length; i++) {
    result = reducer(result, this[i], i, this)
  }
  return result
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

// some polyfill
if (!Array.prototype.some) {
  Array.prototype.some = function(fun/*, thisArg*/) {
    'use strict';

    if (this == null) {
      throw new TypeError('Array.prototype.some called on null or undefined');
    }

    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var array = Object(this);
    var len = array.length >>> 0;

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var index = 0; index < len; index++) {
      if (index in array && fun.call(thisArg, array[index], index, array)) {
        return true;
      }
    }

    return false;
  };
}

// 一般其他的遍历方法不能使用 break 和 continue，而 some 和 every 可以，相比之下 some 更简单，可读性更好
const arr = [1, 2, 3, 4, 5, 6]
let str = ''

const ret = arr.some(n => {
  if (n === 3) return false // 相当于 continue
  if (n >= 5) return true // 相当于 break
  str += n
})

console.log(str, arr, ret)

// flat
const arr = [1, [2, [3, [4, [5], 6]], 7], 8]

Array.prototype.iflat = function iflat(depth = 1) {
  return depth != 1
    ? this.reduce(
        (cur, next) => cur.concat(Array.isArray(next) ? next.iflat(depth - 1) : next),
        [],
      )
    : this.reduce((cur, next) => cur.concat(next), [])
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
