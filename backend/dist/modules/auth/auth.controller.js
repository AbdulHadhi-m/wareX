"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const async_handler_1 = require("../../shared/middleware/async-handler");
const api_response_1 = require("../../shared/utils/api-response");
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.authService.register(req.body);
        (0, api_response_1.sendCreated)(res, result);
    });
    login = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.authService.login(req.body);
        (0, api_response_1.sendSuccess)(res, result);
    });
    me = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const user = await this.authService.getProfile(req.userId);
        (0, api_response_1.sendSuccess)(res, { user });
    });
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map