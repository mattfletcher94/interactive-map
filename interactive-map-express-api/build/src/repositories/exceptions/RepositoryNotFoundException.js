"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RepositoryNotFoundException extends Error {
    constructor(message) {
        super(message); // 'Error' breaks prototype chain here
        this.name = 'RepositoryNotFoundException';
        Object.setPrototypeOf(this, RepositoryNotFoundException.prototype);
    }
}
exports.default = RepositoryNotFoundException;
