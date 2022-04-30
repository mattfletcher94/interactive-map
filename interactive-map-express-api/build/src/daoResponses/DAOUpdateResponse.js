"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DAOUpdateResponse {
    constructor() {
        this._updated = false;
        this._notFound = false;
        this._validationError = false;
        this._validationErrors = [];
        this._unknownError = false;
        this._unknownErrorReason = "An unknown error occured.";
        this._data = undefined;
    }
    get UPDATED() {
        return this._updated;
    }
    set UPDATED(val) {
        this._updated = val;
    }
    get NOT_FOUND() {
        return this._notFound;
    }
    set NOT_FOUND(val) {
        this._notFound = val;
    }
    get VALIDATION_ERROR() {
        return this._validationError;
    }
    set VALIDATION_ERRORS(val) {
        this._validationErrors = val;
    }
    get VALIDATION_ERRORS() {
        return this._validationErrors;
    }
    set VALIDATION_ERROR(val) {
        this._validationError = val;
    }
    get DATA() {
        return this._data;
    }
    set DATA(val) {
        this._data = val;
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
exports.default = DAOUpdateResponse;
