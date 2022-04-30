import IResponse from "../responses/IResponse";
import IResponseGet from "../responses/IResponseGet";

export default interface IGet<T> {
    get(): Promise<IResponseGet<T>>;
}