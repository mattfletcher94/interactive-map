import { Controller, Get, Route, Security, Body, Post, Res, TsoaResponse, Request, Delete, Patch } from "tsoa";
import IResponse from "../responses/IResponse";
import IResponseErrors from "../responses/IResponseErrors";
import RepositoryFactory from "../repositories/RepositoryFactory";
import { IUserClient, IUserCreate, IUserLogin, IUserUpdate } from "../models/User";

@Route("users")
export class UsersController extends Controller {

    @Get("/self")
    @Security("jwt")
    public async userGetSelf(
        @Request() req: any, 
        @Res() response200: TsoaResponse<200, IResponse<IUserClient>>, 
        @Res() response404: TsoaResponse<404, IResponse>,
    ) {
        const repo = new RepositoryFactory().getUsersRepository();
        const document = await repo.getOne(req.user.userId);
        return response200(200, {
            message: "The item was found succesfully.",
            data: document
        });
    }
	
    @Patch("/self")
    @Security("jwt")
    public async updateMap(
        @Request() req: any, 
        @Body() body: IUserUpdate, 
        @Res() response200: TsoaResponse<200, IResponse<IUserClient>>, 
        @Res() response400: TsoaResponse<400, IResponseErrors>,
        @Res() response404: TsoaResponse<404, IResponse>,
    ) {
        const repo = new RepositoryFactory().getUsersRepository();
        const document = await repo.update(req.user.userId, body);
        return response200(200, {
            message: "The item was updated succesfully.",
            data: document
        });
    }

    @Delete("/self")
    @Security("jwt")
    public async userDelete(
        @Request() req: any, 
        @Res() response201: TsoaResponse<201, IResponse>, 
        @Res() response404: TsoaResponse<404, IResponse>,
    ) {
        const repo = new RepositoryFactory().getUsersRepository();
        await repo.delete(req.user.userId);
        return response201(201, {
            message: "The item was deleted succesfully."
        });
    }

    @Post("/login")
    public async userLogin(
        @Body() body: IUserLogin, 
        @Res() resposne200: TsoaResponse<200, IResponse<{ token: string }>>, 
        @Res() response400: TsoaResponse<400, IResponseErrors>,
    ) {
        const repo = new RepositoryFactory().getUsersRepository();
        const token = await repo.login(body);
        return resposne200(200, {
            message: "Logged in succesfully.",
            data: { token: token }
        });
    }

    @Post("/register")
    public async userRegister(
        @Request() req: any, 
        @Body() body: IUserCreate, 
        @Res() response201: TsoaResponse<201, IResponse<IUserClient>>, 
        @Res() response400: TsoaResponse<400, IResponseErrors>,
    ) {
        const repo = new RepositoryFactory().getUsersRepository();
        const document = await repo.create(body);
        return response201(201, {
            message: "The item was created succesfully.",
            data: document
        });
    }

}
