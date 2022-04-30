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
exports.MapKeysController = void 0;
const tsoa_1 = require("tsoa");
const RepositoryFactory_1 = __importDefault(require("../repositories/RepositoryFactory"));
let MapKeysController = class MapKeysController extends tsoa_1.Controller {
    getAll(mapId, req, response200, response404, response500) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = new RepositoryFactory_1.default().getMapKeysRepository();
            const documents = yield repo.getByUserIdAndMapId(req.user.userId, mapId);
            return response200(200, {
                message: "The items were found succesfully.",
                data: documents
            });
        });
    }
    getOne(mapId, keyId, req, response200, response404, response500) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = new RepositoryFactory_1.default().getMapKeysRepository();
            const document = yield repo.getOneByUserIdAndMapId(req.user.userId, mapId, keyId);
            return response200(200, {
                message: "The item was found succesfully.",
                data: document
            });
        });
    }
    post(mapId, req, body, response201, response400, response500) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = new RepositoryFactory_1.default().getMapKeysRepository();
            body.mapKeyMap = mapId;
            const map = yield repo.create(req.user.userId, body);
            return response201(201, {
                message: "The item was created succesfully.",
                data: map
            });
        });
    }
    update(mapId, mapKeyId, req, body, response200, response400, response404, response500) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = new RepositoryFactory_1.default().getMapKeysRepository();
            const document = yield repo.update(req.user.userId, mapKeyId, body);
            return response200(200, {
                message: "The item was updated succesfully.",
                data: document
            });
        });
    }
    deleteMap(mapId, mapKeyId, req, response201, response404, response500) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = new RepositoryFactory_1.default().getMapKeysRepository();
            yield repo.delete(req.user.userId, mapKeyId);
            return response201(201, {
                message: "The item was deleted succesfully."
            });
        });
    }
};
__decorate([
    tsoa_1.Get('{mapId}/keys'),
    tsoa_1.Security("jwt"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __param(2, tsoa_1.Res()),
    __param(3, tsoa_1.Res()),
    __param(4, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Function, Function, Function]),
    __metadata("design:returntype", Promise)
], MapKeysController.prototype, "getAll", null);
__decorate([
    tsoa_1.Get("/{mapId}/keys/{keyId}"),
    tsoa_1.Security("jwt"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Path()),
    __param(2, tsoa_1.Request()),
    __param(3, tsoa_1.Res()),
    __param(4, tsoa_1.Res()),
    __param(5, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Function, Function, Function]),
    __metadata("design:returntype", Promise)
], MapKeysController.prototype, "getOne", null);
__decorate([
    tsoa_1.Post('{mapId}/keys'),
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
], MapKeysController.prototype, "post", null);
__decorate([
    tsoa_1.Patch("/{mapId}/keys/{mapKeyId}"),
    tsoa_1.Security("jwt"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Path()),
    __param(2, tsoa_1.Request()),
    __param(3, tsoa_1.Body()),
    __param(4, tsoa_1.Res()),
    __param(5, tsoa_1.Res()),
    __param(6, tsoa_1.Res()),
    __param(7, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object, Function, Function, Function, Function]),
    __metadata("design:returntype", Promise)
], MapKeysController.prototype, "update", null);
__decorate([
    tsoa_1.Delete('{mapId}/keys/{mapKeyId}'),
    tsoa_1.Security("jwt"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Path()),
    __param(2, tsoa_1.Request()),
    __param(3, tsoa_1.Res()),
    __param(4, tsoa_1.Res()),
    __param(5, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Function, Function, Function]),
    __metadata("design:returntype", Promise)
], MapKeysController.prototype, "deleteMap", null);
MapKeysController = __decorate([
    tsoa_1.Route("maps/")
], MapKeysController);
exports.MapKeysController = MapKeysController;
