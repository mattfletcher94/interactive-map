import IResponse from "../responses/IResponse";
import IResponseDelete from "../responses/IResponseDelete";

export default interface IDelete {
    delete(id: string): Promise<IResponseDelete>;
}