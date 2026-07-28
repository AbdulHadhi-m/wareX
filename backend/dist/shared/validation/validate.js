"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationSource = void 0;
exports.validate = validate;
const zod_1 = require("zod");
const validation_error_1 = require("../errors/validation-error");
var ValidationSource;
(function (ValidationSource) {
    ValidationSource["BODY"] = "body";
    ValidationSource["QUERY"] = "query";
    ValidationSource["PARAMS"] = "params";
})(ValidationSource || (exports.ValidationSource = ValidationSource = {}));
function validate(schema, source = ValidationSource.BODY) {
    return (req, _res, next) => {
        try {
            const data = schema.parse(req[source]);
            req[source] = data;
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                const details = err.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                    code: e.code,
                }));
                next(new validation_error_1.ValidationError('Validation failed', details));
                return;
            }
            next(err);
        }
    };
}
//# sourceMappingURL=validate.js.map