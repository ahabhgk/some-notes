Array.prototype.asyncReduceRight = async function asyncReduceRight(reducer, initialVal) {
  let result = initialVal
  const arr = this.reverse()
  for (let i = 0; i < arr.length; i++) {
    result = await reducer(result, arr[i], i, arr)
  }
  return result
}

const compose = (fns) =>
  (context, next) => fns.asyncReduceRight(
    (acc, cur) => {
      console.log(acc)
      return Promise.resolve(cur(context, () => acc))
    },
    Promise.resolve('resolve'),
  )

// function compose (middleware) {
//   // 检查参数
//   if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
//   for (const fn of middleware) {
//     if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
//   }

//   return function (context, next) {
//     // last called middleware #
//     let index = -1
//     return dispatch(0)
//     function dispatch (i) {
//       if (i <= index) return Promise.reject(new Error('next() called multiple times'))
//       index = i
//       let fn = middleware[i]
//       if (i === middleware.length) fn = next
//       if (!fn) return Promise.resolve()
//       try {
//         return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
//       } catch (err) {
//         return Promise.reject(err)
//       }
//     }
//   }
// }

const sleep = (time) => new Promise(resolve => setTimeout(() => resolve(time), time))

const ctx = { body: 0 }

const middlewares = [
  async (ctx, next) => {
    ctx.body = 0
    console.log(ctx.body) // 0
    await next().then(() => {
      ctx.body = 7
      console.log(ctx.body) // 7
    })
  },
  async (ctx, next) => {
    ctx.body = 1
    console.log(ctx.body) // 1
    await next().then(() => {
      ctx.body = 6
      console.log(ctx.body) // 6
    })
  },
  async (ctx, next) => {
    await sleep(1000)
    ctx.body = 2
    console.log(ctx.body) // 2
    await next().then(() => {
      ctx.body = 5
      console.log(ctx.body) // 5
    })
  },
  async (ctx, next) => {
    await sleep(1000)
    ctx.body = 3
    console.log(ctx.body) // 3
    await next().then((r) => {
      console.log(r)
      ctx.body = 4
      console.log(ctx.body) // 4
    })
  },
]

compose(middlewares)(ctx)


// ;(async (ctx, next) => {
//   ctx.body = 0
//   console.log(ctx.body) // 0
//   await Promise.resolve(
//     (async (ctx, next) => {
//       ctx.body = 1
//       console.log(ctx.body) // 1
//       await Promise.resolve(
//         (async (ctx, next) => {
//           await sleep(1000)
//           ctx.body = 2
//           console.log(ctx.body) // 1
//           await Promise.resolve(
//             (async (ctx, next) => {
//               await sleep(1000)
//               ctx.body = 3
//               console.log(ctx.body) // 1
//               await next().then(() => {
//                 ctx.body = 4
//                 console.log(ctx.body) // 6
//               })
//             })(ctx, next)
//           ).then(() => {
//             ctx.body = 5
//             console.log(ctx.body) // 6
//           })
//         })(ctx, next)
//       ).then(() => {
//         ctx.body = 6
//         console.log(ctx.body) // 6
//       })
//     })(ctx, next)
//   ).then(() => {
//     ctx.body = 7
//     console.log(ctx.body) // 7
//   })
// })(ctx, () => Promise.resolve())