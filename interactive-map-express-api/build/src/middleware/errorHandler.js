"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RepositoryNotFoundError_1 = __importDefault(require("../repositories/errors/RepositoryNotFoundError"));
const RepositoryValidationError_1 = __importDefault(require("../repositories/errors/RepositoryValidationError"));
const tsoa_1 = require("tsoa");
const JWTError_1 = __importDefault(require("../helpers/JWTError"));
const RepositoryCanNotDeleteError_1 = __importDefault(require("../repositories/errors/RepositoryCanNotDeleteError"));
/**
 * Express global error handler
 */
function errorHandler(err, req, res, next) {
    // Handle Tsoa validation errors
    if (err instanceof tsoa_1.ValidateError) {
        let errors = [];
        for (var key in err === null || err === void 0 ? void 0 : err.fields) {
            // Custom error message overrides
            if (err.fields[key].message === 'invalid float number') {
                err.fields[key].message = "Please enter a valid number.";
            }
            // Add error to array
            errors.push({
                field: err.fields[key].value ? err.fields[key].value : key.replace('body.', ''),
                message: err.fields[key].message
            });
        }
        return res.status(400).json({
            message: "Validation errors in your request.",
            errors: errors,
        });
    }
    // Handle not found exception
    else if (err instanceof RepositoryNotFoundError_1.default) {
        return res.status(404).json({
            message: err.message,
        });
    }
    // Handle validation errors
    else if (err instanceof RepositoryValidationError_1.default) {
        return res.status(400).json({
            message: "Validation errors in your request.",
            errors: err.validationErrors,
        });
    }
    // Can not delete because of foreign constraint
    else if (err instanceof RepositoryCanNotDeleteError_1.default) {
        return res.status(400).json({
            message: err.message,
        });
    }
    // Handle JWT Errors
    else if (err instanceof JWTError_1.default) {
        return res.status(401).json({
            message: err.message,
        });
    }
    // Handle any other errors
    else if (err instanceof Error) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error",
            err: err.message,
        });
    }
    // Continue
    next();
}
exports.default = errorHandler;
