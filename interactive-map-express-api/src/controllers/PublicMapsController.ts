import { Controller, Get, Route, Security, Body, Post, Res, TsoaResponse, Request, Delete, Path, Patch } from "tsoa";
import IResponse from "../responses/IResponse";
import RepositoryFactory from "../repositories/RepositoryFactory";
import { IMapClient } from "../models/Map";

@Route("public/maps")
export class PublicMapsController extends Controller {

    @Get("/{mapId}")
    public async getMap(
        @Path() mapId: string,
        @Request() req: any, 
        @Res() response200: TsoaResponse<200, IResponse<IMapClient>>, 
        @Res() response404: TsoaResponse<404, IResponse>,
    ) {
        const repo = new RepositoryFactory().getMapsRepository();
        const document = await repo.getOne(mapId);
        return response200(200, {
            message: "The item was found succesfully.",
            data: document
        });
    }

}
