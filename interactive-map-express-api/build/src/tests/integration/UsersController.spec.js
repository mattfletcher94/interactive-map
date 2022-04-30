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
const User_1 = require("../../models/User");
const UsersRepository_1 = __importDefault(require("../../repositories/UsersRepository"));
describe('Users Controller', () => {
    // Globals
    let req = null;
    let serv = null;
    let user = {};
    var jwt = "";
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
        }).set('Accept', 'application/json').expect((res) => {
            chai_1.expect(res.body.data.userFirstName).to.equal("test first name");
            chai_1.expect(res.body.data.userLastName).to.equal("test last name");
            chai_1.expect(res.body.data.userEmail).to.equal("test@test12345.com");
        }).expect(201);
    });
    /**
     * Create a user with validation errors
     */
    it('POST:400 users/register', () => {
        return req.post('/users/register').send({
            userFirstName: "test first name",
            userLastName: "test last name",
        }).set('Accept', 'application/json').expect((res) => {
            chai_1.expect(res.body.errors).to.be.an('array');
        }).expect(400);
    });
    /**
     * Log in successfully
     */
    it('POST:200 users/login', () => {
        return req.post('/users/login').send({
            userEmail: user.userEmail,
            userPassword: userPassword,
        }).set('Accept', 'application/json').expect((res) => {
            jwt = res.body.data.token;
            chai_1.expect(res.body.data.token).to.not.be.not.null;
        }).expect(200);
    });
    /**
     * Log in unsuccessfully
     */
    it('POST:400 users/login', () => {
        return req.post('/users/login').send({
            userEmail: "invalid@invalid.com",
            userPassword: "invalid",
        }).set('Accept', 'application/json').expect((res) => {
            chai_1.expect(res.body.errors).to.be.an('array');
        }).expect(400);
    });
    /**
     * Get self
     */
    it('GET:200 users/self', () => {
        return req.get('/users/self').set('Authorization', 'Bearer ' + jwt).expect((res) => {
            chai_1.expect(res.body.data.userFirstName).to.equal(user.userFirstName);
            chai_1.expect(res.body.data.userLastName).to.equal(user.userLastName);
            chai_1.expect(res.body.data.userEmail).to.equal(user.userEmail);
        }).expect(200);
    });
    /**
     * Get self with invalid jwt
     */
    it('GET:401 users/self', () => {
        return req.get('/users/self').set('Authorization', 'Bearer ' + 'invalid').expect((res) => {
        }).expect(401);
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
            const repo = new UsersRepository_1.default();
            user = yield repo.create({
                userFirstName: "test",
                userLastName: "test",
                userEmail: "test@test.com",
                userPassword: "testpassword12345",
            });
            userPassword = "testpassword12345";
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
