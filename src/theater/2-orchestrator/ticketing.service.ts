import type { Logger } from 'pino'

export class TicketingService {
  #logger: Logger

  constructor(logger: Logger) {
    this.#logger = logger
  }

  printTicket(numberOfSeats: number) {
    this.#logger.info(`ticket printed with ${numberOfSeats} seats!`)
  }
}
