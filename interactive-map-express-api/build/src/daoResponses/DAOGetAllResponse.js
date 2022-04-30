"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DAOGetAllResponse {
    constructor() {
        this._found = false;
        this._unknownError = false;
        this._unknownErrorReason = "An unknown error occured.";
        this._data = [];
    }
    get FOUND() {
        return this._found;
    }
    set FOUND(val) {
        this._found = val;
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
exports.default = DAOGetAllResponse;
