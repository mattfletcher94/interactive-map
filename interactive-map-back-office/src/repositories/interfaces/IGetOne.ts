import IResponse from "../responses/IResponse";
import IResponseGetOne from "../responses/IResponseGetOne";

export default interface IGetOne<T> {
    getOne(id: string): Promise<IResponseGetOne<T>>;
}