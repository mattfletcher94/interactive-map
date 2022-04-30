"use strict";
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
require("../../env");
const supertest_1 = __importDefault(require("supertest"));
const chai_1 = require("chai");
const server_1 = require("../../server");
const User_1 = require("../../models/User");
const Image_1 = require("../../models/Image");
const UsersRepository_1 = __importDefault(require("../../repositories/UsersRepository"));
const ImageRepository_1 = __importDefault(require("../../repositories/ImageRepository"));
describe('Images Controller', () => {
    // Globals
    let req = null;
    let serv = null;
    let user = {};
    let image = {};
    var jwt = "";
    /**
     * Succesfully gets user images
     */
    it('GET:200 images/', () => {
        return req.get('/images').set('Authorization', 'Bearer ' + jwt).expect((res) => {
            chai_1.expect(res.body.data).to.be.an('array');
        }).expect(200);
    });
    /**
     * Succesfully gets one user image
     */
    it('GET:200 images/:id/', () => {
        return req.get('/images/' + image.imageId.toString()).set('Authorization', 'Bearer ' + jwt).expect((res) => {
            chai_1.expect(res.body.data.imageId.toString()).to.be.equal(image.imageId.toString());
            chai_1.expect(res.body.data.imageName).to.be.equal(image.imageName);
            chai_1.expect(res.body.data.imageUser.toString()).to.be.equal(user.userId.toString());
        }).expect(200);
    });
    /**
     * Unsuccesfully gets one user image
     */
    it('GET:404 images/:id/', () => {
        return req.get('/images/' + "123456789123456789123456").set('Authorization', 'Bearer ' + jwt).expect((res) => {
        }).expect(404);
    });
    /**
     * Succesfully delete one user image
     */
    it('DELETE:201 images/:id/', () => {
        return req.delete('/images/' + image.imageId.toString()).set('Authorization', 'Bearer ' + jwt).expect((res) => {
        }).expect(201);
    });
    /**
     * Unsuccesfully delete one user image
     */
    it('DELETE:404 images/:id/', () => {
        return req.delete('/images/' + "123456789123456789123456").set('Authorization', 'Bearer ' + jwt).expect((res) => {
        }).expect(404);
    });
    /**
     * Before running tets, start up the server
     * Delete all users from test database
     * and then create a new one for testing
     */
    before(function (done) {
        serv = server_1.server.listen();
        req = supertest_1.default.agent(server_1.server);
        User_1.User.deleteMany({}, () => __awaiter(this, void 0, void 0, function* () {
            yield Image_1.Image.deleteMany({}, () => __awaiter(this, void 0, void 0, function* () {
                const repo = new UsersRepository_1.default();
                user = yield repo.create({
                    userFirstName: "test",
                    userLastName: "test",
                    userEmail: "test@test.com",
                    userPassword: "testpassword12345",
                });
                const imageRepo = new ImageRepository_1.default();
                image = yield imageRepo.create(user.userId, {
                    imageName: "test",
                    imageBase64: "test",
                });
                jwt = yield repo.login({
                    userEmail: "test@test.com",
                    userPassword: "testpassword12345",
                });
                done();
            }));
        }));
    });
    /**
     * After running tests, disconnected from server
     */
    after(function (done) {
        server_1.server.close(done);
    });
});
