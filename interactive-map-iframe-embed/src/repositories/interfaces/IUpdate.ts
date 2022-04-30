import IResponse from "../responses/IResponse";
import IResponseUpdate from "../responses/IResponseUpdate";

export default interface IUpdate<T, K> {
    update(id: string, model: T): Promise<IResponseUpdate<K>>;
}