import { Controller, Get, Route, Security, Body, Post, Res, TsoaResponse, Request, Delete, Path, Patch } from "tsoa";
import IResponse from "../responses/IResponse";
import IResponseServerError from "../responses/IResponseServerError";
import RepositoryFactory from "../repositories/RepositoryFactory";
import { IMapMarkerClient } from "../models/MapMarker";

@Route("public/maps")
export class PublicMapMarkersController extends Controller {
    
    @Get('/{mapId}/markers')
    public async getMapMarkers(
        @Path() mapId: string,
        @Request() req: any, 
        @Res() response200: TsoaResponse<200, IResponse<Array<IMapMarkerClient>>>, 
        @Res() response404: TsoaResponse<404, IResponse>, 
        @Res() response500: TsoaResponse<500, IResponseServerError>
    ) {
        const repo = new RepositoryFactory().getMapMarkersRepository();
        const documents = await repo.getByMapId(mapId);
        return response200(200, {
            message: "The items were found succesfully.",
            data: documents
        });
    }

    @Get("/{mapId}/markers/{mapMarkerId}")
    public async getMapMarker(
        @Path() mapId: string,
        @Path() mapMarkerId: string,
        @Request() req: any, 
        @Res() response200: TsoaResponse<200, IResponse<IMapMarkerClient>>, 
        @Res() response404: TsoaResponse<404, IResponse>,
        @Res() response500: TsoaResponse<500, IResponseServerError>,
    ) {
        const repo = new RepositoryFactory().getMapMarkersRepository();
        const document = await repo.getOneByMapId(mapId, mapMarkerId);
        return response200(200, {
            message: "The item was found succesfully.",
            data: document
        });
    }
}
