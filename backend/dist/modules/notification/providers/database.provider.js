"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseNotificationProvider = void 0;
class DatabaseNotificationProvider {
    name = 'database';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(_repository) { }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async send(_notification) {
        // The notification is already persisted by the service.
        // This provider exists as a future extension point (e.g., email, SMS, push).
    }
}
exports.DatabaseNotificationProvider = DatabaseNotificationProvider;
//# sourceMappingURL=database.provider.js.map