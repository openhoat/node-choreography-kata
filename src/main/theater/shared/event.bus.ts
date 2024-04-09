import { EventEmitter } from 'node:events'
import type { Logger } from 'pino'

export enum Event {
  RESERVE_INVENTORY = 'RESERVE_INVENTORY',
  INVENTORY_RESERVED = 'INVENTORY_RESERVED',
  RESERVE_INVENTORY_ERROR = 'RESERVE_INVENTORY_ERROR',
  PRINT_TICKET = 'PRINT_TICKET',
  TICKET_PRINTED = 'TICKET_PRINTED',
  PRINT_TICKET_ERROR = 'PRINT_TICKET_ERROR',
}

export class EventBus {
  #logger: Logger
  #eventEmitter: EventEmitter

  constructor(logger: Logger) {
    this.#logger = logger
    this.#eventEmitter = new EventEmitter()
  }

  send(eventName: Event, data?: unknown) {
    this.#logger.debug(
      `sending event: ${eventName} with ${JSON.stringify(data)}`,
    )
    this.#eventEmitter.emit(eventName, data)
  }

  on<T>(eventName: Event, listener: (data: T) => void) {
    this.#logger.debug(`register listener for event: ${eventName}`)
    this.#eventEmitter.on(eventName, listener)
  }

  once<T>(eventName: Event, listener: (data: T) => void) {
    this.#logger.debug(`register once listener for event: ${eventName}`)
    this.#eventEmitter.once(eventName, listener)
  }

  off<T>(eventName: Event, listener: (data: T) => void) {
    this.#logger.debug(`unregister listener for event: ${eventName}`)
    this.#eventEmitter.off(eventName, listener)
  }

  sendAndWait<T>(
    sendEventName: Event,
    successEventName: Event,
    errorEventName: Event,
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
  }

  stop() {
    this.#eventEmitter.removeAllListeners()
  }
}
