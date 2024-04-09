import type { Service } from '../../types/service.js'

export interface EventBusService<EventName extends string> extends Service {
  send(eventName: EventName, data?: unknown): void

  on<T>(eventName: EventName, listener: (data: T) => void): void

  once<T>(eventName: EventName, listener: (data: T) => void): void

  off<T>(eventName: EventName, listener: (data: T) => void): void

  sendAndWait<T>(
    sendEventName: EventName,
    successEventName: EventName,
    errorEventName: EventName,
    data?: unknown,
  ): Promise<T>
}
