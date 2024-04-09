import type { InventoryService } from './inventory.service.js'
import type { TicketingService } from './ticketing.service.js'

export class TheaterOrchestrator {
  #inventoryService: InventoryService
  #ticketingService: TicketingService

  constructor(
    inventoryService: InventoryService,
    ticketingService: TicketingService,
  ) {
    this.#inventoryService = inventoryService
    this.#ticketingService = ticketingService
  }

  run(numberOfSeats: number): void {
    this.#inventoryService.reserveInventory(numberOfSeats)
    this.#ticketingService.printTicket(numberOfSeats)
  }
}
