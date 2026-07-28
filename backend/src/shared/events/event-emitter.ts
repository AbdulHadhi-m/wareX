import { EventEmitter } from 'events';

export const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(100);

export const Events = {
  PICK_LIST_COMPLETED: 'pick-list:completed',
  PICK_LIST_CANCELLED: 'pick-list:cancelled',
} as const;
