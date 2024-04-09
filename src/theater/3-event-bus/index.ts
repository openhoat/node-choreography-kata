import { pino } from 'pino'
import { BookingService } from './booking.service.js'
import { InventoryService } from './inventory.service.js'
import { TheaterEventBusService } from './theater-event-bus.service.js'
import { TicketingService } from './ticketing.service.js'

const logger = pino({
  level: 'debug',
  transport: {
    target: 'pino-pretty',
  },
})

const run = async () => {
  const availableSeats = 20
  const requestedSeats = 16
  const eventBusService = new TheaterEventBusService(logger)
  const inventoryService = new InventoryService(
    logger,
    availableSeats,
    eventBusService,
  )
  const ticketingService = new TicketingService(logger, eventBusService)
  const bookingService = new BookingService(logger, eventBusService)
  try {
    await eventBusService.start()
    await inventoryService.start()
    await ticketingService.start()
    await bookingService.requestBooking(requestedSeats)
    await bookingService.requestBooking(4)
    try {
      await bookingService.requestBooking(1)
    } catch (err) {
      const error = err as Error
      logger.error(`${error.message}`)
    }
  } finally {
    await ticketingService.stop()
    await inventoryService.stop()
    await eventBusService.stop()
  }
}

void run()
