"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.now = now;
exports.toISOString = toISOString;
exports.addMinutes = addMinutes;
exports.addDays = addDays;
exports.diffInMinutes = diffInMinutes;
function now() {
    return new Date();
}
function toISOString(date = now()) {
    return date.toISOString();
}
function addMinutes(date, minutes) {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
}
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
function diffInMinutes(a, b) {
    return (b.getTime() - a.getTime()) / 60000;
}
//# sourceMappingURL=date.js.map