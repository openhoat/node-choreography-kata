import { InventoryService } from '../../../../main/theater/services/inventory-service'
import { TicketingService } from '../../../../main/theater/services/ticketing-service'
import { BookingService } from '../../../../main/theater/services/booking-service'
import { Logger, pino } from 'pino'
import { EventBus } from '../../../../main/theater/shared/event-bus'

describe('Choreography kata tests', () => {
  describe('unit tests', () => {
    describe('theater', () => {
      describe('booking service', () => {
        describe('requestBooking', () => {
          let logger: Logger
          let eventBus: EventBus
          let ticketingService: TicketingService
          let inventoryService: InventoryService
          let bookingService: BookingService
          beforeAll(() => {
            logger = pino({
              level: 'silent',
              transport: {
                target: 'pino-pretty',
              },
            })
            eventBus = new EventBus(logger)
            eventBus.start()
          })
          beforeEach(() => {
            ticketingService = new TicketingService(logger, eventBus)
            ticketingService.start()
            bookingService = new BookingService(logger, eventBus)
          })
          afterEach(() => {
            if (ticketingService) {
              ticketingService.stop()
            }
            if (inventoryService) {
              inventoryService.stop()
            }
          })
          afterAll(() => {
            eventBus.stop()
          })
          test('should resolve given a booking request of 16 seats and an inventory of 20 available seats', async () => {
            // Given
            const availableSeats = 20
            const requestedSeats = 16
            inventoryService = new InventoryService(
              logger,
              availableSeats,
              eventBus,
            )
            inventoryService.start()
            // When
            await bookingService.requestBooking(requestedSeats)
          })
          test('should reject given a booking request of 5 seats and an inventory of 4 available seats', async () => {
            // Given
            const availableSeats = 4
            const requestedSeats = 5
            inventoryService = new InventoryService(
              logger,
              availableSeats,
              eventBus,
            )
            inventoryService.start()
            const expectedError = new Error('No more seats available')
            // When
            const promise = bookingService.requestBooking(requestedSeats)
            // Then
            await expect(promise).rejects.toEqual(expectedError)
          })
        })
      })
    })
  })
})
