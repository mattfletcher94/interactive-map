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


describe('Users Controller', () => {

    // Globals
    let req = null as any;
    let serv = null as any;
    let user = {} as IUserClient;
    var jwt = "" as string;
    let userPassword = "";
    

    /**
     * Succesfully create a user
     */
    it('POST:201 users/register', () => {
        return req.post('/users/register').send({
            userFirstName: "test first name",
            userLastName: "test last name",
            userEmail: "test@test12345.com",
            userPassword: "test12345",
        }).set('Accept', 'application/json').expect((res : any) => {
            expect(res.body.data.userFirstName).to.equal("test first name");
            expect(res.body.data.userLastName).to.equal("test last name");
            expect(res.body.data.userEmail).to.equal("test@test12345.com");
        }).expect(201);
    });
    
    /**
     * Create a user with validation errors
     */
    it('POST:400 users/register', () => {
        return req.post('/users/register').send({
            userFirstName: "test first name",
            userLastName: "test last name",
        }).set('Accept', 'application/json').expect((res : any) => {
            expect(res.body.errors).to.be.an('array');
        }).expect(400);
    });

    /**
     * Log in successfully
     */
    it('POST:200 users/login', () => {
        return req.post('/users/login').send({
            userEmail: user.userEmail,
            userPassword: userPassword,
        }).set('Accept', 'application/json').expect((res : any) => {
            jwt = res.body.data.token;
            expect(res.body.data.token).to.not.be.not.null;
        }).expect(200);
    });

    /**
     * Log in unsuccessfully
     */
    it('POST:400 users/login', () => {
        return req.post('/users/login').send({
            userEmail: "invalid@invalid.com",
            userPassword: "invalid",
        }).set('Accept', 'application/json').expect((res : any) => {
            expect(res.body.errors).to.be.an('array');
        }).expect(400);
    });

    /**
     * Get self
     */
    it ('GET:200 users/self', () => {
        return req.get('/users/self').set('Authorization', 'Bearer ' + jwt).expect((res : any) => {
            expect(res.body.data.userFirstName).to.equal(user.userFirstName);
            expect(res.body.data.userLastName).to.equal(user.userLastName);
            expect(res.body.data.userEmail).to.equal(user.userEmail);
        }).expect(200);
    });

    /**
     * Get self with invalid jwt
     */
    it ('GET:401 users/self', () => {
        return req.get('/users/self').set('Authorization', 'Bearer ' + 'invalid').expect((res : any) => {

        }).expect(401);
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
            const repo = new UsersRepository();
            user = await repo.create({
                userFirstName: "test",
                userLastName: "test",
                userEmail: "test@test.com",
                userPassword: "testpassword12345",
            });
            userPassword = "testpassword12345";
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