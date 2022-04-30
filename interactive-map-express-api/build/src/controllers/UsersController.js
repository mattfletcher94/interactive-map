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
exports.UsersController = void 0;
const tsoa_1 = require("tsoa");
const RepositoryFactory_1 = __importDefault(require("../repositories/RepositoryFactory"));
let UsersController = class UsersController extends tsoa_1.Controller {
    userGetSelf(req, response200, response404) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = new RepositoryFactory_1.default().getUsersRepository();
            const document = yield repo.getOne(req.user.userId);
            return response200(200, {
                message: "The item was found succesfully.",
                data: document
            });
        });
    }
    updateMap(req, body, response200, response400, response404) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = new RepositoryFactory_1.default().getUsersRepository();
            const document = yield repo.update(req.user.userId, body);
            return response200(200, {
                message: "The item was updated succesfully.",
                data: document
            });
        });
    }
    userDelete(req, response201, response404) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = new RepositoryFactory_1.default().getUsersRepository();
            yield repo.delete(req.user.userId);
            return response201(201, {
                message: "The item was deleted succesfully."
            });
        });
    }
    userLogin(body, resposne200, response400) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = new RepositoryFactory_1.default().getUsersRepository();
            const token = yield repo.login(body);
            return resposne200(200, {
                message: "Logged in succesfully.",
                data: { token: token }
            });
        });
    }
    userRegister(req, body, response201, response400) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = new RepositoryFactory_1.default().getUsersRepository();
            const document = yield repo.create(body);
            return response201(201, {
                message: "The item was created succesfully.",
                data: document
            });
        });
    }
};
__decorate([
    tsoa_1.Get("/self"),
    tsoa_1.Security("jwt"),
    __param(0, tsoa_1.Request()),
    __param(1, tsoa_1.Res()),
    __param(2, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function, Function]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "userGetSelf", null);
__decorate([
    tsoa_1.Patch("/self"),
    tsoa_1.Security("jwt"),
    __param(0, tsoa_1.Request()),
    __param(1, tsoa_1.Body()),
    __param(2, tsoa_1.Res()),
    __param(3, tsoa_1.Res()),
    __param(4, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function, Function, Function]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateMap", null);
__decorate([
    tsoa_1.Delete("/self"),
    tsoa_1.Security("jwt"),
    __param(0, tsoa_1.Request()),
    __param(1, tsoa_1.Res()),
    __param(2, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function, Function]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "userDelete", null);
__decorate([
    tsoa_1.Post("/login"),
    __param(0, tsoa_1.Body()),
    __param(1, tsoa_1.Res()),
    __param(2, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function, Function]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "userLogin", null);
__decorate([
    tsoa_1.Post("/register"),
    __param(0, tsoa_1.Request()),
    __param(1, tsoa_1.Body()),
    __param(2, tsoa_1.Res()),
    __param(3, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function, Function]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "userRegister", null);
UsersController = __decorate([
    tsoa_1.Route("users")
], UsersController);
exports.UsersController = UsersController;
