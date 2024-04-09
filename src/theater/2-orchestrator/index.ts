import { pino } from 'pino'
import { BookingService } from './booking.service.js'
import { InventoryService } from './inventory.service.js'
import { TheaterOrchestrator } from './theater-orchestrator.js'
import { TicketingService } from './ticketing.service.js'

const logger = pino({
  level: 'debug',
  transport: {
    target: 'pino-pretty',
  },
})

const run = () => {
  const availableSeats = 20
  const requestedSeats = 16
  const inventoryService = new InventoryService(logger, availableSeats)
  const ticketingService = new TicketingService(logger)
  const orchestrator = new TheaterOrchestrator(
    inventoryService,
    ticketingService,
  )
  const bookingService = new BookingService(logger, orchestrator)
  bookingService.requestBooking(requestedSeats)
  bookingService.requestBooking(4)
  try {
    bookingService.requestBooking(1)
  } catch (err) {
    const error = err as Error
    logger.error(`${error.message}`)
  }
}

run()
