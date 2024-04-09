import type { Logger } from 'pino'
import type { Service } from '../../service'
import { Event, type EventBus } from '../shared/event.bus'

export class TicketingService implements Service {
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

  async start() {
    this.#eventBus.on(Event.PRINT_TICKET, this.#printTicketEventlistener)
    return Promise.resolve()
  }

  async stop() {
    this.#eventBus.off(Event.PRINT_TICKET, this.#printTicketEventlistener)
    return Promise.resolve()
  }
}
