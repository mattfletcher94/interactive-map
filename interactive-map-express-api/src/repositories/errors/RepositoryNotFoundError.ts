export default class RepositoryNotFoundError extends Error {
    constructor(message?: string) {
        super(message); // 'Error' breaks prototype chain here
        this.name = 'RepositoryNotFoundError';
        Object.setPrototypeOf(this, RepositoryNotFoundError.prototype);
    }
}