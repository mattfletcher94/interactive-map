export default interface IResponseDelete {
    is201?: { message: string, data: boolean },
    is404?: { message: string },
}