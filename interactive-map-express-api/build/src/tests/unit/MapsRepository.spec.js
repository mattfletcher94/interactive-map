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
const chai_1 = __importStar(require("chai"));
const mongoose_1 = __importDefault(require("mongoose"));
const RepositoryFactory_1 = __importDefault(require("../../repositories/RepositoryFactory"));
const RepositoryValidationError_1 = __importDefault(require("../../repositories/errors/RepositoryValidationError"));
const RepositoryNotFoundError_1 = __importDefault(require("../../repositories/errors/RepositoryNotFoundError"));
const Image_1 = require("../../models/Image");
const Map_1 = require("../../models/Map");
const User_1 = require("../../models/User");
// Use chai as promised
chai_1.default.use(require('chai-as-promised'));
/**
 * Test the MapsRepository
 */
describe('MapsRepository', () => {
    // Define globals
    let userId = "";
    let imageId = "";
    it("Creates a valid document", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const repo = new RepositoryFactory_1.default().getMapsRepository();
        const document = yield repo.create(userId, {
            mapImage: imageId,
            mapTitle: "Test title",
            mapDescription: "Test description",
        });
        chai_1.expect((_a = document.mapImage) === null || _a === void 0 ? void 0 : _a.imageId.toString()).to.equal(imageId.toString());
        chai_1.expect(document.mapTitle).to.equal("Test title");
        chai_1.expect(document.mapDescription).to.equal("Test description");
    }));
    it("Throws an error when creating an invalid document", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new RepositoryFactory_1.default().getMapsRepository();
        yield chai_1.expect(repo.create(userId, {
            mapImage: imageId,
            mapTitle: "",
        })).to.eventually.be.rejectedWith(RepositoryValidationError_1.default);
    }));
    it("Gets all", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new RepositoryFactory_1.default().getMapsRepository();
        const documents = yield repo.getByUserId(userId);
        chai_1.expect(documents).to.be.an("array");
    }));
    it("Gets one by its id", () => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        // Create an item first
        const repo = new RepositoryFactory_1.default().getMapsRepository();
        const created = yield repo.create(userId, {
            mapImage: imageId,
            mapTitle: "Test title",
            mapDescription: "Test description"
        });
        // Get the item
        const document = yield repo.getOneByUserId(userId, created.mapId);
        chai_1.expect((_b = document.mapImage) === null || _b === void 0 ? void 0 : _b.imageId.toString()).to.equal(imageId.toString());
        chai_1.expect(document.mapTitle).to.equal(created.mapTitle);
        chai_1.expect(document.mapDescription).to.equal(created.mapDescription);
    }));
    it("Throws an error when getting a document that doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new RepositoryFactory_1.default().getMapsRepository();
        yield chai_1.expect(repo.getOne("123456789123456789123456")).to.eventually.be.rejectedWith(RepositoryNotFoundError_1.default);
    }));
    it("Update a document with valid data", () => __awaiter(void 0, void 0, void 0, function* () {
        // Create an image first
        const repo = new RepositoryFactory_1.default().getMapsRepository();
        const created = yield repo.create(userId, {
            mapImage: imageId,
            mapTitle: "Test title",
            mapDescription: "Test description"
        });
        // Update
        const updated = yield repo.update(userId, created.mapId, {
            mapTitle: "Updated",
        });
        // Expect new name
        chai_1.expect(updated.mapTitle).to.equal("Updated");
    }));
    it("Update a document that doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new RepositoryFactory_1.default().getMapsRepository();
        yield chai_1.expect(repo.update(userId, "123456789123456789123456", {
            mapTitle: "New name",
        })).to.eventually.be.rejectedWith(RepositoryNotFoundError_1.default);
    }));
    it("Delete a document", () => __awaiter(void 0, void 0, void 0, function* () {
        // Create an image first
        const repo = new RepositoryFactory_1.default().getMapsRepository();
        const created = yield repo.create(userId, {
            mapImage: imageId,
            mapTitle: "test name",
            mapDescription: "test description",
        });
        // Update
        const deleted = yield repo.delete(userId, created.mapId);
        // Expect to be true
        chai_1.expect(deleted).to.be.true;
    }));
    // Delete an image document that doesn't exist
    it("Throws an error when deleting a document that doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new RepositoryFactory_1.default().getMapsRepository();
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
                    User_1.User.deleteMany({}).then(() => {
                        const user = new User_1.User({
                            userFirstName: "Test",
                            userLastName: "User",
                            userEmail: "testuser@test.com",
                            userPassword: "testpassword"
                        });
                        user.save().then((data) => {
                            userId = data._id.toString();
                            const image = new Image_1.Image({
                                imageUser: userId,
                                imageName: "Test image",
                                imageBase64: "img",
                                imageBase64Thumbnail: "img",
                            });
                            image.save().then((data) => {
                                imageId = data._id.toString();
                                done();
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
            done();
        });
    });
});
