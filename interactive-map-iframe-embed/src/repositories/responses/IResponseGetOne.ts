export default interface IResponseGetOne<T> {
    is200?: { message: string, data: T },
    is404?: { message: string },
}