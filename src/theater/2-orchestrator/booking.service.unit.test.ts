import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals'
import { type Logger, pino } from 'pino'
import { BookingService } from './booking.service.js'
import { InventoryService } from './inventory.service.js'
import { TheaterOrchestrator } from './theater-orchestrator.js'
import { TicketingService } from './ticketing.service.js'

describe('Choreography kata tests', () => {
  describe('unit tests', () => {
    describe('theater', () => {
      describe('2-orchestrator', () => {
        describe('booking service', () => {
          describe('requestBooking', () => {
            let logger: Logger
            let inventoryService: InventoryService
            let ticketingService: TicketingService
            let theaterOrchestrator: TheaterOrchestrator
            let bookingService: BookingService
            beforeAll(() => {
              logger = pino({
                level: 'silent',
                transport: {
                  target: 'pino-pretty',
                },
              })
            })
            beforeEach(() => {
              ticketingService = new TicketingService(logger)
            })
            test('should resolve given a booking request of 16 seats and an inventory of 20 available seats', () => {
              // Given
              const availableSeats = 20
              const requestedSeats = 16
              inventoryService = new InventoryService(logger, availableSeats)
              theaterOrchestrator = new TheaterOrchestrator(
                inventoryService,
                ticketingService,
              )
              bookingService = new BookingService(logger, theaterOrchestrator)
              // When
              bookingService.requestBooking(requestedSeats)
            })
            test('should reject given a booking request of 5 seats and an inventory of 4 available seats', () => {
              // Given
              const availableSeats = 4
              const requestedSeats = 5
              inventoryService = new InventoryService(logger, availableSeats)
              theaterOrchestrator = new TheaterOrchestrator(
                inventoryService,
                ticketingService,
              )
              bookingService = new BookingService(logger, theaterOrchestrator)
              const expectedError = new Error('No more seats available')
              // When
              const fn = () => {
                bookingService.requestBooking(requestedSeats)
              }
              // Then
              expect(fn).toThrow(expectedError)
            })
          })
        })
      })
    })
  })
})
