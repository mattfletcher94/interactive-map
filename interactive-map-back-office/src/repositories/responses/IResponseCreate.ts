export default interface IResponseCreate<T> {
    is201?: { message: string; data: T };
    is400?: { message: string; errors: Array<{ field: string; message: string }> };
    isNetworkError?: boolean;
}