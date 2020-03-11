import { IncomingMessage, ServerResponse } from 'http'
import Application from './application'
import { ServerError } from './ServerError.class'
import { Status } from './codes'

type Next = () => Promise<unknown>

export type Middleware<T extends Context = Context> = (ctx: T, next: Next) => unknown

export type ComposedMiddleware<T extends Context = Context> = (context: T, next?: Next) => Promise<void>

export interface Context {
  req: IncomingMessage,
  res: ServerResponse,
  app: Application,
  onerror(err: ServerError): void,
  throwError(status: Status, message: string): never,
  body: any,
}
