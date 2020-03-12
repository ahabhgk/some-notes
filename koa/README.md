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
// TODO
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

我们发现这其实和 JS 的 FP 中 compose 很像，我们用 reduce 实现试试：

```ts
// compose
const compose = (fns) =>
  (context, next) => fns.reduceRight(
    (acc, cur) => Promise.resolve(cur(context, () => acc)),
    Promise.resolve('resolve'),
  )

const sleep = (time) => new Promise(resolve => setTimeout(() => resolve(time), time))

const ctx = { body: 0 }

const middlewares = [
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
```

这时发现只会停顿 1 秒，然后顺序也不对，而换成官方的 compose 就一切正常，停顿两秒同时顺序正确，这是因为 reduce 和 reduceRight 是同步的，只停顿一秒是因为两个 sleep 并行了（类似 `Promise.all([asyncFn1, asyncFn2])`），Koa 中间件的特殊与对处理请求的进步点就在于此，不同于 express 和 redux 的中间件机制，Koa 实现的是**异步中间件**

同时这样也可以通过 i 来检查一个 middleware 中是否多次调用 next 的作用，Koa 没有使用这种方式也是为了保证 i 可以检查多次调用 next

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

看完中间件机制再来看 http 请求从接受到响应就简单了，this.callback 返回的就是 http.createServer 的回调函数，所以 req res 从这里接收，之后 req res 进入 createContext 挂载到 ctx 对象上，之后把组合好的 fnMiddleware 和 ctx 传入 this.handleRequest，这里处理好 onerror 和 respond 之后开始把 ctx 传入 fnMiddleware，通过开发者编写的中间件对 req res 进行真正的处理，最后处理好后通过 `.then(() => respond(ctx))` 作出响应

## 代理原生 req res // FIX

我们对 ctx 上处理一般是对 ctx.request 和 ctx.response 处理，但 request response 只是对原生 req res 做的代理，最终的修改还是对 req res 的修改，我们通过几处看看这层代理有什么作用

1. request 的 get 方法，这里为了那请求头的字段，对 referer 和 referrer 做了兼容

    > Referer 的正确拼写是 Referrer，但是写入标准的时候，不知为何，没人发现少了一个字母 r。标准定案以后，只能将错就错，所有头信息的该字段都一律错误拼写成 Referer

    ```ts
    get(field) {
      const req = this.req;
      switch (field = field.toLowerCase()) {
        case 'referer':
        case 'referrer':
          return req.headers.referrer || req. headers.referer || '';
        default:
          return req.headers[field] || '';
      }
    },
    ```

2. get set 中处理 req res，是开发者更方便的拿到一些数据

    ```ts
    get query() {
      const str = this.querystring;
      const c = this._querycache = this.  _querycache || {};
      return c[str] || (c[str] = qs.parse(str)) ;
    },

    set query(obj) {
      this.querystring = qs.stringify(obj);
    },
    ```

    ```ts
    set etag(val) {
      if (!/^(W\/)?"/.test(val)) val = `"${val} "`;
      this.set('ETag', val);
    },

    get etag() {
      return this.get('ETag');
    },
    ```

3. response 中 body 的处理，对于不同格式 body 的赋值，在 set 中对 type、length 等连同一起处理，方便开发者

    ```ts
    get body() {
      return this._body;
    },

    set body(val) {
      const original = this._body;
      this._body = val;

      // no content
      if (null == val) {
        if (!statuses.empty[this.status]) this. status = 204;
        this.remove('Content-Type');
        this.remove('Content-Length');
        this.remove('Transfer-Encoding');
        return;
      }

      // set the status
      if (!this._explicitStatus) this.status =  200;

      // set the content-type only if not yet   set
      const setType = !this.has('Content-Type') ;

      // string
      if ('string' == typeof val) {
        if (setType) this.type = /^\s*</.test (val) ? 'html' : 'text';
        this.length = Buffer.byteLength(val);
        return;
      }

      // buffer
      if (Buffer.isBuffer(val)) {
        if (setType) this.type = 'bin';
        this.length = val.length;
        return;
      }

      // stream
      if ('function' == typeof val.pipe) {
        onFinish(this.res, destroy.bind(null,   val));
        ensureErrorHandler(val, err => this.  ctx.onerror(err));

        // overwriting
        if (null != original && original !=   val) this.remove('Content-Length');

        if (setType) this.type = 'bin';
        return;
      }

      // json
      this.remove('Content-Length');
      this.type = 'json';
    },
    ```

4. response 中 redirect 的封装，context 中 cookie 的封装，提供一些封装好的方法

    ```ts
    redirect(url, alt) {
      // location
      if ('back' == url) url = this.ctx.get ('Referrer') || alt || '/';
      this.set('Location', encodeUrl(url));

      // status
      if (!statuses.redirect[this.status])  this.status = 302;

      // html
      if (this.ctx.accepts('html')) {
        url = escape(url);
        this.type = 'text/html; charset=utf-8';
        this.body = `Redirecting to <a href="$  {url}">${url}</a>.`;
        return;
      }

      // text
      this.type = 'text/plain; charset=utf-8';
      this.body = `Redirecting to ${url}.`;
    },
    ```

    ```ts
    get cookies() {
      if (!this[COOKIES]) {
        this[COOKIES] = new Cookies(this.req,   this.res, {
          keys: this.app.keys,
          secure: this.request.secure
        });
      }
      return this[COOKIES];
    },

    set cookies(_cookies) {
      this[COOKIES] = _cookies;
    }
    ```

5. 提供 toJSON 方便调试

    ```ts
    toJSON() {
      return {
        request: this.request.toJSON(),
        response: this.response.toJSON(),
        app: this.app.toJSON(),
        originalUrl: this.originalUrl,
        req: '<original node req>',
        res: '<original node res>',
        socket: '<original node socket>'
      };
    },
    ```

其他还有在 ctx 用 [delegate 库](https://github.com/tj/node-delegates)对一些常用数据直接代理到 ctx 对象上（ctx.body === ctx.response.body）

## 错误处理

官方有三种方式：

1. 中间件中 `try/catch`

2. 添加错误处理中间件（或使用默认的）

3. 处理 error 事件（默认是打 log）

第一种没什么好说的，第二种中默认的就是 `this.handleRequest` 中的 onerror，直接使用 `const onerror = err => ctx.onerror(err)` 处理，ctx.onerrer 会用 [statuses 库](https://github.com/jshttp/statuses)对 error.code 作出对应的响应信息，同时 ctx.onerror 还会触发（emit）error 事件（Application 继承 EventEmitter），app 默认的 `on('error', this.onerror)` 是对错误信息打 log

一般默认的就够用了，如果有其他需求可以修改 app.onerror 或添加错误中间件处理

```ts
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // will only respond with JSON
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      message: err.message
    };
  }
})
```

这里相当于在第一个中间件 catch 之后中间件的错误，在 respond 之前处理好错误然后通过 respond 响应，错误就不会被之后 `.catch` 抓住，以此覆盖默认的 onerror

## 流

http 请求非常适合看作一个流，Koa 中 use 的中间件相当于一个管道，对 ctx 流的数据进行处理，处理完后 respond

结合 RxJS 的伪代码：

```ts
const server = http
  .createServer()
  .listen(8080, () => console.log('Server is running on port 8080...'))

const server$ = fromEvent<[IncomingMessage, ServerResponse]>(server, 'request')
const ctx$ = server$.pipe(map(([req, res]) => ({ req, res })))

ctx$.pipe(
  map(routerMiddleware),
  map(controllerMiddleware),
  map(serverMiddleware),
  map(errorHandlerMiddleware),
).subscribe({
  next: respond,
  error: defaultErrorHandler,
  complete: defaultCompleteHandler,
})
```

当然非常不完整，只是一个想法的体现，其实已经有人实现了用 RxJS 的后端框架：[marblejs](https://github.com/marblejs/marble)，当然我们还是要结合实际进行选择

## 结语

使用 TypeScript 实现了一个简易版的 Koa，删减了很多 ctx 对 request response 的处理，只体现了核心思路，感兴趣可以看看：[ts-koa-core]()

通过看 Koa 源码同时简单看了看相关依赖的库的源码，也算对以前不理解的地方有了更清晰的理解

以前对 cookie、etag 什么的不知道到底怎么写的，现在发现其实就是对 node 的 req res 的修改，当然 node 底层也做了很多，但也算在一定抽象层次上明白了后端其实是对 req res 的处理，同时作出 side effect，复杂时就需要处理复杂情况

还用中间件机制为什么 compose 与 FP 常写的 compose 很不一样，还有 i 对多次调用 next 的检查真的非常巧妙，真的非常佩服 TJ 大神
