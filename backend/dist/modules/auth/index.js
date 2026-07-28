"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = exports.authRouter = void 0;
var auth_routes_1 = require("./auth.routes");
Object.defineProperty(exports, "authRouter", { enumerable: true, get: function () { return auth_routes_1.authRouter; } });
var auth_middleware_1 = require("./auth.middleware");
Object.defineProperty(exports, "authenticate", { enumerable: true, get: function () { return auth_middleware_1.authenticate; } });
Object.defineProperty(exports, "authorize", { enumerable: true, get: function () { return auth_middleware_1.authorize; } });
//# sourceMappingURL=index.js.map