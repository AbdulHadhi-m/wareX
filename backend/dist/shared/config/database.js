"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const environment_1 = require("./environment");
exports.databaseConfig = {
    uri: environment_1.environment.MONGODB_URI,
    connectionOptions: {
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 5000,
        heartbeatFrequencyMS: 10000,
        retryWrites: true,
        w: 'majority',
    },
};
//# sourceMappingURL=database.js.map