"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RepositoryCanNotDeleteError extends Error {
    constructor(message, reason) {
        super(message); // 'Error' breaks prototype chain here
        this.reason = "";
        this.name = 'RepositoryCanNotDeleteError';
        this.reason = reason ? reason : "";
        Object.setPrototypeOf(this, RepositoryCanNotDeleteError.prototype);
    }
}
exports.default = RepositoryCanNotDeleteError;
