import type { Logger } from 'pino'

export class InventoryService {
  #logger: Logger
  #availableSeats: number

  constructor(logger: Logger, availableSeats: number) {
    this.#logger = logger
    this.#availableSeats = availableSeats
  }

  reserveInventory(numberOfSeats: number) {
    if (this.#availableSeats < numberOfSeats) {
      throw new Error('No more seats available')
    }
    this.#availableSeats -= numberOfSeats
    this.#logger.info(`inventory reserved with ${numberOfSeats} seats!`)
    this.#logger.info(`remaining capacity: ${this.#availableSeats}`)
  }
}
