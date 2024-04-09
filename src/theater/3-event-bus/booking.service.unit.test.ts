import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from '@jest/globals'
import { type Logger, pino } from 'pino'
import { BookingService } from './booking.service.js'
import { InventoryService } from './inventory.service.js'
import {
  TheaterEventBusService,
  TheaterEventName,
} from './theater-event-bus.service.js'
import { TicketingService } from './ticketing.service.js'

describe('Choreography kata tests', () => {
  describe('unit tests', () => {
    describe('theater', () => {
      describe('3-event-bus', () => {
        describe('booking service', () => {
          describe('requestBooking', () => {
            let logger: Logger
            let eventBus: TheaterEventBusService
            let inventoryService: InventoryService
            let ticketingService: TicketingService
            let bookingService: BookingService
            const events: { name: string; value: unknown }[] = []
            beforeAll(async () => {
              logger = pino({
                level: 'debug',
                transport: {
                  target: 'pino-pretty',
                },
              })
              eventBus = new TheaterEventBusService(logger)
              const eventNames: TheaterEventName[] = [
                TheaterEventName.RESERVE_INVENTORY,
                TheaterEventName.INVENTORY_RESERVED,
                TheaterEventName.RESERVE_INVENTORY_ERROR,
                TheaterEventName.PRINT_TICKET,
                TheaterEventName.TICKET_PRINTED,
                TheaterEventName.PRINT_TICKET_ERROR,
              ]
              for (const name of eventNames) {
                eventBus.on(name, (value) => {
                  events.push({ name, value })
                })
              }
              await eventBus.start()
            })
            beforeEach(async () => {
              ticketingService = new TicketingService(logger, eventBus)
              await ticketingService.start()
              bookingService = new BookingService(logger, eventBus)
              events.length = 0
            })
            afterEach(async () => {
              if (ticketingService) {
                await ticketingService.stop()
              }
              if (inventoryService) {
                await inventoryService.stop()
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
              await inventoryService.start()
              // When
              await bookingService.requestBooking(requestedSeats)
              // Then
              expect(events).toStrictEqual([
                {
                  name: 'RESERVE_INVENTORY',
                  value: 16,
                },
                {
                  name: 'INVENTORY_RESERVED',
                  value: 4,
                },
                {
                  name: 'PRINT_TICKET',
                  value: 16,
                },
                {
                  name: 'TICKET_PRINTED',
                  value: 16,
                },
              ])
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
              await inventoryService.start()
              const expectedErrorMessage = 'No more seats available'
              // When
              const promise = bookingService.requestBooking(requestedSeats)
              // Then
              await expect(promise).rejects.toEqual(expectedErrorMessage)
              expect(events).toStrictEqual([
                {
                  name: 'RESERVE_INVENTORY',
                  value: requestedSeats,
                },
                {
                  name: 'RESERVE_INVENTORY_ERROR',
                  value: expectedErrorMessage,
                },
              ])
            })
          })
        })
      })
    })
  })
})
