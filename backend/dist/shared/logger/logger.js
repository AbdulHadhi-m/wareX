"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const environment_1 = require("../config/environment");
const app_1 = require("../config/app");
const transport = app_1.appConfig.isProduction
    ? pino_1.default.transport({
        targets: [
            {
                target: 'pino/file',
                options: { destination: `${environment_1.environment.LOG_FILE_PATH}/info.log`, mkdir: true },
                level: 'info',
            },
            {
                target: 'pino/file',
                options: { destination: `${environment_1.environment.LOG_FILE_PATH}/error.log`, mkdir: true },
                level: 'error',
            },
            {
                target: 'pino/file',
                options: { destination: 1 },
                level: environment_1.environment.LOG_LEVEL,
            },
        ],
    })
    : pino_1.default.transport({
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
        },
    });
exports.logger = (0, pino_1.default)({
    name: app_1.appConfig.name,
    level: environment_1.environment.LOG_LEVEL,
    redact: ['req.headers.authorization', 'req.headers.cookie'],
    serializers: {
        req: pino_1.default.stdSerializers.req,
        res: pino_1.default.stdSerializers.res,
        err: pino_1.default.stdSerializers.err,
    },
}, transport);
//# sourceMappingURL=logger.js.map