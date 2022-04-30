import '../env';
import { Controller, Get, Route, Security, Body, Post, Res, TsoaResponse, Request, Delete, Path, Patch, SuccessResponse, Response } from "tsoa";
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import IResponse from "../responses/IResponse";
import IResponseErrors from "../responses/IResponseErrors";
import IResponseServerError from "../responses/IResponseServerError";
import RepositoryFactory from "../repositories/RepositoryFactory";
import { IImageClient, IImageCreate, IImageUpdate } from '../models/Image';


@Route("images")
export class ImagesController extends Controller {

    @Get()
    @Security("jwt")
    public async getImages(
        @Request() req: any, 
        @Res() response200: TsoaResponse<200, IResponse<Array<IImageClient>>>, 
    ) {
        const repo = new RepositoryFactory().getImageRepository();
        const documents = await repo.getByUserId(req.user.userId);
        return response200(200, {
            message: "The items were found succesfully.",
            data: documents
        });
    }

    @Get("/{imageId}")
    @Security("jwt")
    public async getImage(
        @Path() imageId: string,
        @Request() req: any, 
        @Res() response200: TsoaResponse<200, IResponse<IImageClient>>, 
        @Res() response404: TsoaResponse<404, IResponse>,
    ) {
        const repo = new RepositoryFactory().getImageRepository();
        const document = await repo.getOneByUserId(req.user.userId, imageId);
        return response200(200, {
            message: "The item was found succesfully.",
            data: document
        });
    }

    @Post()
    @Security("jwt")
    public async postImage(
        @Request() req: any, 
        @Body() body: IImageCreate, 
        @Res() response201: TsoaResponse<201, IResponse<IImageClient>>, 
        @Res() response400: TsoaResponse<400, IResponseErrors>,
    ) {

        
        // Get base 64 string
        var image = body.imageBase64.replace(/^data:image\/png;base64,/,"");
        image = image.replace(/^data:image\/jpg;base64,/,"");
        image = image.replace(/^data:image\/jpeg;base64,/,"");

        const repo = new RepositoryFactory().getImageRepository();
        const document = await repo.create(req.user.userId, {
            imageName: body.imageName ? body.imageName : "",
            imageBase64: image,
        });

        // Return response
        return response201(201, {
            message: "The item was created succesfully.",
            data: document
        });
    }

    @Patch("/{imageId}")
    @Security("jwt")
    public async updateMap(
        @Path() imageId: string,
        @Request() req: any, 
        @Body() body: IImageUpdate, 
        @Res() response200: TsoaResponse<200, IResponse<IImageClient>>, 
        @Res() response400: TsoaResponse<400, IResponseErrors>,
        @Res() response404: TsoaResponse<404, IResponse>,
    ) {
        const repo = new RepositoryFactory().getImageRepository();
        const document = await repo.update(req.user.userId, imageId, body);
        return response200(200, {
            message: "The item was updated succesfully.",
            data: document
        });
    }

    @Delete("/{imageId}")
    @Security("jwt")
    public async deleteMap(
        @Path() imageId: string,
        @Request() req: any, 
        @Res() response201: TsoaResponse<201, IResponse>, 
        @Res() response404: TsoaResponse<404, IResponse>,
        @Res() response500: TsoaResponse<500, IResponseServerError>
    ) {
        const repo = new RepositoryFactory().getImageRepository();
        await repo.delete(req.user.userId, imageId);
        return response201(201, {
            message: "The item was deleted succesfully."
        });
    }


    private handleFile(request: any, name : string): Promise<any> {
        var fileDestination = 'uploads/' + request.user.userId + '/';
        var fileName = name;
        fs.mkdirSync(fileDestination, { recursive: true });
        const multerSingle = multer({ storage: multer.diskStorage({ 
            destination: (req, file, cb) => { 
                cb(null, fileDestination) 
            }, 
            filename: (req, file, cb) => { 
                fileName = fileName  + path.extname(file.originalname);
                cb(null, fileName) 
            } 
        })}).single("imageFile");
        return new Promise((resolve, reject) => {
            multerSingle(request, <any>undefined, async (error : any) => {
                if (error) {
                    reject(error);
                }
                resolve({
                    path: fileDestination + fileName,
                    name: fileName,
                });
            });
        });
    }

}