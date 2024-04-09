export class InventoryService {
  #availableSeats: number

  constructor(availableSeats: number) {
    this.#availableSeats = availableSeats
  }

  reserveInventory(numberOfSeats: number): boolean {
    console.log(`inventory reserved with ${numberOfSeats} seats!`)
    if (this.#availableSeats < numberOfSeats) {
      return false
    }
    this.#availableSeats -= numberOfSeats

    console.log(`remaining capacity: ${this.#availableSeats}`)
    return true
  }
}
