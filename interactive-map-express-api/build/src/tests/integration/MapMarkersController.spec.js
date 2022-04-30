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
const MapMarker_1 = require("../../models/MapMarker");
const User_1 = require("../../models/User");
const ImageRepository_1 = __importDefault(require("../../repositories/ImageRepository"));
const MapMarkersRepository_1 = __importDefault(require("../../repositories/MapMarkersRepository"));
const MapsRepository_1 = __importDefault(require("../../repositories/MapsRepository"));
const UsersRepository_1 = __importDefault(require("../../repositories/UsersRepository"));
describe('Map Markers Controller', () => {
    // Globals
    let req = null;
    let serv = null;
    let user = {};
    let image = {};
    let map = {};
    let marker = {};
    var jwt = "";
    /**
     * Successfully get
     */
    it('GET:200 maps/:id/markers', () => {
        return req.get(`/maps/${map.mapId.toString()}/markers`).set('Authorization', 'Bearer ' + jwt).expect((res) => {
            chai_1.expect(res.body.data).to.be.an('array');
        }).expect(200);
    });
    /**
     * Successfully get one
     */
    it('GET:200 maps/:id/markers/:id', () => {
        return req.get(`/maps/${map.mapId}/markers/${marker.mapMarkerId}`).set('Authorization', 'Bearer ' + jwt).expect((res) => {
            chai_1.expect(res.body.data.mapMarkerId.toString()).to.equal(marker.mapMarkerId.toString());
            chai_1.expect(res.body.data.mapMarkerMap.toString()).to.equal(marker.mapMarkerMap.toString());
            chai_1.expect(res.body.data.mapMarkerUser.toString()).to.equal(marker.mapMarkerUser.toString());
            chai_1.expect(res.body.data.mapMarkerName).to.equal(marker.mapMarkerName);
            chai_1.expect(res.body.data.mapMarkerTitle).to.equal(marker.mapMarkerTitle);
            chai_1.expect(res.body.data.mapMarkerPositionX).to.equal(marker.mapMarkerPositionX);
            chai_1.expect(res.body.data.mapMarkerPositionY).to.equal(marker.mapMarkerPositionY);
            chai_1.expect(res.body.data.mapMarkerOrder).to.equal(marker.mapMarkerOrder);
        }).expect(200);
    });
    /**
     * Unsuccessfully get one
     */
    it('GET:200 maps/:id/markers/:id', () => {
        return req.get(`/maps/${map.mapId.toString()}/markers/123456789123456789123456`).set('Authorization', 'Bearer ' + jwt).expect((res) => {
        }).expect(404);
    });
    /**
     * Succesfully create
     */
    it('POST:201 maps/:id/markers', () => {
        return req.post(`/maps/${map.mapId.toString()}/markers`).set('Authorization', 'Bearer ' + jwt).send({
            mapMarkerMap: map.mapId.toString(),
            mapMarkerName: "test name",
            mapMarkerTitle: "test title",
            mapMarkerDescription: "test description",
            mapMarkerOrder: 10,
            mapMarkerPositionX: 150,
            mapMarkerPositionY: 200,
        }).set('Accept', 'application/json').expect((res) => {
            chai_1.expect(res.body.data.mapMarkerMap.toString()).to.equal(map.mapId.toString());
            chai_1.expect(res.body.data.mapMarkerUser.toString()).to.equal(user.userId.toString());
            chai_1.expect(res.body.data.mapMarkerName).to.equal("test name");
            chai_1.expect(res.body.data.mapMarkerTitle).to.equal("test title");
            chai_1.expect(res.body.data.mapMarkerDescription).to.equal("test description");
            chai_1.expect(res.body.data.mapMarkerPositionX).to.equal(150);
            chai_1.expect(res.body.data.mapMarkerPositionY).to.equal(200);
            chai_1.expect(res.body.data.mapMarkerOrder).to.equal(10);
        }).expect(201);
    });
    /**
     * Unuccesfully create
     */
    it('POST:400 maps/:id/markers', () => {
        return req.post(`/maps/${map.mapId.toString()}/markers`).set('Authorization', 'Bearer ' + jwt).send({}).set('Accept', 'application/json').expect((res) => {
            chai_1.expect(res.body.errors).to.be.an('array');
        }).expect(400);
    });
    /**
     * Succesfully update
     */
    it('PATCH:200 maps/:id/markers/:id', () => {
        return req.patch(`/maps/${map.mapId.toString()}/markers/${marker.mapMarkerId.toString()}`).set('Authorization', 'Bearer ' + jwt).send({
            mapMarkerTitle: "updated title",
        }).set('Accept', 'application/json').expect((res) => {
            chai_1.expect(res.body.data.mapMarkerTitle).to.equal("updated title");
        }).expect(200);
    });
    /**
     * Unuccesfully update (doesn't exist)
     */
    it('PATCH:404 maps/:id/markers/:id', () => {
        return req.patch(`/maps/${map.mapId.toString()}/markers/123456789123456789123456`).set('Authorization', 'Bearer ' + jwt).send({
            mapMarkerTitle: "updated title",
        }).set('Accept', 'application/json').expect((res) => {
        }).expect(404);
    });
    /**
     * Succesfully delete one
     */
    it('DELETE:201 maps/:id/markers/:id', () => {
        return req.delete(`/maps/${map.mapId.toString()}/markers/${marker.mapMarkerId.toString()}`).set('Authorization', 'Bearer ' + jwt).expect((res) => {
        }).expect(201);
    });
    /**
     * Unsuccesfully delete one
     */
    it('DELETE:404 maps/:id/markers/:id', () => {
        return req.delete(`/maps/${map.mapId.toString()}/markers/123456789123456789123456`).set('Authorization', 'Bearer ' + jwt).expect((res) => {
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
            yield MapMarker_1.MapMarker.deleteMany({});
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
            const mapMarkersRepo = new MapMarkersRepository_1.default();
            marker = yield mapMarkersRepo.create(user.userId, {
                mapMarkerMap: map.mapId,
                mapMarkerName: "test name",
                mapMarkerTitle: "test title",
                mapMarkerDescription: "test description",
                mapMarkerOrder: 10,
                mapMarkerPositionX: 150,
                mapMarkerPositionY: 200,
                mapMarkerTitleDisplayType: "hover"
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
