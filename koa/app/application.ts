import { EventEmitter } from 'events'

class Application extends EventEmitter {
  private middleware: Function[]

  constructor(options) {
    super()
  }
}
