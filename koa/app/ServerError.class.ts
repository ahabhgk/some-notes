import { Status } from './codes'

export class ServerError extends Error {
  constructor(
    readonly status: Status,
    public message: string,
  ) {
    super(message)
    this.status = status
  }
}
