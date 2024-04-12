import { InventoryService } from '../../../../main/theater/services/inventory-service'
import { TicketingService } from '../../../../main/theater/services/ticketing-service'
import { BookingService } from '../../../../main/theater/services/booking-service'

describe('Choreography kata tests', () => {
  describe('unit tests', () => {
    describe('theater', () => {
      describe('booking service', () => {
        describe('requestBooking', () => {
          type TestCase = {
            availableSeats: number
            requestedSeats: number
            expectedResult: boolean
          }
          const testCases: TestCase[] = [
            {
              availableSeats: 20,
              requestedSeats: 16,
              expectedResult: true,
            },
            {
              availableSeats: 4,
              requestedSeats: 5,
              expectedResult: false,
            },
          ]
          test.each(testCases)(
            'should return $expectedResult given a booking request of $requestedSeats seats and an inventory of $availableSeats available seats',
            ({ availableSeats, requestedSeats, expectedResult }) => {
              // Given
              const inventoryService = new InventoryService(availableSeats)
              const ticketingService = new TicketingService()
              const bookingService = new BookingService(
                inventoryService,
                ticketingService,
              )
              // When
              const result = bookingService.requestBooking(requestedSeats)
              // Then
              expect(result).toBe(expectedResult)
            },
          )
        })
      })
    })
  })
})
