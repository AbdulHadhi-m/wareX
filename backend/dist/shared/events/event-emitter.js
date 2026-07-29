"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = exports.eventEmitter = void 0;
const events_1 = require("events");
exports.eventEmitter = new events_1.EventEmitter();
exports.eventEmitter.setMaxListeners(100);
exports.Events = {
    AUTH_LOGIN: 'auth:login',
    DEVICE_MOVED: 'device:moved',
    ORDER_CREATED: 'order:created',
    ORDER_CANCELLED: 'order:cancelled',
    ORDER_FULFILLED: 'order:fulfilled',
    PICK_LIST_ASSIGNED: 'pick-list:assigned',
    PICK_LIST_STARTED: 'pick-list:started',
    PICK_LIST_COMPLETED: 'pick-list:completed',
    PICK_LIST_CANCELLED: 'pick-list:cancelled',
};
//# sourceMappingURL=event-emitter.js.map