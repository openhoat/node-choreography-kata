import { InventoryService } from './inventory-service'
import { TicketingService } from './ticketing-service'

export class BookingService {
  #inventoryService: InventoryService
  #ticketingService: TicketingService

  constructor(
    inventoryService: InventoryService,
    ticketingService: TicketingService,
  ) {
    this.#inventoryService = inventoryService
    this.#ticketingService = ticketingService
  }

  requestBooking(numberOfSeats: number): boolean {
    console.log(`booking requested with ${numberOfSeats} seats!`)
    const seatsReserved = this.#inventoryService.reserveInventory(numberOfSeats)
    if (!seatsReserved) {
      return false
    }
    this.#ticketingService.printTicket(numberOfSeats)
    return true
  }
}
