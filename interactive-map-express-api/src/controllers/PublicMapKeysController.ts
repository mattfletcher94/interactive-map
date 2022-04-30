import { Controller, Get, Route, Security, Body, Post, Res, TsoaResponse, Request, Delete, Path, Patch } from "tsoa";
import IResponse from "../responses/IResponse";
import IResponseServerError from "../responses/IResponseServerError";
import RepositoryFactory from "../repositories/RepositoryFactory";
import { IMapKeyClient } from "../models/MapKey";

@Route("public/maps")
export class PublicMapKeysController extends Controller {
    
    @Get('/{mapId}/keys')
    public async getMapMarkers(
        @Path() mapId: string,
        @Request() req: any, 
        @Res() response200: TsoaResponse<200, IResponse<Array<IMapKeyClient>>>, 
        @Res() response404: TsoaResponse<404, IResponse>, 
        @Res() response500: TsoaResponse<500, IResponseServerError>
    ) {
        const repo = new RepositoryFactory().getMapKeysRepository();
        const documents = await repo.getByMapId(mapId);
        return response200(200, {
            message: "The items were found succesfully.",
            data: documents
        });
    }

    @Get("/{mapId}/keys/{mapKeyId}")
    public async getMapMarker(
        @Path() mapId: string,
        @Path() mapKeyId: string,
        @Request() req: any, 
        @Res() response200: TsoaResponse<200, IResponse<IMapKeyClient>>, 
        @Res() response404: TsoaResponse<404, IResponse>,
        @Res() response500: TsoaResponse<500, IResponseServerError>,
    ) {
        const repo = new RepositoryFactory().getMapKeysRepository();
        const document = await repo.getOneByMapId(mapId, mapKeyId);
        return response200(200, {
            message: "The item was found succesfully.",
            data: document
        });
    }
}
