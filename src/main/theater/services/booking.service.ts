import type { Logger } from 'pino'
import { Event, type EventBus } from '../shared/event.bus'

export class BookingService {
  #logger: Logger
  #eventBus: EventBus

  constructor(logger: Logger, eventBus: EventBus) {
    this.#logger = logger
    this.#eventBus = eventBus
  }

  async requestBooking(numberOfSeats: number): Promise<void> {
    this.#logger.info(`booking requested with ${numberOfSeats} seats!`)
    await this.#eventBus.sendAndWait(
      Event.RESERVE_INVENTORY,
      Event.INVENTORY_RESERVED,
      Event.RESERVE_INVENTORY_ERROR,
      numberOfSeats,
    )
    await this.#eventBus.sendAndWait(
      Event.PRINT_TICKET,
      Event.TICKET_PRINTED,
      Event.PRINT_TICKET_ERROR,
      numberOfSeats,
    )
  }
}
