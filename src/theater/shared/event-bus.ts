import { EventEmitter } from 'node:events'
import { Logger } from 'pino'

export enum Event {
  ERROR = 'ERROR',
  RESERVE_INVENTORY = 'RESERVE_INVENTORY',
  INVENTORY_RESERVATION_SUCCESS = 'INVENTORY_RESERVATION_SUCCESS',
  PRINT_TICKET = 'PRINT_TICKET',
  PRINT_TICKET_SUCCESS = 'PRINT_TICKET_SUCCESS',
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

  sendError(error: Error) {
    this.#eventEmitter.emit(Event.ERROR, error)
  }

  on<T>(eventName: Event, listener: (data: T) => void) {
    this.#logger.debug(`register listener for event: ${eventName}`)
    this.#eventEmitter.on(eventName, (data) => {
      this.#logger.debug(
        `received event: ${eventName} with ${JSON.stringify(data)}`,
      )
      listener(data)
    })
  }

  once<T>(eventName: Event, listener: (data: T) => void) {
    this.#logger.debug(`register once listener for event: ${eventName}`)
    this.#eventEmitter.once(eventName, (data) => {
      this.#logger.debug(
        `received once event: ${eventName} with ${JSON.stringify(data)}`,
      )
      listener(data)
    })
  }

  onError(errorListener: (error: Error) => void) {
    this.#logger.debug('register error listener')
    this.#eventEmitter.on(Event.ERROR, (error: Error) => {
      this.#logger.debug(`received error: ${error}`)
      errorListener(error)
    })
  }

  sendAndWait<T>(
    sendEventName: Event,
    waitEventName: Event,
    data?: unknown,
  ): Promise<T> {
    this.#logger.debug(
      `sending event ${sendEventName} and waiting for event ${waitEventName}…`,
    )
    return new Promise((resolve) => {
      this.once(waitEventName, (data: T) => {
        resolve(data)
      })
      this.send(sendEventName, data)
    })
  }
}
