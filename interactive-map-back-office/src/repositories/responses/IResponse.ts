export default interface IResponse<T200 = any, T201 = any> {
    is200?: { message: string; data: T200 };
    is201?: { message: string; data: T201 };
    is400?: { message: string; errors: Array<{ field: string; message: string }> };
    is401?: { message: string };
    is404?: { message: string };
}


