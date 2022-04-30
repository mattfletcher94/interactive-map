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
const RepositoryValidationError_1 = __importDefault(require("../../repositories/errors/RepositoryValidationError"));
const RepositoryNotFoundError_1 = __importDefault(require("../../repositories/errors/RepositoryNotFoundError"));
const RepositoryFactory_1 = __importDefault(require("../../repositories/RepositoryFactory"));
const User_1 = require("../../models/User");
const Image_1 = require("../../models/Image");
// Use chai as promised
chai_1.default.use(require('chai-as-promised'));
/**
 * Test the imageRespository
 */
describe('ImageRepository', () => {
    const base64Img = "PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6c3ZnanM9Imh0dHA6Ly9zdmdqcy5jb20vc3ZnanMiIHZlcnNpb249IjEuMSIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHg9IjAiIHk9IjAiIHZpZXdCb3g9IjAgMCA0MTMuMDk5IDQxMy4wOTkiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTIwNi41NDksMEwyMDYuNTQ5LDBjLTgyLjYsMC0xNDkuMyw2Ni43LTE0OS4zLDE0OS4zYzAsMjguOCw5LjIsNTYuMywyMiw3OC44OTlsOTcuMywxNjguMzk5YzYuMSwxMSwxOC40LDE2LjUsMzAsMTYuNSAgICBjMTEuNjAxLDAsMjMuMy01LjUsMzAtMTYuNWw5Ny4zLTE2OC4yOTljMTIuOS0yMi42MDEsMjItNDkuNjAxLDIyLTc4LjkwMUMzNTUuODQ5LDY2LjgsMjg5LjE0OSwwLDIwNi41NDksMHogTTIwNi41NDksMTkzLjQgICAgYy0zMCwwLTU0LjUtMjQuNS01NC41LTU0LjVzMjQuNS01NC41LDU0LjUtNTQuNXM1NC41LDI0LjUsNTQuNSw1NC41QzI2MS4wNDksMTY5LDIzNi41NDksMTkzLjQsMjA2LjU0OSwxOTMuNHoiIGZpbGw9IiM0YTllZDgiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiLz4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8L2c+PC9zdmc+Cg==";
    // Define the user Id
    let userId = "";
    it("Creates a valid document", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new RepositoryFactory_1.default().getImageRepository();
        const image = yield repo.create(userId, {
            imageName: "test name",
            imageBase64: base64Img,
        });
        chai_1.expect(image.imageName).to.equal("test name");
    }));
    it("Throws an error when creating an invalid document", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new RepositoryFactory_1.default().getImageRepository();
        yield chai_1.expect(repo.create(userId, {})).to.eventually.be.rejectedWith(RepositoryValidationError_1.default);
    }));
    it("Gets all documents", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new RepositoryFactory_1.default().getImageRepository();
        const documents = yield repo.getByUserId(userId);
        chai_1.expect(documents).to.be.an("array");
    }));
    it("Gets a document by its id", () => __awaiter(void 0, void 0, void 0, function* () {
        // Create an image first
        const repo = new RepositoryFactory_1.default().getImageRepository();
        const created = yield repo.create(userId, {
            imageName: "test name",
            imageBase64: base64Img,
        });
        // Get the image
        const document = yield repo.getOneByUserId(userId, created.imageId);
        chai_1.expect(document.imageId.toString()).to.equal(created.imageId.toString());
        chai_1.expect(document.imageName).to.equal(created.imageName);
    }));
    it("Throws an error when getting a document that doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new RepositoryFactory_1.default().getImageRepository();
        yield chai_1.expect(repo.getOneByUserId(userId, "123456789123456789123456")).to.eventually.be.rejectedWith(RepositoryNotFoundError_1.default);
    }));
    it("Update a document with valid data", () => __awaiter(void 0, void 0, void 0, function* () {
        // Create an image first
        const repo = new RepositoryFactory_1.default().getImageRepository();
        const created = yield repo.create(userId, {
            imageName: "test name",
            imageBase64: base64Img,
        });
        // Update
        const updated = yield repo.update(userId, created.imageId, {
            imageName: "Updated",
        });
        // Expect new name
        chai_1.expect(updated.imageName).to.equal("Updated");
    }));
    it("Update a document that doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new RepositoryFactory_1.default().getImageRepository();
        yield chai_1.expect(repo.update(userId, "123456789123456789123456", {
            imageName: "New name",
        })).to.eventually.be.rejectedWith(RepositoryNotFoundError_1.default);
    }));
    it("Delete a document", () => __awaiter(void 0, void 0, void 0, function* () {
        // Create an image first
        const repo = new RepositoryFactory_1.default().getImageRepository();
        const created = yield repo.create(userId, {
            imageName: "test name",
            imageBase64: base64Img,
        });
        // Update
        const deleted = yield repo.delete(userId, created.imageId);
        // Expect to be true
        chai_1.expect(deleted).to.be.true;
    }));
    it("Throws an error when deleting a document that doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new RepositoryFactory_1.default().getImageRepository();
        yield chai_1.expect(repo.delete(userId, "123456789123456789123456")).to.eventually.be.rejectedWith(RepositoryNotFoundError_1.default);
    }));
    /**
     * Before running tets, connect to mongoose database
     * and create a temporary user
     */
    before(function (done) {
        mongoose_1.default.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
            Image_1.Image.deleteMany({}).then(() => {
                User_1.User.deleteMany({}).then(() => {
                    const user = new User_1.User({
                        userFirstName: "Test",
                        userLastName: "User",
                        userEmail: "testuser@test.com",
                        userPassword: "testpassword"
                    });
                    user.save().then((data) => {
                        userId = data._id.toString();
                        done();
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
            fs_1.default.rmdirSync('uploads/' + userId, { recursive: true });
            done();
        });
    });
});
