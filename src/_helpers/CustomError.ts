export default class ApplicationError extends Error {
    constructor(message?: string) {
        super(message);

        const actualProto = new.target.prototype;
        this.name = 'AppError';
        Object.setPrototypeOf(this, actualProto);
    }
}