import { fromEvent } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { createServer, IncomingMessage, ServerResponse } from 'http'

const server = createServer()

const server$ = fromEvent<[IncomingMessage, ServerResponse]>(server, 'request')

server.listen(8080, () => console.log('Server is running on port 8080...'))

const ctx$ = server$.pipe(map(([req, res]) => ({ req, res })))

ctx$.pipe(
  map(routerMiddleware),
  map(controllerMiddleware),
  map(serverMiddleware),
).subscribe({
  next: respond,
  error: errorHandler,
  complete: completeHandler,
})
