export default class RepositoryValidationError extends Error {

    public validationErrors : Array<{ field: string, message: string }> = [];

    constructor(message?: string, validationErrors?: Array<{ field: string, message: string }>) {
        super(message); // 'Error' breaks prototype chain here
        this.name = 'RepositoryValidationError';
        this.validationErrors = validationErrors ? validationErrors : [];
        Object.setPrototypeOf(this, RepositoryValidationError.prototype);
    }
}