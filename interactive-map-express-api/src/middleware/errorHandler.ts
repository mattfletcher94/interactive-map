import { Response as ExResponse, Request as ExRequest,  NextFunction } from "express";
import RepositoryNotFoundError from "../repositories/errors/RepositoryNotFoundError";
import RepositoryValidationError from "../repositories/errors/RepositoryValidationError";
import { ValidateError as TsoaValidateError } from 'tsoa';
import JWTError from '../helpers/JWTError';
import RepositoryCanNotDeleteError from "../repositories/errors/RepositoryCanNotDeleteError";

/**
 * Express global error handler
 */
export default function errorHandler(err: any, req: ExRequest, res: ExResponse, next: NextFunction): ExResponse | void {

    // Handle Tsoa validation errors
    if (err instanceof TsoaValidateError) {
        let errors = [];
        for (var key in err?.fields) {

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
    else if (err instanceof RepositoryNotFoundError) {
        return res.status(404).json({
            message: err.message,
        });
    }

    // Handle validation errors
    else if (err instanceof RepositoryValidationError) {
        return res.status(400).json({
            message: "Validation errors in your request.",
            errors: err.validationErrors,
        });
    }

    // Can not delete because of foreign constraint
    else if (err instanceof RepositoryCanNotDeleteError) {
        return res.status(400).json({
            message: err.message,
        });
    }

    // Handle JWT Errors
    else if (err instanceof JWTError) {
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