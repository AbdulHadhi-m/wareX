import { EventEmitter } from 'events';

export const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(100);

export const Events = {
  AUTH_LOGIN: 'auth:login',
  DEVICE_MOVED: 'device:moved',
  ORDER_CREATED: 'order:created',
  ORDER_CANCELLED: 'order:cancelled',
  ORDER_FULFILLED: 'order:fulfilled',
  PICK_LIST_ASSIGNED: 'pick-list:assigned',
  PICK_LIST_STARTED: 'pick-list:started',
  PICK_LIST_COMPLETED: 'pick-list:completed',
  PICK_LIST_CANCELLED: 'pick-list:cancelled',
} as const;
