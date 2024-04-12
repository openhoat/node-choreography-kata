import { EventBus, Event } from '../shared/event-bus'
import { Logger } from 'pino'

export class TicketingService {
  #logger: Logger
  #eventBus: EventBus
  readonly #printTicketEventlistener: (numberOfSeats: number) => void

  constructor(logger: Logger, eventBus: EventBus) {
    this.#logger = logger
    this.#eventBus = eventBus
    this.#printTicketEventlistener = (numberOfSeats: number) => {
      this.printTicket(numberOfSeats)
    }
  }

  printTicket(numberOfSeats: number) {
    this.#logger.info(`ticket printed with ${numberOfSeats} seats!`)
    this.#eventBus.send(Event.TICKET_PRINTED)
  }

  start() {
    this.#eventBus.on(Event.PRINT_TICKET, this.#printTicketEventlistener)
  }

  stop() {
    this.#eventBus.off(Event.PRINT_TICKET, this.#printTicketEventlistener)
  }
}
