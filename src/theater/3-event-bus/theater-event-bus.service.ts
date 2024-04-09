import { MemoryEventBusService } from './infra/event-bus/memory/memory-event-bus.service.js'

export enum TheaterEventName {
  RESERVE_INVENTORY = 'RESERVE_INVENTORY',
  INVENTORY_RESERVED = 'INVENTORY_RESERVED',
  RESERVE_INVENTORY_ERROR = 'RESERVE_INVENTORY_ERROR',
  PRINT_TICKET = 'PRINT_TICKET',
  TICKET_PRINTED = 'TICKET_PRINTED',
  PRINT_TICKET_ERROR = 'PRINT_TICKET_ERROR',
}

export class TheaterEventBusService extends MemoryEventBusService<TheaterEventName> {}
