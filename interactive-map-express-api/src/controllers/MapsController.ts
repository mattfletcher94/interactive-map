import { Controller, Get, Route, Security, Body, Post, Res, TsoaResponse, Request, Delete, Path, Patch } from "tsoa";
import IResponse from "../responses/IResponse";
import IResponseErrors from "../responses/IResponseErrors";
import IResponseServerError from "../responses/IResponseServerError";
import RepositoryFactory from "../repositories/RepositoryFactory";
import { IMapClient, IMapCreate, IMapUpdate } from "../models/Map";

@Route("maps")
export class MapsController extends Controller {

    @Get()
    @Security("jwt")
    public async getMaps(
        @Request() req: any, 
        @Res() response200: TsoaResponse<200, IResponse<Array<IMapClient>>>, 
    ) {
        const repo = new RepositoryFactory().getMapsRepository();
        const documents = await repo.getByUserId(req.user.userId);
        return response200(200, {
            message: "The items were found succesfully.",
            data: documents
        });
    }

    @Get("/{mapId}")
    @Security("jwt")
    public async getMap(
        @Path() mapId: string,
        @Request() req: any, 
        @Res() response200: TsoaResponse<200, IResponse<IMapClient>>, 
        @Res() response404: TsoaResponse<404, IResponse>,
    ) {
        const repo = new RepositoryFactory().getMapsRepository();
        const document = await repo.getOneByUserId(req.user.userId, mapId);
        return response200(200, {
            message: "The item was found succesfully.",
            data: document
        });
    }

    @Post()
    @Security("jwt")
    public async postMaps(
        @Request() req: any, 
        @Body() body: IMapCreate, 
        @Res() response201: TsoaResponse<201, IResponse<IMapClient>>, 
        @Res() response400: TsoaResponse<400, IResponseErrors>,
    ) {
        const repo = new RepositoryFactory().getMapsRepository();
        const document = await repo.create(req.user.userId, body);
        return response201(201, {
            message: "The item was created succesfully.",
            data: document
        });
    }

    @Patch("/{mapId}")
    @Security("jwt")
    public async updateMap(
        @Path() mapId: string,
        @Request() req: any, 
        @Body() body: IMapUpdate, 
        @Res() response200: TsoaResponse<200, IResponse<IMapClient>>, 
        @Res() response400: TsoaResponse<400, IResponseErrors>,
        @Res() response404: TsoaResponse<404, IResponse>,
    ) {
        const repo = new RepositoryFactory().getMapsRepository();
        const document = await repo.update(req.user.userId, mapId, body);
        return response200(200, {
            message: "The item was updated succesfully.",
            data: document
        });
    }

    @Delete("/{mapId}")
    @Security("jwt")
    public async deleteMap(
        @Path() mapId: string,
        @Request() req: any, 
        @Res() response201: TsoaResponse<201, IResponse>, 
        @Res() response404: TsoaResponse<404, IResponse>,
        @Res() response500: TsoaResponse<500, IResponseServerError>
    ) {
        const repo = new RepositoryFactory().getMapsRepository();
        await repo.delete(req.user.userId, mapId);
        return response201(201, {
            message: "The item was deleted succesfully."
        });
    }

}
