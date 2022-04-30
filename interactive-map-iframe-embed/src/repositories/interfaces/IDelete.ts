import IResponse from "../responses/IResponse";

export default interface IDelete {
    delete(id: string): Promise<IResponse<boolean>>;
}