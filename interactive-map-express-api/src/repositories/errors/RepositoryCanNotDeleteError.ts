export default class RepositoryCanNotDeleteError extends Error {
    public reason : string = "";
    constructor(message?: string, reason?: string) {
        super(message); // 'Error' breaks prototype chain here
        this.name = 'RepositoryCanNotDeleteError';
        this.reason = reason ? reason : "";
        Object.setPrototypeOf(this, RepositoryCanNotDeleteError.prototype);
    }
}