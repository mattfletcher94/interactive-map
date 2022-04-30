"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagesController = void 0;
require("../env");
const tsoa_1 = require("tsoa");
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const RepositoryFactory_1 = __importDefault(require("../repositories/RepositoryFactory"));
let ImagesController = class ImagesController extends tsoa_1.Controller {
    getImages(req, response200) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = new RepositoryFactory_1.default().getImageRepository();
            const documents = yield repo.getByUserId(req.user.userId);
            return response200(200, {
                message: "The items were found succesfully.",
                data: documents
            });
        });
    }
    getImage(imageId, req, response200, response404) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = new RepositoryFactory_1.default().getImageRepository();
            const document = yield repo.getOneByUserId(req.user.userId, imageId);
            return response200(200, {
                message: "The item was found succesfully.",
                data: document
            });
        });
    }
    postImage(req, body, response201, response400) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get base 64 string
            var image = body.imageBase64.replace(/^data:image\/png;base64,/, "");
            image = image.replace(/^data:image\/jpg;base64,/, "");
            image = image.replace(/^data:image\/jpeg;base64,/, "");
            const repo = new RepositoryFactory_1.default().getImageRepository();
            const document = yield repo.create(req.user.userId, {
                imageName: body.imageName ? body.imageName : "",
                imageBase64: image,
            });
            // Return response
            return response201(201, {
                message: "The item was created succesfully.",
                data: document
            });
        });
    }
    updateMap(imageId, req, body, response200, response400, response404) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = new RepositoryFactory_1.default().getImageRepository();
            const document = yield repo.update(req.user.userId, imageId, body);
            return response200(200, {
                message: "The item was updated succesfully.",
                data: document
            });
        });
    }
    deleteMap(imageId, req, response201, response404, response500) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = new RepositoryFactory_1.default().getImageRepository();
            yield repo.delete(req.user.userId, imageId);
            return response201(201, {
                message: "The item was deleted succesfully."
            });
        });
    }
    handleFile(request, name) {
        var fileDestination = 'uploads/' + request.user.userId + '/';
        var fileName = name;
        fs_1.default.mkdirSync(fileDestination, { recursive: true });
        const multerSingle = multer_1.default({ storage: multer_1.default.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, fileDestination);
                },
                filename: (req, file, cb) => {
                    fileName = fileName + path_1.default.extname(file.originalname);
                    cb(null, fileName);
                }
            }) }).single("imageFile");
        return new Promise((resolve, reject) => {
            multerSingle(request, undefined, (error) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    reject(error);
                }
                resolve({
                    path: fileDestination + fileName,
                    name: fileName,
                });
            }));
        });
    }
};
__decorate([
    tsoa_1.Get(),
    tsoa_1.Security("jwt"),
    __param(0, tsoa_1.Request()),
    __param(1, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "getImages", null);
__decorate([
    tsoa_1.Get("/{imageId}"),
    tsoa_1.Security("jwt"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __param(2, tsoa_1.Res()),
    __param(3, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Function, Function]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "getImage", null);
__decorate([
    tsoa_1.Post(),
    tsoa_1.Security("jwt"),
    __param(0, tsoa_1.Request()),
    __param(1, tsoa_1.Body()),
    __param(2, tsoa_1.Res()),
    __param(3, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function, Function]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "postImage", null);
__decorate([
    tsoa_1.Patch("/{imageId}"),
    tsoa_1.Security("jwt"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __param(2, tsoa_1.Body()),
    __param(3, tsoa_1.Res()),
    __param(4, tsoa_1.Res()),
    __param(5, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Function, Function, Function]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "updateMap", null);
__decorate([
    tsoa_1.Delete("/{imageId}"),
    tsoa_1.Security("jwt"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __param(2, tsoa_1.Res()),
    __param(3, tsoa_1.Res()),
    __param(4, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Function, Function, Function]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "deleteMap", null);
ImagesController = __decorate([
    tsoa_1.Route("images")
], ImagesController);
exports.ImagesController = ImagesController;
