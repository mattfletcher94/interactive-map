import { Controller, Get, Route, Security, Body, Post, Res, TsoaResponse, Request, Delete, Path, Patch } from "tsoa";
import IResponse from "../responses/IResponse";
import IResponseErrors from "../responses/IResponseErrors";
import IResponseServerError from "../responses/IResponseServerError";
import RepositoryFactory from "../repositories/RepositoryFactory";
import { IMapMarkerClient, IMapMarkerCreate, IMapMarkerUpdate } from "../models/MapMarker";

@Route("maps/")
export class MapMarkersController extends Controller {
    
    @Get('{mapId}/markers')
    @Security("jwt")
    public async getMapMarkers(
        @Path() mapId: string,
        @Request() req: any, 
        @Res() response200: TsoaResponse<200, IResponse<Array<IMapMarkerClient>>>, 
        @Res() response404: TsoaResponse<404, IResponse>, 
        @Res() response500: TsoaResponse<500, IResponseServerError>
    ) {
        const repo = new RepositoryFactory().getMapMarkersRepository();
        const documents = await repo.getByUserIdAndMapId(req.user.userId, mapId);
        return response200(200, {
            message: "The items were found succesfully.",
            data: documents
        });
    }

    @Get("/{mapId}/markers/{mapMarkerId}")
    @Security("jwt")
    public async getMapMarker(
        @Path() mapId: string,
        @Path() mapMarkerId: string,
        @Request() req: any, 
        @Res() response200: TsoaResponse<200, IResponse<IMapMarkerClient>>, 
        @Res() response404: TsoaResponse<404, IResponse>,
        @Res() response500: TsoaResponse<500, IResponseServerError>,
    ) {
        const repo = new RepositoryFactory().getMapMarkersRepository();
        const document = await repo.getOneByUserIdAndMapId(req.user.userId, mapId, mapMarkerId);
        return response200(200, {
            message: "The item was found succesfully.",
            data: document
        });
    }

    @Post('{mapId}/markers')
    @Security("jwt")
    public async postMapMarker(
        @Path() mapId: string,
        @Request() req: any, 
        @Body() body: IMapMarkerCreate, 
        @Res() response201: TsoaResponse<201, IResponse<IMapMarkerClient>>, 
        @Res() response400: TsoaResponse<400, IResponseErrors>,
        @Res() response500: TsoaResponse<500, IResponseServerError>
    ) {
        const repo = new RepositoryFactory().getMapMarkersRepository();
        body.mapMarkerMap = mapId;
        const map = await repo.create(req.user.userId, body);
        return response201(201, {
            message: "The item was created succesfully.",
            data: map
        });
    }

    @Patch("/{mapId}/markers/{mapMarkerId}")
    @Security("jwt")
    public async updateMap(
        @Path() mapId: string,
        @Path() mapMarkerId: string,
        @Request() req: any, 
        @Body() body: IMapMarkerUpdate, 
        @Res() response200: TsoaResponse<200, IResponse<IMapMarkerClient>>, 
        @Res() response400: TsoaResponse<400, IResponseErrors>,
        @Res() response404: TsoaResponse<404, IResponse>,
        @Res() response500: TsoaResponse<500, IResponseServerError>
    ) {
        const repo = new RepositoryFactory().getMapMarkersRepository();
        const document = await repo.update(req.user.userId, mapMarkerId, body);
        return response200(200, {
            message: "The item was updated succesfully.",
            data: document
        });
        
    }

    @Delete('{mapId}/markers/{mapMarkerId}')
    @Security("jwt")
    public async deleteMap(
        @Path() mapId: string,
        @Path() mapMarkerId: string,
        @Request() req: any, 
        @Res() response201: TsoaResponse<201, IResponse>, 
        @Res() response404: TsoaResponse<404, IResponse>,
        @Res() response500: TsoaResponse<500, IResponseServerError>
    ) {
        const repo = new RepositoryFactory().getMapMarkersRepository();
        await repo.delete(req.user.userId, mapMarkerId);
        return response201(201, {
            message: "The item was deleted succesfully."
        });
    }

}
