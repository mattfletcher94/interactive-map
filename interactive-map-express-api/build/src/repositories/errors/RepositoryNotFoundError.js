"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RepositoryNotFoundError extends Error {
    constructor(message) {
        super(message); // 'Error' breaks prototype chain here
        this.name = 'RepositoryNotFoundError';
        Object.setPrototypeOf(this, RepositoryNotFoundError.prototype);
    }
}
exports.default = RepositoryNotFoundError;
