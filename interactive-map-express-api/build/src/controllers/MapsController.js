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
exports.MapsController = void 0;
const tsoa_1 = require("tsoa");
const RepositoryFactory_1 = __importDefault(require("../repositories/RepositoryFactory"));
let MapsController = class MapsController extends tsoa_1.Controller {
    getMaps(req, response200) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = new RepositoryFactory_1.default().getMapsRepository();
            const documents = yield repo.getByUserId(req.user.userId);
            return response200(200, {
                message: "The items were found succesfully.",
                data: documents
            });
        });
    }
    getMap(mapId, req, response200, response404) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = new RepositoryFactory_1.default().getMapsRepository();
            const document = yield repo.getOneByUserId(req.user.userId, mapId);
            return response200(200, {
                message: "The item was found succesfully.",
                data: document
            });
        });
    }
    postMaps(req, body, response201, response400) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = new RepositoryFactory_1.default().getMapsRepository();
            const document = yield repo.create(req.user.userId, body);
            return response201(201, {
                message: "The item was created succesfully.",
                data: document
            });
        });
    }
    updateMap(mapId, req, body, response200, response400, response404) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = new RepositoryFactory_1.default().getMapsRepository();
            const document = yield repo.update(req.user.userId, mapId, body);
            return response200(200, {
                message: "The item was updated succesfully.",
                data: document
            });
        });
    }
    deleteMap(mapId, req, response201, response404, response500) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = new RepositoryFactory_1.default().getMapsRepository();
            yield repo.delete(req.user.userId, mapId);
            return response201(201, {
                message: "The item was deleted succesfully."
            });
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
], MapsController.prototype, "getMaps", null);
__decorate([
    tsoa_1.Get("/{mapId}"),
    tsoa_1.Security("jwt"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __param(2, tsoa_1.Res()),
    __param(3, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Function, Function]),
    __metadata("design:returntype", Promise)
], MapsController.prototype, "getMap", null);
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
], MapsController.prototype, "postMaps", null);
__decorate([
    tsoa_1.Patch("/{mapId}"),
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
], MapsController.prototype, "updateMap", null);
__decorate([
    tsoa_1.Delete("/{mapId}"),
    tsoa_1.Security("jwt"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __param(2, tsoa_1.Res()),
    __param(3, tsoa_1.Res()),
    __param(4, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Function, Function, Function]),
    __metadata("design:returntype", Promise)
], MapsController.prototype, "deleteMap", null);
MapsController = __decorate([
    tsoa_1.Route("maps")
], MapsController);
exports.MapsController = MapsController;
