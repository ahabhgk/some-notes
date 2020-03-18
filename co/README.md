# co 源码分析

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

const iter = gen()
// next 出来的 value 是个 Promise.resolve(1)
iter.next().value.then((data) => {
  // 想让 yield 左边的变量拿到 Promise.resolve 的值，就要在下一次 next 传入 data
  iter.next(data).value.then((data) => {
    iter.next(data)
  })
})
```

在直接套用 co 源码：

```ts
function co(gen) {
  // ...
  return new Promise((resolve, reject) => {
    const iter = gen()

    const iterResult = iter.next() // 第一次 next
    if (iterResult.done) resolve(iterResult.value)
    if (iterResult.value && isPromise(iterResult.value)) {
      value.then((res) => {

        const iterResult = iter.next(res) // 第二次 next
        if (iterResult.done) resolve(iterResult.value)
        if (iterResult.value && isPromise(iterResult.value)) {
          value.then((res) => {

            const iterResult = iter.next(res) // 第三次 next，done 为 true
            if (iterResult.done) resolve(iterResult.value) // resolve 掉 generator 中 return 的结果
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

## async / await

## WHY
