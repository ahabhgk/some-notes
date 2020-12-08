const co = require('co')

console.log('script start')

let async1 = function * () {
  yield co(async2)
  console.log('async1 end')
}
function * async2() {
  console.log('async2 end')
}
co(async1)

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})
.then(function() {
  console.log('promise1')
})
.then(function() {
  console.log('promise2')
})

console.log('script end')