import { EventEmitter } from 'node:events'
import type { Logger } from 'pino'
import type { EventBusService } from '../index.js'

export class MemoryEventBusService<E extends string = string>
  implements EventBusService<E>
{
  #logger: Logger
  #eventEmitter: EventEmitter

  constructor(logger: Logger) {
    this.#logger = logger
    this.#eventEmitter = new EventEmitter()
  }

  send(eventName: E, data?: unknown) {
    this.#logger.debug(
      `sending event: ${eventName} with ${data instanceof Error ? data.message : JSON.stringify(data)}`,
    )
    this.#eventEmitter.emit(eventName, data)
  }

  on<T>(eventName: E, listener: (data: T) => void) {
    this.#logger.debug(`register listener for event: ${eventName}`)
    this.#eventEmitter.on(eventName, listener)
  }

  once<T>(eventName: E, listener: (data: T) => void) {
    this.#logger.debug(`register once listener for event: ${eventName}`)
    this.#eventEmitter.once(eventName, listener)
  }

  off<T>(eventName: E, listener: (data: T) => void) {
    this.#logger.debug(`unregister listener for event: ${eventName}`)
    this.#eventEmitter.off(eventName, listener)
  }

  sendAndWait<T>(
    sendEventName: E,
    successEventName: E,
    errorEventName: E,
    data?: unknown,
  ): Promise<T> {
    this.#logger.debug(
      `sending event ${sendEventName} and waiting for event ${successEventName}…`,
    )
    return new Promise((resolve, reject) => {
      const successListener = (data: T) => {
        this.off(errorEventName, errorListener)
        resolve(data)
      }
      const errorListener = (error: Error) => {
        this.off(successEventName, successListener)
        reject(error)
      }
      this.once(successEventName, successListener)
      this.once(errorEventName, errorListener)
      this.send(sendEventName, data)
    })
  }

  start() {
    for (const eventName of Object.values(Event)) {
      this.#eventEmitter.on(eventName, (data) => {
        this.#logger.debug(
          `received event: ${eventName} with ${JSON.stringify(data)}`,
        )
      })
    }
    return Promise.resolve()
  }

  stop() {
    this.#eventEmitter.removeAllListeners()
    return Promise.resolve()
  }
}
