"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DAODeleteResponse {
    constructor() {
        this._deleted = false;
        this._notFound = false;
        this._unknownError = false;
        this._unknownErrorReason = "An unknown error occured.";
    }
    get DELETED() {
        return this._deleted;
    }
    set DELETED(val) {
        this._deleted = val;
    }
    get NOT_FOUND() {
        return this._notFound;
    }
    set NOT_FOUND(val) {
        this._notFound = val;
    }
    get UNKNOWN_ERROR() {
        return this._unknownError;
    }
    set UNKNOWN_ERROR(val) {
        this._unknownError = val;
    }
    get UNKNOWN_ERROR_REASON() {
        return this._unknownErrorReason;
    }
    set UNKNOWN_ERROR_REASON(val) {
        this._unknownErrorReason = val;
    }
}
exports.default = DAODeleteResponse;
