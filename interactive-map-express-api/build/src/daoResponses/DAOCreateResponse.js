"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DAOCreateResponse {
    constructor() {
        this._created = false;
        this._validationError = false;
        this._validationErrors = [];
        this._unknownError = false;
        this._unknownErrorReason = "An unknown error occured.";
        this._data = undefined;
    }
    get CREATED() {
        return this._created;
    }
    set CREATED(val) {
        this._created = val;
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
exports.default = DAOCreateResponse;
