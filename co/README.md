# co 与异步的一些思考

JavaScript 的异步编程发展经过了四个阶段：

1. 回调函数、发布订阅

2. Promise

3. co 自执行的 Generator 函数

4. async / await

第三阶段现在基本不用了，但也起到了承上启下的作用

## co

co 接收一个 generator 函数，返回一个 promise，generator 函数中 yieldable 对象有：

* promises

* thunks (functions)

* array (parallel execution)

* objects (parallel execution)

* generators (delegation)

* generator functions (delegation)

其中 array 和 objects 是并行执行的，里面的值仍然是 promise 和 thunk 函数，而 generators 和 generator functions 是通过代理执行，内部再次调用 co，所以简单来说都是基于 promise 和 thunk 函数的，而 co 内部对于 thunk 的处理是把 thunk 也转化成 promise，所以直接看对于 yield 一个 promise 的 generator 怎么自动执行

```ts
function* gen() {
  const foo = yield Promise.resolve(1)
  const bar = yield Promise.resolve(2)
  console.log(foo)
  console.log(bar)
}

const gen = gen()
// next 出来的 value 是个 Promise.resolve(1)
g.next().value.then((data) => {
  // 想让 yield 左边的变量拿到 Promise.resolve 的值，就要在下一次 next 传入 data
  g.next(data).value.then((data) => {
    g.next(data)
  })
})
```

在直接套用 co 源码：

```ts
function co(gen) {
  // ...
  return new Promise((resolve, reject) => {
    const g = gen()

    const gResult = g.next() // 第一次 next
    if (gResult.done) resolve(gResult.value)
    if (gResult.value && isPromise(gResult.value)) {
      value.then((res) => {

        const gResult = g.next(res) // 第二次 next
        if (gResult.done) resolve(gResult.value)
        if (gResult.value && isPromise(gResult.value)) {
          value.then((res) => {

            const gResult = g.next(res) // 第三次 next，done 为 true
            if (gResult.done) resolve(gResult.value) // resolve 掉 generator 中 return 的结果
          })
        }
      })
    }
  })
}
```

在看 co 整体代码：

```ts
function co(gen) {
  var ctx = this; // 那 this，一般是 co.call 这样调用
  var args = slice.call(arguments, 1) // generator 的参数可以在 gen 后面传入

  return new Promise(function(resolve, reject) {
    // 检查 gen
    if (typeof gen === 'function') gen = gen.apply(ctx, args); // 普通函数就会调用得到返回值，下一行 resolve 返回值
    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    onFulfilled();

    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) { // try / catch 做错误捕获
        return reject(e);
      }
      next(ret);
    }

    function onRejected(err) {
      var ret;
      try {
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    function next(ret) {
      if (ret.done) return resolve(ret.value);
      var value = toPromise.call(ctx, ret.value); // 把其他的 yieldable 转化成 promise
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
        + 'but the following object was passed: "' + String(ret.value) + '"'));
    }
  });
}
```

其中 toPromise 针对不同的 yieldable 进行 xxxToPromise，arrayToPromise 是通过 Promise.all(value.map(toPromise)) 进行转换，objectToPromise 等待对象的所有的值都 resolve 后，并添加到新的对象中，然后再 resolve，类似于 Promise.all

thunkToPromise 类似于一般 Node.js 的 API 的 promisify，只不过是 thunk 函数已经传入了第一个参数，promisify 时只需要传入另一个参数就可以了，我们也可以看出这里 thunk 是针对 Node.js 的 API 的，与 curry 的不同在于 thunk 是分为两次参数传入的

```ts
function thunkToPromise(fn) {
  var ctx = this;
  return new Promise(function (resolve, reject) {
    fn.call(ctx, function (err, res) {
      if (err) return reject(err);
      if (arguments.length > 2) res = slice.call(arguments, 1);
      resolve(res);
    });
  });
}
```

isPromise 的判断也是通过查看参数的 then 是不是一个函数，体现了鸭子类型的特点

```ts
function isPromise(obj) {
  return 'function' == typeof obj.then;
}
```

## 原理

co 的原理其实是通过 generator.next() 得到 generatorResult，由于 yield 出是一个 promise，通过 generatorResult.value.then 再把 promise 的结果通过 generator.next 的参数传给 yield 的左边，让 generator 自动执行，通过 generatorResult.done 判断是否执行结束

## 思考

我们看最开始最朴素的 raw callback style，是将 callback 交给另一个函数执行，也就是说我们把 callback 的控制权交给这个函数，这个函数在进行完异步操作之后调用 callback，以此实现异步

而之后 promise 也是通过传入 callback 的方式，只不过把之前嵌套式的形式展开成链式，其实通过链表为函数增加 next 属性，也可以使嵌套式展开成链式。promise 通过完成异步操作后进行 resolve 或 reject，来控制 callback 的执行，而且提供了 then 返回一个 promise 的自动进行 flat（flatMap），实现了 then 中继续执行异步的操作，所以提供 callback 参数对于 promise 来说也是一种控制权的转移，只不过是从以前直接的函数调用改成了 resolve、reject 控制 callback 的调用时机，同时是一种标准的实现也相较于原来的 raw callback style 保证了内部的可控性

GeneratorFunction 得到的 Generator 可以通过 next 打断 GeneratorFunction 的执行，由于只能通过 Generator 调用 next 把 GeneratorFunction 的执行权还给 GeneratorFunction，所以称作“半协程”，通过保存 GeneratorFunction 的执行上下文，使 GeneratorFunction 可中断执行，从而把 GeneratorFunction 控制权交给 Generator，Generator 拿到控制权后通过 yield 出来的 promise 完成异步操作，等 resolve 之后再通过 then 中调用 next 把异步的结果和 GeneratorFunction 的控制权交给 GeneratorFunction，以继续执行 yield 后的操作

async 函数是对 GeneratorFunction + co 的语义化和标准化的语法糖，便捷性提升的同时也意味着灵活性的减少，由于 async / await 是语法，而 promise、callback 是对象，对象可以到处传递，React 也通过 throw 一个 promise 如此 creative and hacking 的模拟了 [Algebraic Effects](https://overreacted.io/algebraic-effects-for-the-rest-of-us/) 实现 Suspense。而 Promise 和 GeneratorFunction 也有约束，Promise 是 onFulfilled、onRejected 的约束，GeneratorFunction 是 next、done 的约束，Node.js APIs 中也限制了 cb 的参数，所以也能被统一的 thunk 化，这种约束类似于语法糖，规范的同时也丧失了些许灵活性

// TODO: RxJS 与 async 区别，RxJS 理念等

异步的关键就在于调用 callback 的时机，因为我们不知道异步操作需要多少时间，我们自然也就不知道何时调用异步之后的操作，所以我们通过 callback 将之后操作的控制权交给异步操作，实现控制反转，在异步操作完成之后自动调用 callback，就完成了在合适的时机进行合适的操作
