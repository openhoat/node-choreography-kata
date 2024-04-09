import type { Logger } from 'pino'
import {
  type TheaterEventBusService,
  TheaterEventName,
} from './theater-event-bus.service.js'
import type { Service } from './types/service.js'

export class TicketingService implements Service {
  #logger: Logger
  #eventBus: TheaterEventBusService
  readonly #printTicketEventlistener: (numberOfSeats: number) => void

  constructor(logger: Logger, eventBus: TheaterEventBusService) {
    this.#logger = logger
    this.#eventBus = eventBus
    this.#printTicketEventlistener = (numberOfSeats: number) => {
      this.printTicket(numberOfSeats)
    }
  }

  printTicket(numberOfSeats: number) {
    this.#logger.info(`ticket printed with ${numberOfSeats} seats!`)
    this.#eventBus.send(TheaterEventName.TICKET_PRINTED, numberOfSeats)
  }

  async start() {
    this.#eventBus.on(
      TheaterEventName.PRINT_TICKET,
      this.#printTicketEventlistener,
    )
    return Promise.resolve()
  }

  async stop() {
    this.#eventBus.off(
      TheaterEventName.PRINT_TICKET,
      this.#printTicketEventlistener,
    )
    return Promise.resolve()
  }
}
