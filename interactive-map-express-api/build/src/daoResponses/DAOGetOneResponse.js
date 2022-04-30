"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DAOGetOneResponse {
    constructor() {
        this._found = false;
        this._notFound = false;
        this._unknownError = false;
        this._unknownErrorReason = "An unknown error occured.";
        this._data = undefined;
    }
    get FOUND() {
        return this._found;
    }
    set FOUND(val) {
        this._found = val;
    }
    get NOT_FOUND() {
        return this._notFound;
    }
    set NOT_FOUND(val) {
        this._notFound = val;
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
exports.default = DAOGetOneResponse;
