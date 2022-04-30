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
const fs_1 = __importDefault(require("fs"));
const supertest_1 = __importDefault(require("supertest"));
const chai_1 = require("chai");
const server_1 = require("../../server");
const Image_1 = require("../../models/Image");
const Map_1 = require("../../models/Map");
const User_1 = require("../../models/User");
const ImageRepository_1 = __importDefault(require("../../repositories/ImageRepository"));
const MapsRepository_1 = __importDefault(require("../../repositories/MapsRepository"));
const UsersRepository_1 = __importDefault(require("../../repositories/UsersRepository"));
describe('Maps Controller', () => {
    // Globals
    let req = null;
    let serv = null;
    let user = {};
    let image = {};
    let map = {};
    var jwt = "";
    /**
     * Successfully get
     */
    it('GET:200 maps', () => {
        return req.get('/maps').set('Authorization', 'Bearer ' + jwt).expect((res) => {
            chai_1.expect(res.body.data).to.be.an('array');
        }).expect(200);
    });
    /**
     * Successfully get one
     */
    it('GET:200 maps/:id', () => {
        return req.get('/maps/' + map.mapId).set('Authorization', 'Bearer ' + jwt).expect((res) => {
            var _a;
            chai_1.expect(res.body.data.mapUser.toString()).to.equal(map.mapUser.toString());
            chai_1.expect(res.body.data.mapImage.imageId.toString()).to.equal((_a = map.mapImage) === null || _a === void 0 ? void 0 : _a.imageId.toString());
            chai_1.expect(res.body.data.mapTitle).to.equal(map.mapTitle);
            chai_1.expect(res.body.data.mapDescription).to.equal(map.mapDescription);
        }).expect(200);
    });
    /**
     * Unsuccessfully get one
     */
    it('GET:200 maps/:id', () => {
        return req.get('/maps/' + '123456789123456789123456').set('Authorization', 'Bearer ' + jwt).expect((res) => {
        }).expect(404);
    });
    /**
     * Succesfully create
     */
    it('POST:201 maps', () => {
        return req.post('/maps').set('Authorization', 'Bearer ' + jwt).send({
            mapImage: image.imageId,
            mapTitle: "test title",
            mapDescription: "test description",
        }).set('Accept', 'application/json').expect((res) => {
            chai_1.expect(res.body.data.mapUser.toString()).to.equal(user.userId.toString());
            chai_1.expect(res.body.data.mapImage.imageId.toString()).to.equal(image.imageId.toString());
            chai_1.expect(res.body.data.mapTitle).to.equal("test title");
            chai_1.expect(res.body.data.mapDescription).to.equal("test description");
        }).expect(201);
    });
    /**
     * Unuccesfully create
     */
    it('POST:400 maps', () => {
        return req.post('/maps').set('Authorization', 'Bearer ' + jwt).send({
            mapImage: image.imageId.toString(),
        }).set('Accept', 'application/json').expect((res) => {
            chai_1.expect(res.body.errors).to.be.an('array');
        }).expect(400);
    });
    /**
     * Succesfully update
     */
    it('PATCH:200 maps/:id', () => {
        return req.patch('/maps/' + map.mapId).set('Authorization', 'Bearer ' + jwt).send({
            mapTitle: "updated title",
        }).set('Accept', 'application/json').expect((res) => {
            chai_1.expect(res.body.data.mapTitle).to.equal("updated title");
        }).expect(200);
    });
    /**
     * Unuccesfully update (doesn't exist)
     */
    it('PATCH:404 maps/:id', () => {
        return req.patch('/maps/' + '123456789123456789123456').set('Authorization', 'Bearer ' + jwt).send({
            mapTitle: "updated title",
        }).set('Accept', 'application/json').expect((res) => {
        }).expect(404);
    });
    /**
     * Succesfully delete one
     */
    it('DELETE:201 maps/:id/', () => {
        return req.delete('/maps/' + map.mapId).set('Authorization', 'Bearer ' + jwt).expect((res) => {
        }).expect(201);
    });
    /**
     * Unsuccesfully delete one
     */
    it('DELETE:404 maps/:id/', () => {
        return req.delete('/maps/' + "123456789123456789123456").set('Authorization', 'Bearer ' + jwt).expect((res) => {
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
            yield Image_1.Image.deleteMany({});
            yield Map_1.Map.deleteMany({});
            const repo = new UsersRepository_1.default();
            user = yield repo.create({
                userFirstName: "test",
                userLastName: "test",
                userEmail: "test@test.com",
                userPassword: "testpassword12345",
            });
            jwt = yield repo.login({
                userEmail: "test@test.com",
                userPassword: "testpassword12345",
            });
            const imageRepo = new ImageRepository_1.default();
            image = yield imageRepo.create(user.userId, {
                imageName: "test",
                imageBase64: "test",
            });
            const mapsRepo = new MapsRepository_1.default();
            map = yield mapsRepo.create(user.userId, {
                mapImage: image.imageId,
                mapTitle: "test title",
                mapDescription: "test description",
            });
            done();
        }));
    });
    /**
     * After running tests, disconnected from server
     */
    after(function (done) {
        if (user.userId) {
            fs_1.default.rmdirSync('uploads/' + user.userId, { recursive: true });
        }
        server_1.server.close(done);
    });
});
