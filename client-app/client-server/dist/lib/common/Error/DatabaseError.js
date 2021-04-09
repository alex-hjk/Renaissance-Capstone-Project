"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DatabaseError extends Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}
exports.default = DatabaseError;
