import IResponse from "../responses/IResponse";
import IResponseCreate from "../responses/IResponseCreate";

export default interface ICreate<T, K> {
    create(model: T): Promise<IResponseCreate<K>>;
}