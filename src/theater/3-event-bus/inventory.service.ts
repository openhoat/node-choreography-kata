import type { Logger } from 'pino'
import {
  type TheaterEventBusService,
  TheaterEventName,
} from './theater-event-bus.service.js'
import type { Service } from './types/service.js'

export class InventoryService implements Service {
  #logger: Logger
  #availableSeats: number
  #eventBus: TheaterEventBusService
  readonly #reserveInventoryListener: (numberOfSeats: number) => void

  constructor(
    logger: Logger,
    availableSeats: number,
    eventBus: TheaterEventBusService,
  ) {
    this.#logger = logger
    this.#availableSeats = availableSeats
    this.#eventBus = eventBus
    this.#reserveInventoryListener = (numberOfSeats: number) => {
      this.reserveInventory(numberOfSeats)
    }
  }

  reserveInventory(numberOfSeats: number) {
    if (this.#availableSeats < numberOfSeats) {
      this.#eventBus.send(
        TheaterEventName.RESERVE_INVENTORY_ERROR,
        'No more seats available',
      )
      return
    }
    this.#availableSeats -= numberOfSeats
    this.#logger.info(`inventory reserved with ${numberOfSeats} seats!`)
    this.#logger.info(`remaining capacity: ${this.#availableSeats}`)
    this.#eventBus.send(
      TheaterEventName.INVENTORY_RESERVED,
      this.#availableSeats,
    )
  }

  async start() {
    this.#eventBus.on(
      TheaterEventName.RESERVE_INVENTORY,
      this.#reserveInventoryListener,
    )
    return Promise.resolve()
  }

  async stop() {
    this.#eventBus.off(
      TheaterEventName.RESERVE_INVENTORY,
      this.#reserveInventoryListener,
    )
    return Promise.resolve()
  }
}
