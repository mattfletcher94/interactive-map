export default interface IResponseUpdate<T> {
    is200?: { message: string; data: T };
    is400?: { message: string; errors: Array<{ field: string; message: string }> };
    is404?: { message: string };
    isNetworkError?: boolean;
}