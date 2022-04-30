import '../../env';
import fs from 'fs';
import request from 'supertest';
import { expect } from 'chai';
import { server } from '../../server';
import { IImageClient, Image } from '../../models/Image';
import { IMapClient, Map, MapSchema } from '../../models/Map';
import { IMapMarkerClient, MapMarker } from '../../models/MapMarker';
import { IMapKeyClient, MapKey } from '../../models/MapKey';
import { IUserClient, User } from '../../models/User';
import ImageRepository from '../../repositories/ImageRepository';
import MapKeysRepository from '../../repositories/MapKeysRepository';
import MapMarkersRepository from '../../repositories/MapMarkersRepository';
import MapsRepository from '../../repositories/MapsRepository';
import UsersRepository from '../../repositories/UsersRepository';


describe('Map Keys Controller', () => {

    // Globals
    let req = null as any;
    let serv = null as any;
    let user = {} as IUserClient;
    let image = {} as IImageClient;
    let map = {} as IMapClient;
    let marker = {} as IMapMarkerClient;
    let mapkey = {} as IMapKeyClient;
    var jwt = "" as string;

    /**
     * Successfully get
     */
    it('GET:200 maps/:id/keys', () => {
        return req.get(`/maps/${map.mapId.toString()}/keys`).set('Authorization', 'Bearer ' + jwt).expect((res : any) => {
            expect(res.body.data).to.be.an('array');
        }).expect(200);
    });

    /**
     * Successfully get one
     */
    it('GET:200 maps/:id/keys/:id', () => {
        return req.get(`/maps/${map.mapId}/keys/${mapkey.mapKeyId}`).set('Authorization', 'Bearer ' + jwt).expect((res : any) => {
            expect(res.body.data.mapKeyId.toString()).to.equal(mapkey.mapKeyId.toString());
            expect(res.body.data.mapKeyUser.toString()).to.equal(mapkey.mapKeyUser.toString());
            expect(res.body.data.mapKeyMap).to.equal(mapkey.mapKeyMap.toString());
            expect(res.body.data.mapKeyTitle).to.equal(mapkey.mapKeyTitle);
            expect(res.body.data.mapKeyColor).to.equal(mapkey.mapKeyColor);
        }).expect(200);
    });

    /**
     * Unsuccessfully get one
     */
    it('GET:200 maps/:id/keys/:id', () => {
        return req.get(`/maps/${map.mapId.toString()}/keys/123456789123456789123456`).set('Authorization', 'Bearer ' + jwt).expect((res : any) => {
        }).expect(404);
    });
    
    /**
     * Succesfully create
     */
    it('POST:201 maps/:id/keys', () => {
        return req.post(`/maps/${map.mapId.toString()}/keys`).set('Authorization', 'Bearer ' + jwt).send({
            mapKeyMap: map.mapId.toString(),
            mapKeyTitle: "test title",
            mapKeyColor: "ff4747",
        }).set('Accept', 'application/json').expect((res : any) => {
            expect(res.body.data.mapKeyMap.toString()).to.equal(map.mapId.toString());
            expect(res.body.data.mapKeyUser.toString()).to.equal(user.userId.toString());
            expect(res.body.data.mapKeyTitle).to.equal("test title");
            expect(res.body.data.mapKeyColor).to.equal("ff4747");
        }).expect(201);
    });

    /**
     * Unuccesfully create
     */
    it('POST:400 maps/:id/keys', () => {
        return req.post(`/maps/${map.mapId}/keys`).set('Authorization', 'Bearer ' + jwt).send({
        }).set('Accept', 'application/json').expect((res : any) => {
            expect(res.body.errors).to.be.an('array');
        }).expect(400);
    });

    /**
     * Succesfully update
     */
    it('PATCH:200 maps/:id/keys/:id', () => {
        return req.patch(`/maps/${map.mapId.toString()}/keys/${mapkey.mapKeyId}`).set('Authorization', 'Bearer ' + jwt).send({
            mapKeyColor: "updated color",
        }).set('Accept', 'application/json').expect((res : any) => {
            expect(res.body.data.mapKeyColor).to.equal("updated color");
        }).expect(200);
    });

    /**
     * Unuccesfully update (doesn't exist)
     */
    it('PATCH:404 maps/:id/keys/:id', () => {
        return req.patch(`/maps/${map.mapId.toString()}/keys/123456789123456789123456`).set('Authorization', 'Bearer ' + jwt).send({
            mapKeyColor: "updated color",
        }).set('Accept', 'application/json').expect((res : any) => {
        }).expect(404);
    });

    /**
     * Succesfully delete one
     */
    it('DELETE:201 maps/:id/keys/:id', () => {
        return req.delete(`/maps/${map.mapId.toString()}/keys/${mapkey.mapKeyId.toString()}`).set('Authorization', 'Bearer ' + jwt).expect((res : any) => {
        }).expect(201);
    });

    /**
     * Unsuccesfully delete one
     */
    it('DELETE:404 maps/:id/keys/:id', () => {
        return req.delete(`/maps/${map.mapId.toString()}/keys/123456789123456789123456`).set('Authorization', 'Bearer ' + jwt).expect((res : any) => {
        }).expect(404);
    });

    /**
     * Before running tets, start up the server
     * Delete all users from test database
     * and then create a new one for testing
     */
    before(function(done) {
        serv = server.listen();
        req = request.agent(server);
        User.deleteMany({}, async () => {
            await Image.deleteMany({});
            await Map.deleteMany({});
            await MapMarker.deleteMany({});
            await MapKey.deleteMany({});
            const repo = new UsersRepository();
            user = await repo.create({
                userFirstName: "test",
                userLastName: "test",
                userEmail: "test@test.com",
                userPassword: "testpassword12345",
            });
            jwt = await repo.login({
                userEmail: "test@test.com",
                userPassword: "testpassword12345",
            });
            const imageRepo = new ImageRepository();
            image = await imageRepo.create(user.userId, {
                imageName: "test",
                imageBase64: "test",
            })
            const mapsRepo = new MapsRepository();
            map = await mapsRepo.create(user.userId, {
                mapImage: image.imageId,
                mapTitle: "test title",
                mapDescription: "test description",
            });
            const mapMarkersRepo = new MapMarkersRepository();
            marker = await mapMarkersRepo.create(user.userId, {
                mapMarkerMap: map.mapId,
                mapMarkerName: "test name",
                mapMarkerTitle: "test title",
                mapMarkerDescription: "test description",
                mapMarkerOrder: 10,
                mapMarkerPositionX: 150,
                mapMarkerPositionY: 200,
                mapMarkerTitleDisplayType: "hover"
            });
            const mapKeysRepo = new MapKeysRepository();
            mapkey = await mapKeysRepo.create(user.userId, {
                mapKeyMap: map.mapId,
                mapKeyTitle: "test title",
                mapKeyColor: "ff4747",
            });
            done();
        });
    });

    /**
     * After running tests, disconnected from server
     */
    after(function(done){
        if (user.userId) {
            fs.rmdirSync('uploads/' + user.userId, { recursive: true });
        }
        server.close(done);
    });

});