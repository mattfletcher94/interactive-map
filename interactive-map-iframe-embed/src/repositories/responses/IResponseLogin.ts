export default interface IResponseLogin {
    is200?: { message: string, data: { token: string } },
    is400?: { message: string, errors: Array<{ field: string, message: string }> },
}