// add(1); // 1
// add(1)(2);  // 3
// add(1)(2)(3)； // 6
// add(1)(2)(3)(4)； // 10

const add = function (a) {
  function sum(b) {
    a += b
    return sum
  }
  sum.toString = function () {
    return a
  }
  return sum
}

console.log(add(1)) // 1
console.log(add(1)(2)) // 3
console.log(add(1)(2)(3)) // 6
console.log(add(1)(2)(3)(4)) // 10

const arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10]

function handle(arr) {
  const result = []
  for (let i = 0; i < arr.length; i++) {
    if (!Array.isArray(arr[i])) {
      result.push(arr[i])
    } else {
      result.push(...handle(arr[i]))
    }
  }
  return result
}

console.log(
  handle(arr)
)

// const my = arr.raduce((acc, cur) => {
  
// }, [])
