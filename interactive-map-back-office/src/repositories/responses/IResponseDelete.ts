export default interface IResponseDelete {
    is201?: { message: string; data: boolean };
    is400?: { message: string };
    is404?: { message: string };
    isNetworkError?: boolean;
}
