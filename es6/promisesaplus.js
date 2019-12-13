/* eslint-disable */
/**
 * Promises/A+ 规范：https://promisesaplus.com/
 *
 * Promise 测试：
 * npm i -g promises-aplus-tests
 * promises-aplus-tests promisesaplus.js
 * 
 * 参考：Promise 原理解析与实现(遵循Promise/A+规范) https://www.imooc.com/article/23906
 */

var PENDING = 'pending'
var FULFILLED = 'fulfilled'
var REJECTED = 'rejected'

function Promise(executor) {
  var self = this
  self.state = PENDING
  self.value = undefined
  self.reason = undefined
  self.onFulfilledCallbacks = []
  self.onRejectedCallbacks = []

  function resolve(value) {
    if (value instanceof Promise) {
      return value.then(resolve, reject)
    }
    // 为什么 resolve 加 setTimeout?
    // 2.2.4 规范 onFulfilled 和 onRejected 只允许在 execution context 栈仅包含平台代码时运行.
    // 注 1 这里的平台代码指的是引擎、环境以及 promise 的实施代码。实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。
    setTimeout(function () {
      // 调用 resolve 回调对应 onFulfilled 函数
      if (self.state === PENDING) {
        // 只能由 pending 状态 => fulfilled 状态 (避免调用多次 resolve reject)
        self.state = FULFILLED
        self.value = value
        self.onFulfilledCallbacks.forEach(cb => cb(self.value))
      }
    }, 0)
  }

  function reject(reason) {
    setTimeout(function () {
      if (self.state === PENDING) {
        self.state = REJECTED
        self.reason = reason
        self.onRejectedCallbacks.forEach(cb => cb(self.reason))
      }
    }, 0)
  }

  // 捕获在 excutor 执行器中抛出的异常
  // new Promise((resolve, reject) => {
  //     throw new Error('error in excutor')
  // })
  try {
    // 对应 Promise 传入一个参数为 resolve, reject 的 function
    executor(resolve, reject)
  } catch (err) {
    reject(err)
  }
}


/**
 * resolve 中的值的几种情况：
 * 1 Promise 对象（属于情况 2）
 * 2 thenable 对象/函数
 * 3 其他的普通值
 */

/**
 * 对 resolve 进行改造增强 针对 resolve 中不同值情况 进行处理
 * 实现链式 promise 调用：resolve(new Promise(...))、return new Promise(...)
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) { // 2.3.1 If promise and x refer to the same object, reject promise with a TypeError as the reason.
    // const p1 = new Promise((resolve, reject) => { resolve('233') })
    // const p2 = p1.then(res => p2)
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  var called = false // 避免多次调用
  if (x instanceof Promise) { // 2.3.2 If x is a promise, adopt its state:
    if (x.state === PENDING) {  // 如果为等待态需等待直至 x 被执行或拒绝 并解析y值
      // 2.3.2.1 If x is pending, promise must remain pending until x is fulfilled or rejected.
      x.then(function (y) {
        resolvePromise(promise2, y, resolve, reject)
      }, function (reason) {
        reject(reason)
      })
    } else { // 如果 x 已经处于执行态/拒绝态(值已经被解析为普通值)，用相同的值执行传递下去 promise
      // 2.3.2.2 If/when x is fulfilled, fulfill promise with the same value.
      // 2.3.2.3 If/when x is rejected, reject promise with the same reason.
      x.then(resolve, reject)
    }
  } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) { // 2.3.3 Otherwise, if x is an object or function,
    try { // 是否是thenable对象（具有then方法的对象/函数）
      // 2.3.3.1 Let then be x.then.
      var then = x.then
      if (typeof then === 'function') {
        // 2.3.3.3 If then is a function, call it with x as this, first argument resolvePromise, and second argument rejectPromise, where:
        then.call(x, function (y) { // 2.3.3.3.1 If/when resolvePromise is called with a value y, run [[Resolve]](promise, y).
          // 2.3.3.3.3 If both resolvePromise and rejectPromise are called, or multiple calls to the same argument are made, the first call takes precedence, and any further calls are ignored.
          if (called) return
          called = true
          resolvePromise(promise2, y, resolve, reject)
        }, function (err) { // 2.3.3.3.2 If/when rejectPromise is called with a reason r, reject promise with r.
          // 2.3.3.3.3 If both resolvePromise and rejectPromise are called, or multiple calls to the same argument are made, the first call takes precedence, and any further calls are ignored.
          if (called) return
          called = true
          reject(err)
        })
      } else { // x 不是一个 thenable 对象，则直接当成普通值 resolve
        // 2.3.3.4 If then is not a function, fulfill promise with x.
        resolve(x)
      }
    } catch (err) { // 2.3.3.3.4 If calling then throws an exception e,
      // 2.3.3.3.4.1 If resolvePromise or rejectPromise have been called, ignore it.
      if (called) return
      called = true
      // 2.3.3.3.4.2 Otherwise, reject promise with e as the reason.
      reject(err)
    }
  } else { // 2.3.4 If x is not an object or function, fulfill promise with x.
    resolve(x)
  }
}


/**
 * 注册fulfilled状态/rejected状态对应的回调函数
 * @param  {function} onFulfilled fulfilled 状态时 执行的函数
 * @param  {function} onRejected  rejected 状态时 执行的函数
 * @return {function} promise2    返回一个新的 promise 对象
 */
Promise.prototype.then = function (onFulfilled, onRejected) {
  // promise 穿透的实现
  // 2.2.1 Both onFulfilled and onRejected are optional arguments:
  // 2.2.1.1 If onFulfilled is not a function, it must be ignored.
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
  // 2.2.1.2 If onRejected is not a function, it must be ignored.
  onRejected = typeof onRejected === 'function' ? onRejected : (reason) => { throw reason }

/**
 * then里面的 FULFILLED / REJECTED 状态时，为什么要加 setTimeout ？
 * 原因:
 * 其一 2.2.4 规范 要确保 onFulfilled 和 onRejected 方法异步执行(且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行) 所以要在 resolve 里加上 setTimeout
 * 2.2.4 onFulfilled or onRejected must not be called until the execution context stack contains only platform code.
 *
 *   3.1 Here “platform code” means engine, environment, and promise implementation code.
 *   In practice, this requirement ensures that onFulfilled and onRejected execute asynchronously,
 *   after the event loop turn in which then is called, and with a fresh stack.
 *   This can be implemented with either a “macro-task” mechanism such as setTimeout or setImmediate,
 *   or with a “micro-task” mechanism such as MutationObserver or process.nextTick.
 *   Since the promise implementation is considered platform code,
 *   it may itself contain a task-scheduling queue or “trampoline” in which the handlers are called.
 *
 * 其二 2.2.6 规范 对于一个 promise，它的 then 方法可以调用多次。（当在其他程序中多次调用同一个 promise 的 then 时 由于之前状态已经为 FULFILLED / REJECTED 状态，则会走的下面逻辑），所以要确保为 FULFILLED / REJECTED 状态后 也要异步执行 onFulfilled / onRejected
 * 2.2.6 then may be called multiple times on the same promise.
 * 2.2.6.1 If/when promise is fulfilled, all respective onFulfilled callbacks must execute in the order of their originating calls to then.
 * 2.2.6.2 If/when promise is rejected, all respective onRejected callbacks must execute in the order of their originating calls to then.
 * 
 * 总之都是 让 then 方法异步执行 也就是确保 onFulfilled / onRejected 异步执行
 * 如下面这种情景 多次调用 p1.then
 * p1.then((value) => { // 此时 p1.status 由 pedding 状态 => fulfilled 状态
 *     console.log(value); // resolve
 *     // console.log(p1.status); // fulfilled
 *     p1.then(value => { // 再次 p1.then 这时已经为 fulfilled 状态 走的是 fulfilled 状态判断里的逻辑 所以我们也要确保判断里面 onFuilled 异步执行
 *         console.log(value); // 'resolve'
 *     });
 *     console.log('当前执行栈中同步代码');
 * })
 * console.log('全局执行栈中同步代码');
 */

  var self = this
  var promise2
  if (self.state === FULFILLED) { // 成功态
    return promise2 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        try {
          var x = onFulfilled(self.value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (err) {
          reject(err)
        }
      }, 0)
    })
  }
  if (self.state === REJECTED) { // 失败态
    return promise2 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        try {
          var x = onRejected(self.reason)
          resolvePromise(promise2, x, resolve, reject)
        } catch (err) {
          reject(err)
        }
      }, 0)
    })
  }
  if (self.state === PENDING) { // 等待态
/**
 * 链式 promise
 * 2.2.7 then must return a promise
 * 2.2.7.1 If either onFulfilled or onRejected returns a value x, run the Promise Resolution Procedure [[Resolve]](promise2, x).
 * 2.2.7.2 If either onFulfilled or onRejected throws an exception e, promise2 must be rejected with e as the reason.
 * 2.2.7.3 If onFulfilled is not a function and promise1 is fulfilled, promise2 must be fulfilled with the same value as promise1.
 * 2.2.7.4 If onRejected is not a function and promise1 is rejected, promise2 must be rejected with the same reason as promise1.
 */
    return promise2 = new Promise(function (resolve, reject) {
      // 当异步调用 resolve / rejected 时 将 onFulfilled / onRejected 收集暂存到集合中
      self.onFulfilledCallbacks.push(function (value) {
        try {
          var x = onFulfilled(value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (err) {
          reject(err)
        }
      })
      self.onRejectedCallbacks.push(function (reason) {
        try {
          var x = onRejected(reason)
          resolvePromise(promise2, x, resolve, reject)
        } catch (err) {
          reject(err)
        }
      })
    })
  }
}


/**
 * Promise.all Promise 进行并行处理
 * 参数: promise 对象组成的数组作为参数
 * 返回值: 返回一个 Promise 实例
 * 当这个数组里的所有 promise 对象全部变为 resolve 状态的时候，才会 resolve。
 */
Promise.all = function(promises) {
  return new Promise((resolve, reject) => {
    let done = gen(promises.length, resolve)
    promises.forEach((promise, index) => {
      // promise 数组传到外层 resolve
      promise.then((value) => {
        done(index, value)
      }, reject)
    })
  })
}

function gen(length, resolve) {
  let count = 0
  let values = []
  return function(i, value) {
      values[i] = value
      if (++count === length) {
          console.log(values)
          resolve(values)
      }
  }
}

/**
 * Promise.race
 * 参数: 接收 promise 对象组成的数组作为参数
 * 返回值: 返回一个 Promise 实例
 * 只要有一个 promise 对象进入 FulFilled 或者 Rejected 状态的话，就会继续进行后面的处理(取决于哪一个更快)
 */
Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      promise.then(resolve, reject)
    })
  })
}

Promise.prototype.catch = function (onRejected) { // 利用 promise 穿透
  return this.then(null, onRejected)
}

Promise.resolve = function (value) {
  return new Promise(resolve => {
    resolve(value)
  })
}

Promise.reject = function (reason) {
  return new Promise((resolve, reject) => {
    reject(reason)
  })
}

/**
 * 基于 Promise 实现 Deferred 的
 * Deferred 和 Promise 的关系
 * - Deferred 拥有 Promise
 * - Deferred 具备对 Promise的状态进行操作的特权方法（resolve reject）
 *
 * 参考 jQuery.Deferred：http://api.jquery.com/category/deferred-object/
 */
Promise.deferred = Promise.defer = function () {
  var defer = {}
  defer.promise = new Promise(function (resolve, reject) {
    defer.resolve = resolve
    defer.reject = reject
  })
  return defer
}

module.exports = Promise
