"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const auth_repository_1 = require("./auth.repository");
const validate_1 = require("../../shared/validation/validate");
const auth_validation_1 = require("./auth.validation");
const auth_middleware_1 = require("./auth.middleware");
const router = (0, express_1.Router)();
exports.authRouter = router;
const repository = new auth_repository_1.AuthRepository();
const service = new auth_service_1.AuthService(repository);
const controller = new auth_controller_1.AuthController(service);
router.post('/register', (0, validate_1.validate)(auth_validation_1.registerSchema), controller.register);
router.post('/login', (0, validate_1.validate)(auth_validation_1.loginSchema), controller.login);
router.get('/me', auth_middleware_1.authenticate, controller.me);
//# sourceMappingURL=auth.routes.js.map