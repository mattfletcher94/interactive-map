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


describe('Maps Controller', () => {

    // Globals
    let req = null as any;
    let serv = null as any;
    let user = {} as IUserClient;
    let image = {} as IImageClient;
    let map = {} as IMapClient;
    var jwt = "" as string;

    /**
     * Successfully get
     */
    it('GET:200 maps', () => {
        return req.get('/maps').set('Authorization', 'Bearer ' + jwt).expect((res : any) => {
            expect(res.body.data).to.be.an('array');
        }).expect(200);
    });

    /**
     * Successfully get one
     */
    it('GET:200 maps/:id', () => {
        return req.get('/maps/' + map.mapId).set('Authorization', 'Bearer ' + jwt).expect((res : any) => {
            expect(res.body.data.mapUser.toString()).to.equal(map.mapUser.toString());
            expect(res.body.data.mapImage.imageId.toString()).to.equal(map.mapImage?.imageId.toString());
            expect(res.body.data.mapTitle).to.equal(map.mapTitle);
            expect(res.body.data.mapDescription).to.equal(map.mapDescription);
        }).expect(200);
    });

    /**
     * Unsuccessfully get one
     */
    it('GET:200 maps/:id', () => {
        return req.get('/maps/' + '123456789123456789123456').set('Authorization', 'Bearer ' + jwt).expect((res : any) => {
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
        }).set('Accept', 'application/json').expect((res : any) => {
            expect(res.body.data.mapUser.toString()).to.equal(user.userId.toString());
            expect(res.body.data.mapImage.imageId.toString()).to.equal(image.imageId.toString());
            expect(res.body.data.mapTitle).to.equal("test title");
            expect(res.body.data.mapDescription).to.equal("test description");
        }).expect(201);
    });

    /**
     * Unuccesfully create
     */
    it('POST:400 maps', () => {
        return req.post('/maps').set('Authorization', 'Bearer ' + jwt).send({
            mapImage: image.imageId.toString(),
        }).set('Accept', 'application/json').expect((res : any) => {
            expect(res.body.errors).to.be.an('array');
        }).expect(400);
    });

    /**
     * Succesfully update
     */
    it('PATCH:200 maps/:id', () => {
        return req.patch('/maps/' + map.mapId).set('Authorization', 'Bearer ' + jwt).send({
            mapTitle: "updated title",
        }).set('Accept', 'application/json').expect((res : any) => {
            expect(res.body.data.mapTitle).to.equal("updated title");
        }).expect(200);
    });

    /**
     * Unuccesfully update (doesn't exist)
     */
    it('PATCH:404 maps/:id', () => {
        return req.patch('/maps/' + '123456789123456789123456').set('Authorization', 'Bearer ' + jwt).send({
            mapTitle: "updated title",
        }).set('Accept', 'application/json').expect((res : any) => {
        }).expect(404);
    });

    /**
     * Succesfully delete one
     */
    it('DELETE:201 maps/:id/', () => {
        return req.delete('/maps/' + map.mapId).set('Authorization', 'Bearer ' + jwt).expect((res : any) => {
        }).expect(201);
    });

    /**
     * Unsuccesfully delete one
     */
    it('DELETE:404 maps/:id/', () => {
        return req.delete('/maps/' + "123456789123456789123456").set('Authorization', 'Bearer ' + jwt).expect((res : any) => {
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