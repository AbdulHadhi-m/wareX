import { EventEmitter } from 'events';
export declare const eventEmitter: EventEmitter<[never]>;
export declare const Events: {
    readonly AUTH_LOGIN: "auth:login";
    readonly DEVICE_MOVED: "device:moved";
    readonly ORDER_CREATED: "order:created";
    readonly ORDER_CANCELLED: "order:cancelled";
    readonly ORDER_FULFILLED: "order:fulfilled";
    readonly PICK_LIST_ASSIGNED: "pick-list:assigned";
    readonly PICK_LIST_STARTED: "pick-list:started";
    readonly PICK_LIST_COMPLETED: "pick-list:completed";
    readonly PICK_LIST_CANCELLED: "pick-list:cancelled";
};
//# sourceMappingURL=event-emitter.d.ts.map