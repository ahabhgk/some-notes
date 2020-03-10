# Koa 源码分析

## 创建服务

### new Koa() 实例化

继承 EventEmitter，constructor 初始化参数

```ts
this.middleware = [];
this.context = Object.create(context);
this.request = Object.create(request);
this.response = Object.create(response);
```

### app.use(fn) 添加中间件

```ts
use(fn) {
  this.middleware.push(fn)
  return this
}
```

### app.listen(8080) 监听端口

```ts
listen(...args) {
  const server = http.createServer(this.callback());
  return server.listen(...args);
}
```

就是调用 http 创建服务的 listen，关键在于 createServer 的参数

#### this.callback() 返回什么

1. 组合中间件

2. 通过 EventEmitter 监听 error 事件，触发 error 时用 this.onerror 处理

3. 返回 handleRequest，作为 createServer 的回调函数，其中创建 ctx 然后调用自己的 handleRequest 传入 ctx 和组合好的中间件来处理请求

```ts
callback() {
  const fn = compose(this.middleware);

  if (!this.listenerCount('error')) this.on('error', this.onerror);

  const handleRequest = (req, res) => {
    const ctx = this.createContext(req, res);
    return this.handleRequest(ctx, fn);
  };

  return handleRequest;
}
```

##### this.createContext(req, res)

创建 ctx，挂载 Koa 的 request 和 response，挂载原生的 req 和 res

```ts
createContext(req, res) {
  const context = Object.create(this.context);
  const request = context.request = Object.create(this.request);
  const response = context.response = Object.create(this.response);
  context.app = request.app = response.app = this;
  context.req = request.req = response.req = req;
  context.res = request.res = response.res = res;
  request.ctx = response.ctx = context;
  request.response = response;
  response.request = request;
  context.originalUrl = request.originalUrl = req.url;
  context.state = {};
  return context;
}
```

##### this.handleRequest(ctx, fn)

这个可以说是第一个中间件，处理默认的 onerror 和最后用户响应的 respond

最后 `fnMiddleware(ctx).then(handleResponse).catch(onerror)` 可以看出组合的中间件返回一个 promise，之后调用 respond(ctx) 发送响应，这里 catch 是默认的错误处理

```ts
handleRequest(ctx, fnMiddleware) {
  const res = ctx.res;
  res.statusCode = 404;
  const onerror = err => ctx.onerror(err);
  const handleResponse = () => respond(ctx);
  onFinished(res, onerror);
  return fnMiddleware(ctx).then(handleResponse).catch(onerror);
}
```

中间件中通过给 ctx.body 赋值，传到 respond 中，对于不存在的状态码的请求响应 res.end()，respond 对于 HEAD 请求返回 res.end()，对于字符串和 Buffer 的 body 响应 res.end(body)，对于流的 body 响应 body.pipe(res)，最后通过 JSON.stringify(body) 处理其他的形式，如果是 JSON 则 res.end(body) 返回 stringify 得 JSON，如果报错通过后面 catch 处理，同时 fnMiddleware 中其他报错也通过 catch 处理

```ts
// respond
```

## 一条 http 请求：Koa 核心 - 异步中间件机制

直接先看怎样组合中间件

```ts
function compose (middleware) {
  // 检查参数
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

返回一个组合后的中间件，参数也和普通的中间件一样，dispatch 返回一个 Promise.resolve，从 dispatch(0) 开始展开写得到的 fnMiddleware 就是这样的：

```ts
// fnMiddleware
function fnMiddleware(context, next) {
  return Promise.resolve(middleware[0](context, function next() {
    return Promise.resolve(middleware[1](context, function next() {
      return Promise.resolve(middleware[2](context, function next() {
        return Promise.resolve() // 这里 i === middleware.length 同时 fn 就是 fnMiddleware(ctx) 中传入的 undefined，所以直接 resolve
      }))
    }))
  }))
}
```

通过 fnMiddleware(ctx) 传入 context，各个 middleware 对 ctx 上的属性进行更改添加（ctx.body、ctx.type……）由于 ctx 对象传入 middlware context 参数的值是 ctx 的地址，所以之后的 middleware 中可以得到之前 middleware 中修改后的 ctx，内部调用 `await next()` 就是 resolve 下一个 middleware，这样就实现了 Koa 的洋葱模型机制

我们也可以用更贴近 FP 的 compose 实现：

```ts
// compose
```

但是这样就忽略了 i 的作用，i 有两个作用，一个是作为 `middleware[i]` 推进 middleware，另一个是检查一个 middleware 中是否多次调用 next，Koa 没有使用这种方式也是为了保证 i 可以检查多次调用 next

```ts
function dispatch (i) {
  if (i <= index) return Promise.reject(new Error('next() called multiple times'))
  index = i // 这里修改 index
  let fn = middleware[0]
  if (i === middleware.length) fn = next
  if (!fn) return Promise.resolve()
  try {
    return Promise.resolve((async (ctx, next) => {
      // 假设现在是 dispatch(0)，此时 index = 0，i = 0
      await dispatch.bind(null, 0 + 1)() // 内部修改 index = 1
      await dispatch.bind(null, 0 + 1)() // 内部 i <= index：1 <= 1 成立 reject 掉
    })(context, dispatch.bind(null, 0 + 1)));
  } catch (err) {
    return Promise.reject(err)
  }
}
```

