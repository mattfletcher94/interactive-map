export default interface IResponseGet<T200> {
    is200: { message: string, data: Array<T200> },
}


