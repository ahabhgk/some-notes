const { EventEmitter } = require('events')

const isFunction = obj => typeof obj === 'function'
const isObject = obj => !!(obj && typeof obj === 'object') // null 的情况
const isThenable = obj => (isFunction(obj) || isObject(obj)) && 'then' in obj
const isEPromise = promise => promise instanceof EPromise

const PENDING = Symbol('PENDING')
const FULFILLED = Symbol('FULFILLED')
const REJECTED = Symbol('REJECTED')

const resolvePromise = (promise, result, resolve, reject) => {
  if (result === promise) {
    return reject(new TypeError('Can not fufill promise with itself'))
  }

  if (isEPromise(result)) {
    return result.then(resolve, reject)
  }

  if (isThenable(result)) {
    try {
      let then = result.then
      if (isFunction(then)) {
        return new EPromise(then.bind(result)).then(resolve, reject)
      }
    } catch (error) {
      return reject(error)
    }
  }

  resolve(result)
}

class EPromise extends EventEmitter {
  constructor(f) {
    super()

    this.state = PENDING
    this.value = undefined
    this.reason = undefined

    const onFulfilled = (value) => {
      if (this.state === PENDING) {
        this.state = FULFILLED
        this.value = value
        setTimeout(() => this.emit('resolve'), 0)
      }
    }
    const onRejected = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED
        this.reason = reason
        setTimeout(() => this.emit('reject'), 0)
      }
    }

    const resolve = (value) => {
      resolvePromise(this, value, onFulfilled, onRejected)
    }
    const reject = (reason) => {
      onRejected(reason)
    }

    try {
      f(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    const p = new EPromise((resolve, reject) => {
      if (this.state === PENDING) {
        this.once('resolve', () => resolve(onFulfilled(this.value)))
        this.once('reject', () => reject(onRejected(this.reason)))
      } else if (this.state === FULFILLED) {
        setTimeout(() => resolve(onFulfilled(this.value)), 0)
      } else if (this.state === REJECTED) {
        setTimeout(() => reject(onRejected(this.reason)), 0)
      } else throw new Error('promise state error')
    })
    return p
  }

  catch(f) {
    this.then(v => v, f)
  }

  static resolve(v) {
    if (isEPromise(v)) return v
    return new EPromise(resolve => resolve(v))
  }

  static reject(r) {
    return new EPromise((_, reject) => reject(r))
  }
}

// new EPromise((resolve, reject) => {
//   setTimeout(() => resolve(1), 1000)
//   // resolve(1)
// }).then(v => {
//   console.log(v)
//   return v + 1
// }).then(v => {
//   console.log(v)
//   return v + 1
// })

module.exports = {
  resolved: value => EPromise.resolve(value),
  rejected: reason => EPromise.reject(reason),
  deferred: () => {
    let promise, resolve, reject
    promise = new EPromise(($resolve, $reject) => {
      resolve = $resolve
      reject = $reject
    })
    return { promise, resolve, reject }
  },
}
