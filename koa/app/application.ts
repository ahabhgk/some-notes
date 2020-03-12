import { createServer, IncomingMessage, ServerResponse } from 'http'
import { EventEmitter } from 'events'
import { Stream } from 'stream'

import { Middleware, ComposedMiddleware, Context } from './types'
import { ServerError } from './ServerError.class'
import { codes } from './codes'

export default class Application extends EventEmitter {
  private middleware: Middleware[]

  constructor() {
    super()
    this.middleware = []
  }

  use(fn: Middleware) {
    this.middleware.push(fn)
    return this
  }

  createContext(req: IncomingMessage, res: ServerResponse): Context {
    return {
      req,
      res,
      app: this,
      onerror(err) {
        this.app.emit('error', err)
        res.end(`${err.status}: ${codes[err.status]}`)
      },
      throwError(status, message) {
        throw new ServerError(status, message)
      },
      body: null,
    }
  }

  handleRequest(ctx: Context, fnMiddleware: ComposedMiddleware) {
    ctx.res.statusCode = 404
    return fnMiddleware(ctx)
      .then(() => respond(ctx))
      .catch((err: ServerError) => ctx.onerror(err))
  }

  callback() {
    const fn = compose(this.middleware)
    this.on('error', this.onerror)

    return (req: IncomingMessage, res: ServerResponse) => {
      const ctx = this.createContext(req, res)
      return this.handleRequest(ctx, fn)
    }
  }

  // 本来想用 infer 实现的 ParamsType<Server['listen']> 拿参数，但是发现拿到的是最后的重载（最通用的）
  // 并没有什么用，所以为了简洁只写了一个比较常用的
  listen(port: number, listeningListener?: () => void) {
    const server = createServer(this.callback())
    return server.listen(port, listeningListener)
  }

  onerror(err: ServerError) {
    if (err.status === 404) return
    console.error(err)
  }
}

function respond<T extends Context = Context>(ctx: T) {
  const { body, res } = ctx
  if (body == null) return res.end()
  else if (body instanceof Stream) return body.pipe(res)
  else if (body instanceof Object) return res.end(JSON.stringify(body))
  else return res.end(body)
}

function compose(...args: any) {
  return 1 as unknown as ComposedMiddleware
}
