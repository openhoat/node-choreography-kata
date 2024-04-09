import type { Logger } from 'pino'
import type { Service } from '../../service'
import { Event, type EventBus } from '../shared/event.bus'

export class InventoryService implements Service {
  #logger: Logger
  #availableSeats: number
  #eventBus: EventBus
  readonly #reserveInventoryListener: (numberOfSeats: number) => void

  constructor(logger: Logger, availableSeats: number, eventBus: EventBus) {
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
        Event.RESERVE_INVENTORY_ERROR,
        new Error('No more seats available'),
      )
      return
    }
    this.#availableSeats -= numberOfSeats
    this.#logger.info(`inventory reserved with ${numberOfSeats} seats!`)
    this.#logger.info(`remaining capacity: ${this.#availableSeats}`)
    this.#eventBus.send(Event.INVENTORY_RESERVED, this.#availableSeats)
  }

  async start() {
    this.#eventBus.on(Event.RESERVE_INVENTORY, this.#reserveInventoryListener)
    return Promise.resolve()
  }

  async stop() {
    this.#eventBus.off(Event.RESERVE_INVENTORY, this.#reserveInventoryListener)
    return Promise.resolve()
  }
}
