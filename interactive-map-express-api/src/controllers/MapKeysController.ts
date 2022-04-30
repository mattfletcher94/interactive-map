import { Controller, Get, Route, Security, Body, Post, Res, TsoaResponse, Request, Delete, Path, Patch } from "tsoa";
import IResponse from "../responses/IResponse";
import IResponseErrors from "../responses/IResponseErrors";
import IResponseServerError from "../responses/IResponseServerError";
import RepositoryFactory from "../repositories/RepositoryFactory";
import { IMapKeyClient, IMapKeyCreate, IMapKeyUpdate } from "src/models/MapKey";

@Route("maps/")
export class MapKeysController extends Controller {
    
    @Get('{mapId}/keys')
    @Security("jwt")
    public async getAll(
        @Path() mapId: string,
        @Request() req: any, 
        @Res() response200: TsoaResponse<200, IResponse<Array<IMapKeyClient>>>, 
        @Res() response404: TsoaResponse<404, IResponse>, 
        @Res() response500: TsoaResponse<500, IResponseServerError>
    ) {
        const repo = new RepositoryFactory().getMapKeysRepository();
        const documents = await repo.getByUserIdAndMapId(req.user.userId, mapId);
        return response200(200, {
            message: "The items were found succesfully.",
            data: documents
        });
    }

    @Get("/{mapId}/keys/{keyId}")
    @Security("jwt")
    public async getOne(
        @Path() mapId: string,
        @Path() keyId: string,
        @Request() req: any, 
        @Res() response200: TsoaResponse<200, IResponse<IMapKeyClient>>, 
        @Res() response404: TsoaResponse<404, IResponse>,
        @Res() response500: TsoaResponse<500, IResponseServerError>,
    ) {
        const repo = new RepositoryFactory().getMapKeysRepository();
        const document = await repo.getOneByUserIdAndMapId(req.user.userId, mapId, keyId);
        return response200(200, {
            message: "The item was found succesfully.",
            data: document
        });
    }

    @Post('{mapId}/keys')
    @Security("jwt")
    public async post(
        @Path() mapId: string,
        @Request() req: any, 
        @Body() body: IMapKeyCreate, 
        @Res() response201: TsoaResponse<201, IResponse<IMapKeyClient>>, 
        @Res() response400: TsoaResponse<400, IResponseErrors>,
        @Res() response500: TsoaResponse<500, IResponseServerError>
    ) {
        const repo = new RepositoryFactory().getMapKeysRepository();
        body.mapKeyMap = mapId;
        const map = await repo.create(req.user.userId, body);
        return response201(201, {
            message: "The item was created succesfully.",
            data: map
        });
    }

    @Patch("/{mapId}/keys/{mapKeyId}")
    @Security("jwt")
    public async update(
        @Path() mapId: string,
        @Path() mapKeyId: string,
        @Request() req: any, 
        @Body() body: IMapKeyUpdate, 
        @Res() response200: TsoaResponse<200, IResponse<IMapKeyClient>>, 
        @Res() response400: TsoaResponse<400, IResponseErrors>,
        @Res() response404: TsoaResponse<404, IResponse>,
        @Res() response500: TsoaResponse<500, IResponseServerError>
    ) {
        const repo = new RepositoryFactory().getMapKeysRepository();
        const document = await repo.update(req.user.userId, mapKeyId, body);
        return response200(200, {
            message: "The item was updated succesfully.",
            data: document
        });
        
    }

    @Delete('{mapId}/keys/{mapKeyId}')
    @Security("jwt")
    public async deleteMap(
        @Path() mapId: string,
        @Path() mapKeyId: string,
        @Request() req: any, 
        @Res() response201: TsoaResponse<201, IResponse>, 
        @Res() response404: TsoaResponse<404, IResponse>,
        @Res() response500: TsoaResponse<500, IResponseServerError>
    ) {
        const repo = new RepositoryFactory().getMapKeysRepository();
        await repo.delete(req.user.userId, mapKeyId);
        return response201(201, {
            message: "The item was deleted succesfully."
        });
    }

}
