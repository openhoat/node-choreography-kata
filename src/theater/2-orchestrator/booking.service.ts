import type { Logger } from 'pino'
import type { TheaterOrchestrator } from './theater-orchestrator.js'

export class BookingService {
  #logger: Logger
  #orchestrator: TheaterOrchestrator

  constructor(logger: Logger, orchestrator: TheaterOrchestrator) {
    this.#logger = logger
    this.#orchestrator = orchestrator
  }

  requestBooking(numberOfSeats: number): void {
    this.#logger.info(`booking requested with ${numberOfSeats} seats!`)
    this.#orchestrator.run(numberOfSeats)
  }
}
