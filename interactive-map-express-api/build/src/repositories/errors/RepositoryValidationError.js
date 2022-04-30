"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RepositoryValidationError extends Error {
    constructor(message, validationErrors) {
        super(message); // 'Error' breaks prototype chain here
        this.validationErrors = [];
        this.name = 'RepositoryValidationError';
        this.validationErrors = validationErrors ? validationErrors : [];
        Object.setPrototypeOf(this, RepositoryValidationError.prototype);
    }
}
exports.default = RepositoryValidationError;
