import type { Logger } from 'pino'
import type { InventoryService } from './inventory.service.js'
import type { TicketingService } from './ticketing.service.js'

export class BookingService {
  #logger: Logger
  #inventoryService: InventoryService
  #ticketingService: TicketingService

  constructor(
    logger: Logger,
    inventoryService: InventoryService,
    ticketingService: TicketingService,
  ) {
    this.#logger = logger
    this.#inventoryService = inventoryService
    this.#ticketingService = ticketingService
  }

  requestBooking(numberOfSeats: number): void {
    this.#logger.info(`booking requested with ${numberOfSeats} seats!`)
    this.#inventoryService.reserveInventory(numberOfSeats)
    this.#ticketingService.printTicket(numberOfSeats)
  }
}
