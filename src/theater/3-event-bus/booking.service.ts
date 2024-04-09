import type { Logger } from 'pino'
import {
  type TheaterEventBusService,
  TheaterEventName,
} from './theater-event-bus.service.js'

export class BookingService {
  #logger: Logger
  #eventBus: TheaterEventBusService

  constructor(logger: Logger, eventBus: TheaterEventBusService) {
    this.#logger = logger
    this.#eventBus = eventBus
  }

  async requestBooking(numberOfSeats: number): Promise<void> {
    this.#logger.info(`booking requested with ${numberOfSeats} seats!`)
    await this.#eventBus.sendAndWait(
      TheaterEventName.RESERVE_INVENTORY,
      TheaterEventName.INVENTORY_RESERVED,
      TheaterEventName.RESERVE_INVENTORY_ERROR,
      numberOfSeats,
    )
    await this.#eventBus.sendAndWait(
      TheaterEventName.PRINT_TICKET,
      TheaterEventName.TICKET_PRINTED,
      TheaterEventName.PRINT_TICKET_ERROR,
      numberOfSeats,
    )
  }
}
