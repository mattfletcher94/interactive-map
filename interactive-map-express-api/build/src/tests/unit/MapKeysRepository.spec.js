"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
require("../../env");
const fs_1 = __importDefault(require("fs"));
const chai_1 = __importStar(require("chai"));
const mongoose_1 = __importDefault(require("mongoose"));
const RepositoryFactory_1 = __importDefault(require("../../repositories/RepositoryFactory"));
const RepositoryValidationError_1 = __importDefault(require("../../repositories/errors/RepositoryValidationError"));
const RepositoryNotFoundError_1 = __importDefault(require("../../repositories/errors/RepositoryNotFoundError"));
const Image_1 = require("../../models/Image");
const Map_1 = require("../../models/Map");
const MapMarker_1 = require("../../models/MapMarker");
const MapKey_1 = require("../../models/MapKey");
const User_1 = require("../../models/User");
// Use chai as promised
chai_1.default.use(require('chai-as-promised'));
/**
 * Test the MapMarkersRepository
 */
describe('MapKeysRepository', () => {
    // Define globals
    let userId = "";
    let mapId = "";
    it("Creates a valid document", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new RepositoryFactory_1.default().getMapKeysRepository();
        const document = yield repo.create(userId, {
            mapKeyMap: mapId,
            mapKeyColor: "ff4747",
            mapKeyTitle: "test",
        });
        chai_1.expect(document.mapKeyMap.toString()).to.equal(mapId);
        chai_1.expect(document.mapKeyColor).to.equal("ff4747");
        chai_1.expect(document.mapKeyTitle).to.equal("test");
    }));
    it("Throws an error when creating an invalid document", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new RepositoryFactory_1.default().getMapKeysRepository();
        yield chai_1.expect(repo.create(userId, {
            mapKeyMap: mapId,
            mapKeyColor: "ff4747",
            mapKeyTitle: null,
        })).to.eventually.be.rejectedWith(RepositoryValidationError_1.default);
    }));
    it("Gets all markers for a specific map", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new RepositoryFactory_1.default().getMapKeysRepository();
        const documents = yield repo.getByUserIdAndMapId(userId, mapId);
        chai_1.expect(documents).to.be.an("array");
    }));
    it("Gets one by its id", () => __awaiter(void 0, void 0, void 0, function* () {
        // Create an item first
        const repo = new RepositoryFactory_1.default().getMapKeysRepository();
        const created = yield repo.create(userId, {
            mapKeyMap: mapId,
            mapKeyColor: "ff4747",
            mapKeyTitle: "test",
        });
        // Get the item
        const document = yield repo.getOneByUserIdAndMapId(userId, created.mapKeyMap, created.mapKeyId);
        chai_1.expect(document.mapKeyMap.toString()).to.equal(mapId);
        chai_1.expect(document.mapKeyColor).to.equal("ff4747");
        chai_1.expect(document.mapKeyTitle).to.equal("test");
    }));
    it("Throws an error when getting a document that doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new RepositoryFactory_1.default().getMapKeysRepository();
        yield chai_1.expect(repo.getOneByUserIdAndMapId(userId, mapId, "123456789123456789123456")).to.eventually.be.rejectedWith(RepositoryNotFoundError_1.default);
    }));
    it("Update a document with valid data", () => __awaiter(void 0, void 0, void 0, function* () {
        // Create a document first
        const repo = new RepositoryFactory_1.default().getMapKeysRepository();
        const created = yield repo.create(userId, {
            mapKeyMap: mapId,
            mapKeyColor: "ff4747",
            mapKeyTitle: "test",
        });
        // Update
        const updated = yield repo.update(userId, created.mapKeyId, {
            mapKeyTitle: "Updated",
        });
        // Expect new name
        chai_1.expect(updated.mapKeyTitle).to.equal("Updated");
    }));
    it("Update a document that doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new RepositoryFactory_1.default().getMapKeysRepository();
        yield chai_1.expect(repo.update(userId, "123456789123456789123456", {
            mapKeyTitle: "New name",
        })).to.eventually.be.rejectedWith(RepositoryNotFoundError_1.default);
    }));
    it("Delete a document", () => __awaiter(void 0, void 0, void 0, function* () {
        // Create an image first
        const repo = new RepositoryFactory_1.default().getMapKeysRepository();
        const created = yield repo.create(userId, {
            mapKeyMap: mapId,
            mapKeyColor: "ff4747",
            mapKeyTitle: "test",
        });
        // Update
        const deleted = yield repo.delete(userId, created.mapKeyId);
        // Expect to be true
        chai_1.expect(deleted).to.be.true;
    }));
    // Delete an image document that doesn't exist
    it("Throws an error when deleting a document that doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new RepositoryFactory_1.default().getMapKeysRepository();
        yield chai_1.expect(repo.delete(userId, "123456789123456789123456")).to.eventually.be.rejectedWith(RepositoryNotFoundError_1.default);
    }));
    /**
     * Before running tets, connect to mongoose database
     * and create a temporary user
     */
    before(function (done) {
        mongoose_1.default.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
            Image_1.Image.deleteMany({}).then(() => {
                Map_1.Map.deleteMany({}).then(() => {
                    MapMarker_1.MapMarker.deleteMany({}).then(() => {
                        MapKey_1.MapKey.deleteMany({}).then(() => {
                            User_1.User.deleteMany({}).then(() => {
                                const user = new User_1.User({
                                    userFirstName: "Test",
                                    userLastName: "User",
                                    userEmail: "testuser@test.com",
                                    userPassword: "testpassword"
                                });
                                user.save().then((userData) => {
                                    userId = userData._id.toString();
                                    const image = new Image_1.Image({
                                        imageUser: userId,
                                        imageName: "Test image",
                                        imageBase64: "img",
                                        imageBase64Thumbnail: "img",
                                    });
                                    image.save().then((imageData) => {
                                        const map = new Map_1.Map({
                                            mapTitle: "test",
                                            mapImage: imageData._id.toString()
                                        });
                                        map.save().then((mapData) => {
                                            mapId = mapData._id.toString();
                                            done();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }).catch((err) => {
            console.log(err);
        });
    });
    /**
     * After running tests, disconnected from mongoose
     */
    after(function (done) {
        mongoose_1.default.disconnect().then(() => {
            if (userId) {
                fs_1.default.rmdirSync('uploads/' + userId, { recursive: true });
            }
            done();
        });
    });
});
