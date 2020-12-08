type ExtractType<T> =
  T extends { [Symbol.iterator](): { next(): { done: true, value: infer U } } } ? U :
  T extends { [Symbol.iterator](): { next(): { done: false } } } ? never :
  T extends { [Symbol.iterator](): { next(): { value: infer U } } } ? U :
  T extends { [Symbol.iterator](): any } ? unknown :
  never

type Async = <F extends (...args: any[]) => Generator<unknown>>(fn: F) => (...args: Parameters<F>) => Promise<ExtractType<ReturnType<F>>>

const async: Async = (genFn) => (...args) => {
  return new Promise((resolve, reject) => {
    const gen = genFn(...args)

    function next(nextF: () => IteratorResult<unknown>) {
      let result: ReturnType<typeof nextF>
      try {
        result = nextF()
      } catch(e) {
        return reject(e)
      }
      if(result.done) return resolve(result.value)
      Promise.resolve(result.value).then((res) => {
        next(() => gen.next(res))
      }, (err) => {
        next(() => gen.throw(err))
      })
    }

    next(() => gen.next(undefined))

    // const next = (result: IteratorResult<unknown>) => {
    //   if (result.done) return resolve(result.value)
    //   Promise.resolve(result.value).then(onFulfilled, onRejected)
    // }

    // const onFulfilled = (res: unknown) => {
    //   let result: IteratorResult<unknown>
    //   try {
    //     result = gen.next(res)
    //   } catch (e) {
    //     return reject(e)
    //   }
    //   next(result)
    // }

    // const onRejected = (err: any) => {
    //   let result: IteratorResult<unknown>
    //   try {
    //     result = gen.throw(err)
    //   } catch (e) {
    //     return reject(e)
    //   }
    //   next(result)
    // }

    // onFulfilled(undefined)
  })
}

let getData = async(function * (url: string) {
  let result: Response = yield fetch(url)
  let json = yield result.json()
  return json
})

getData('sxx')

// let getD = async (url: string) => {
//   let result = await fetch(url)
//   let json = await result.json()
//   return json
// }


console.log('script start')

let async1 = async(function * () {
  yield async2()
  console.log('async1 end')
})
let async2 = async(function * () {
  console.log('async2 end')
})
async1()

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
