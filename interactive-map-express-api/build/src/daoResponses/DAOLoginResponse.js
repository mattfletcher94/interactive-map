"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DAOLoginResponse {
    constructor() {
        this._success = false;
        this._validationError = false;
        this._validationErrors = [];
        this._unknownError = false;
        this._unknownErrorReason = "An unknown error occured.";
        this._token = "";
    }
    get SUCCESS() {
        return this._success;
    }
    set SUCCESS(val) {
        this._success = val;
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
    get TOKEN() {
        return this._token;
    }
    set TOKEN(val) {
        this._token = val;
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
exports.default = DAOLoginResponse;
