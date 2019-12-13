// 参考：
// https://github.com/Lucifier129/promise-aplus-impl
// src/index.js 的实现其实更清晰，这篇在代码上更符合 Promises A+ 规范
// [工业聚：100 行代码实现 Promises/A+ 规范](https://zhuanlan.zhihu.com/p/83965949)

const isFunction = obj => typeof obj === 'function'
const isObject = obj => !!(obj && typeof obj === 'object') // null 的情况
const isThenable = obj => (isFunction(obj) || isObject(obj)) && 'then' in obj
const isPromise = promise => promise instanceof Promise

// 规范 1 描述了一些术语

// 规范 2.1
// Promise 的状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function Promise(f) {
  this.state = PENDING
  this.result = null
  this.callbacks = []

  let onFulfilled = value => transition(this, FULFILLED, value)
  let onRejected = reason => transition(this, REJECTED, reason)

  let ignore = false
  let resolve = value => {
    if (ignore) return
    ignore = true
    resolvePromise(this, value, onFulfilled, onRejected)
  }
  let reject = reason => {
    if (ignore) return
    ignore = true
    onRejected(reason)
  }

  try {
    f(resolve, reject)
  } catch (error) {
    reject(error)
  }
}

// 规范 2.2
// then 方法
Promise.prototype.then = function then(onFulfilled, onRejected) {
  return new Promise((resolve, reject) => {
    const callback = { onFulfilled, onRejected, resolve, reject }

    if (this.state === PENDING) {
      this.callbacks.push(callback)
    } else {
      // 规范 2.2.4
      // onFulfilled or onRejected must not be called until the execution context stack contains only platform code.
      // 我们不是在 JS 引擎层面实现 Promises，而是使用 JS 去实现 JS Promises
      // 在JS里无法主动控制自身 execution context stack
      // 可以通过 setTimeout/nextTick 等 API 间接实现，此处选用了 setTimeout
      setTimeout(() => handleCallback(callback, this.state, this.result), 0)
    }
  })
}

// handleCallback：在当前 promise 和下一个 promise 之间进行状态传递（notify）
// 规范 2.2.7
// handleCallback 函数，根据 state 状态，判断是走 fulfilled 路径，还是 rejected 路径。
// 先判断 onFulfilled/onRejected 是否是函数，如果是，以它们的返回值，作为下一个 promise 的 result。
// 如果不是，直接以当前 promise 的 result 作为下一个 promise 的 result。
// 如果 onFulfilled/onRejected 执行过程中抛错，那这个错误，作为下一个 promise 的 rejected reason 来用。
// then 方法核心用途是，构造下一个 promise 的 result。
const handleCallback = (callback, state, result) => {
  const { onFulfilled, onRejected, resolve, reject } = callback

  try {
    if (state === FULFILLED) {
      isFunction(onFulfilled) ? resolve(onFulfilled(result)) : resolve(result)
    } else if (state === REJECTED) {
      isFunction(onRejected) ? resolve(onRejected(result)) : reject(result)
    }
  } catch (e) {
    reject(e)
  }
}

// notifyAll
const handleCallbacks = (callbacks, state, result) => {
  while (callbacks.length) handleCallback(callbacks.shift(), state, result)
}

// transition：对单个 promise 进行状态迁移
const transition = (promise, state, result) => {
  if (promise.state !== PENDING) return
  promise.state = state
  promise.result = result
  // 当状态变更时，异步清空所有 callbacks
  setTimeout(() => handleCallbacks(promise.callbacks, state, result), 0)
}

// resolvePromise：对特殊的 result 进行特殊处理（checkValue）
// 规范 2.3
const resolvePromise = (promise, result, resolve, reject) => {
  if (result === promise) {
    let reason = new TypeError('Can not fufill promise with itself')
    return reject(reason)
  }

  if (isPromise(result)) {
    return result.then(resolve, reject)
  }

  if (isThenable(result)) {
    try {
      let then = result.then
      if (isFunction(then)) {
        return new Promise(then.bind(result)).then(resolve, reject)
      }
    } catch (error) {
      return reject(error)
    }
  }

  resolve(result)
}

// 原生实现的一些方法
Promise.prototype.catch = function (onRejected) {
	return this.then(null, onRejected)
}

Promise.resolve = value => new Promise(resolve => resolve(value))

Promise.reject = reason => new Promise((_, reject) => reject(reason))

Promise.all = (promises = []) => {
	return new Promise((resolve, reject) => {
		let count = 0
		let values = new Array(promises.length)
		let collectValue = index => value => {
			values[index] = value
			count += 1
			count === promises.length && resolve(values)
		}
		promises.forEach((promise, i) => {
			if (isPromise(promise)) {
        // 都 fulfilled 后再调用 resolve（resolve([values])）
				promise.then(collectValue(i), reject)
			} else {
				collectValue(i)(promise)
			}	
		})
	})
}

Promise.race = (promises = []) => {
	return new Promise((resolve, reject) =>
		promises.forEach(promise => {
			if (isPromise(promise)) {
        // 哪个 promise 最先 fulfilled 就调用 resolve
				promise.then(resolve, reject)
			} else {
				resolve(promise)
			}
		})
	)
}


module.exports = {
  resolved: value => Promise.resolve(value),
  rejected: reason => Promise.reject(reason),
  deferred: () => {
    let promise, resolve, reject
    promise = new Promise(($resolve, $reject) => {
      resolve = $resolve
      reject = $reject
    })
    return { promise, resolve, reject }
  },
}
