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
const DAOGetAllResponse_1 = __importDefault(require("../daoResponses/DAOGetAllResponse"));
const DAOGetOneResponse_1 = __importDefault(require("../daoResponses/DAOGetOneResponse"));
const DAOCreateResponse_1 = __importDefault(require("../daoResponses/DAOCreateResponse"));
const DAOUpdateResponse_1 = __importDefault(require("../daoResponses/DAOUpdateResponse"));
const DAODeleteResponse_1 = __importDefault(require("../daoResponses/DAODeleteResponse"));
const Map_client_1 = __importDefault(require("../models/MapModels/Map.client"));
const Map_mongoose_1 = __importDefault(require("../models/MapModels/Map.mongoose"));
const Image_client_1 = __importDefault(require("../models/ImageModels/Image.client"));
const MapMarker_mongoose_1 = __importDefault(require("../models/MapMarkerModels/MapMarker.mongoose"));
/**
 * Maps DAO class
 */
class MapsDAO {
    getAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new DAOGetAllResponse_1.default();
            try {
                const maps = yield Map_mongoose_1.default.find({ mapUser: userId }).populate("mapImage").sort({ '_id': -1 });
                response.FOUND = true;
                response.DATA = maps.map((m) => {
                    const mapImage = m.mapImage;
                    return new Map_client_1.default({
                        mapId: m._id,
                        mapUser: m.mapUser,
                        mapTitle: m.mapTitle,
                        mapDescription: m.mapDescription,
                        mapIsPublished: m.mapIsPublished,
                        mapCreatedAt: m.mapCreatedAt,
                        mapUpdatedAt: m.mapUpdatedAt,
                        mapImage: new Image_client_1.default({
                            imageId: mapImage._id,
                            imageUser: mapImage.imageUser,
                            imageName: mapImage.imageName,
                            imagePath: process.env.BASE_URL + '/' + mapImage.imagePath,
                            imageCreatedAt: mapImage.imageCreatedAt,
                            imageUpdatedAt: mapImage.imageUpdatedAt
                        }),
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
    getOne(userId, mapId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new DAOGetOneResponse_1.default();
            try {
                const m = yield Map_mongoose_1.default.findOne({ _id: mapId, mapUser: userId }).populate("mapImage");
                if (m) {
                    const mapImage = m.mapImage;
                    response.FOUND = true;
                    response.DATA = new Map_client_1.default({
                        mapId: m._id,
                        mapUser: m.mapUser,
                        mapTitle: m.mapTitle,
                        mapDescription: m.mapDescription,
                        mapIsPublished: m.mapIsPublished,
                        mapCreatedAt: m.mapCreatedAt,
                        mapUpdatedAt: m.mapUpdatedAt,
                        mapImage: new Image_client_1.default({
                            imageId: mapImage._id,
                            imageUser: mapImage.imageUser,
                            imageName: mapImage.imageName,
                            imagePath: process.env.BASE_URL + '/' + mapImage.imagePath,
                            imageCreatedAt: mapImage.imageCreatedAt,
                            imageUpdatedAt: mapImage.imageUpdatedAt
                        }),
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
    create(userId, model) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new DAOCreateResponse_1.default();
            try {
                const map = new Map_mongoose_1.default({
                    mapUser: mongoose_1.default.Types.ObjectId(userId),
                    mapImage: mongoose_1.default.Types.ObjectId(model.mapImage),
                    mapTitle: model.mapTitle,
                    mapDescription: model.mapDescription
                });
                const m = yield map.save();
                yield m.populate('mapImage').execPopulate();
                const mapImage = m.mapImage;
                response.CREATED = true;
                response.DATA = new Map_client_1.default({
                    mapId: m._id,
                    mapUser: m.mapUser,
                    mapTitle: m.mapTitle,
                    mapDescription: m.mapDescription,
                    mapIsPublished: m.mapIsPublished,
                    mapCreatedAt: m.mapCreatedAt,
                    mapUpdatedAt: m.mapUpdatedAt,
                    mapImage: new Image_client_1.default({
                        imageId: mapImage._id,
                        imageUser: mapImage.imageUser,
                        imageName: mapImage.imageName,
                        imagePath: process.env.BASE_URL + '/' + mapImage.imagePath,
                        imageCreatedAt: mapImage.imageCreatedAt,
                        imageUpdatedAt: mapImage.imageUpdatedAt
                    }),
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
    update(userId, mapId, model) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new DAOUpdateResponse_1.default();
            try {
                const map = yield Map_mongoose_1.default.findOne({ _id: mapId, mapUser: userId, });
                if (map) {
                    // Set new attributes
                    map.mapTitle = model.mapTitle ? model.mapTitle : map.mapTitle;
                    map.mapDescription = model.mapDescription === undefined ? map.mapDescription : model.mapDescription;
                    map.mapImage = model.mapImage ? model.mapImage : map.mapImage;
                    map.mapIsPublished = model.mapIsPublished ? model.mapIsPublished : map.mapIsPublished;
                    // Attempt to validate
                    yield map.validate();
                    // Now attempt to save
                    yield map.save();
                    // Save is okay so populate map image for returning
                    yield map.populate('mapImage').execPopulate();
                    const mapImage = map.mapImage;
                    // Return new map
                    response.UPDATED = true;
                    response.DATA = new Map_client_1.default({
                        mapId: map._id,
                        mapUser: map.mapUser,
                        mapTitle: map.mapTitle,
                        mapDescription: map.mapDescription,
                        mapIsPublished: map.mapIsPublished,
                        mapCreatedAt: map.mapCreatedAt,
                        mapUpdatedAt: map.mapUpdatedAt,
                        mapImage: new Image_client_1.default({
                            imageId: mapImage._id,
                            imageUser: mapImage.imageUser,
                            imageName: mapImage.imageName,
                            imagePath: process.env.BASE_URL + '/' + mapImage.imagePath,
                            imageCreatedAt: mapImage.imageCreatedAt,
                            imageUpdatedAt: mapImage.imageUpdatedAt
                        }),
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
    delete(userId, mapId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new DAODeleteResponse_1.default();
            try {
                const result = yield Map_mongoose_1.default.deleteOne({
                    _id: mapId,
                    mapUser: userId,
                });
                if (result.deletedCount && result.deletedCount > 0) {
                    yield MapMarker_mongoose_1.default.deleteMany({
                        _id: mapId,
                    });
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
exports.default = MapsDAO;
