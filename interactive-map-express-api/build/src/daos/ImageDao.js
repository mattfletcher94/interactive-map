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
const mongoose_1 = __importDefault(require("mongoose"));
const util_1 = require("util");
const fs_1 = __importDefault(require("fs"));
const DAOGetAllResponse_1 = __importDefault(require("../daoResponses/DAOGetAllResponse"));
const DAOGetOneResponse_1 = __importDefault(require("../daoResponses/DAOGetOneResponse"));
const DAOCreateResponse_1 = __importDefault(require("../daoResponses/DAOCreateResponse"));
const DAOUpdateResponse_1 = __importDefault(require("../daoResponses/DAOUpdateResponse"));
const DAODeleteResponse_1 = __importDefault(require("../daoResponses/DAODeleteResponse"));
const Image_mongoose_1 = __importDefault(require("../models/ImageModels/Image.mongoose"));
const Image_client_1 = __importDefault(require("../models/ImageModels/Image.client"));
/**
 * Images DAO class
 */
class ImageDAO {
    getAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new DAOGetAllResponse_1.default();
            try {
                const items = yield Image_mongoose_1.default.find({ imageUser: userId }).sort({ '_id': -1 });
                response.FOUND = true;
                response.DATA = items.map((i) => {
                    return new Image_client_1.default({
                        imageId: i._id,
                        imageUser: i.imageUser,
                        imageName: i.imageName,
                        imagePath: process.env.BASE_URL + '/' + i.imagePath,
                        imageCreatedAt: i.imageCreatedAt,
                        imageUpdatedAt: i.imageUpdatedAt
                    });
                });
                return response;
            }
            catch (err) {
                response.UNKNOWN_ERROR = true;
                response.UNKNOWN_ERROR_REASON = err.message;
                return response;
            }
        });
    }
    getOne(userId, imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new DAOGetOneResponse_1.default();
            try {
                const item = yield Image_mongoose_1.default.findOne({ _id: imageId, imageUser: userId });
                if (item) {
                    response.FOUND = true;
                    response.DATA = new Image_client_1.default({
                        imageId: item._id,
                        imageUser: item.imageUser,
                        imageName: item.imageName,
                        imagePath: process.env.BASE_URL + '/' + item.imagePath,
                        imageCreatedAt: item.imageCreatedAt,
                        imageUpdatedAt: item.imageUpdatedAt
                    });
                }
                else {
                    response.NOT_FOUND = true;
                }
                return response;
            }
            catch (err) {
                response.UNKNOWN_ERROR = true;
                response.UNKNOWN_ERROR_REASON = err.message;
                return response;
            }
        });
    }
    create(userId, model, imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new DAOCreateResponse_1.default();
            try {
                const image = new Image_mongoose_1.default({
                    imageUser: mongoose_1.default.Types.ObjectId(userId),
                    imageName: model.imageName,
                    imagePath: model.imagePath
                });
                if (imageId) {
                    image._id = mongoose_1.default.Types.ObjectId(imageId);
                }
                const savedImage = yield image.save();
                response.CREATED = true;
                response.DATA = new Image_client_1.default({
                    imageId: savedImage._id,
                    imageUser: savedImage.imageUser,
                    imageName: savedImage.imageName,
                    imagePath: process.env.BASE_URL + '/' + savedImage.imagePath,
                    imageCreatedAt: savedImage.imageCreatedAt,
                    imageUpdatedAt: savedImage.imageUpdatedAt
                });
                return response;
            }
            catch (err) {
                if (err && err.name === 'ValidationError') {
                    response.VALIDATION_ERROR = true;
                    response.VALIDATION_ERRORS = Object.keys(err.errors).map((k) => {
                        return { field: err.errors[k].properties.path, message: err.errors[k].properties.message };
                    });
                    return response;
                }
                response.UNKNOWN_ERROR = true;
                response.UNKNOWN_ERROR_REASON = err.message;
                return response;
            }
        });
    }
    update(userId, imageId, model) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new DAOUpdateResponse_1.default();
            try {
                const item = yield Image_mongoose_1.default.findOne({ _id: imageId, imageUser: userId, });
                if (item) {
                    // Set new attributes
                    item.imageName = model.imageName ? model.imageName : item.imageName;
                    // Attempt to validate
                    yield item.validate();
                    // Now attempt to save
                    yield item.save();
                    // Return new map
                    response.UPDATED = true;
                    response.DATA = new Image_client_1.default({
                        imageId: item._id,
                        imageUser: item.imageUser,
                        imageName: item.imageName,
                        imagePath: process.env.BASE_URL + '/' + item.imagePath,
                        imageCreatedAt: item.imageCreatedAt,
                        imageUpdatedAt: item.imageUpdatedAt
                    });
                    return response;
                }
                else {
                    response.NOT_FOUND = true;
                    return response;
                }
            }
            catch (err) {
                if (err && err.name === 'ValidationError') {
                    response.VALIDATION_ERROR = true;
                    response.VALIDATION_ERRORS = Object.keys(err.errors).map((k) => {
                        return { field: err.errors[k].properties.path, message: err.errors[k].properties.message };
                    });
                    return response;
                }
                else {
                    response.UNKNOWN_ERROR = true;
                    response.UNKNOWN_ERROR_REASON = err.message;
                    return response;
                }
            }
        });
    }
    delete(userId, imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new DAODeleteResponse_1.default();
            try {
                // Find image
                const image = yield Image_mongoose_1.default.findOne({ _id: imageId, imageUser: userId });
                // If image was found successfully
                if (image) {
                    // Unlink image
                    const unlinkAsync = util_1.promisify(fs_1.default.unlink);
                    yield unlinkAsync(image.imagePath);
                    // Delete image
                    image.deleteOne();
                    // Return response
                    response.DELETED = true;
                    return response;
                }
                else {
                    response.NOT_FOUND = true;
                    return response;
                }
            }
            catch (err) {
                response.UNKNOWN_ERROR = true;
                response.UNKNOWN_ERROR_REASON = err.message;
                return response;
            }
        });
    }
}
exports.default = ImageDAO;
