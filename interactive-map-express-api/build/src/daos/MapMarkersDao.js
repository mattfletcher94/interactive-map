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
const MapMarker_mongoose_1 = __importDefault(require("../models/MapMarkerModels/MapMarker.mongoose"));
const MapMarker_client_1 = __importDefault(require("../models/MapMarkerModels/MapMarker.client"));
/**
 * Map Marker DAO class
 */
class MapMarkerDAO {
    getAll(mapId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new DAOGetAllResponse_1.default();
            try {
                const items = yield MapMarker_mongoose_1.default.find({ mapMarkerMap: mapId }).sort({ '_id': -1 });
                response.FOUND = true;
                response.DATA = items.map((i) => {
                    return new MapMarker_client_1.default({
                        mapMarkerId: i._id,
                        mapMarkerUser: i.mapMarkerUser,
                        mapMarkerMap: i.mapMarkerMap,
                        mapMarkerName: i.mapMarkerName,
                        mapMarkerPositionX: i.mapMarkerPositionX,
                        mapMarkerPositionY: i.mapMarkerPositionY,
                        mapMarkerCreatedAt: i.mapMarkerCreatedAt,
                        mapMarkerUpdatedAt: i.mapMarkerUpdatedAt
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
    getOne(mapId, mapMarkerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new DAOGetOneResponse_1.default();
            try {
                const item = yield MapMarker_mongoose_1.default.findOne({ _id: mapMarkerId, mapMarkerMap: mapId });
                if (item) {
                    response.FOUND = true;
                    response.DATA = new MapMarker_client_1.default({
                        mapMarkerId: item._id,
                        mapMarkerUser: item.mapMarkerUser,
                        mapMarkerMap: item.mapMarkerMap,
                        mapMarkerName: item.mapMarkerName,
                        mapMarkerPositionX: item.mapMarkerPositionX,
                        mapMarkerPositionY: item.mapMarkerPositionY,
                        mapMarkerCreatedAt: item.mapMarkerCreatedAt,
                        mapMarkerUpdatedAt: item.mapMarkerUpdatedAt
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
    create(userId, mapId, model) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new DAOCreateResponse_1.default();
            try {
                const mapMarker = new MapMarker_mongoose_1.default({
                    mapMarkerUser: mongoose_1.default.Types.ObjectId(userId),
                    mapMarkerMap: mongoose_1.default.Types.ObjectId(mapId),
                    mapMarkerName: model.mapMarkerName === undefined ? "" : model.mapMarkerName,
                    mapMarkerPositionX: model.mapMarkerPositionX,
                    mapMarkerPositionY: model.mapMarkerPositionY,
                });
                const item = yield mapMarker.save();
                response.CREATED = true;
                response.DATA = new MapMarker_client_1.default({
                    mapMarkerId: item._id,
                    mapMarkerUser: item.mapMarkerUser,
                    mapMarkerMap: item.mapMarkerMap,
                    mapMarkerName: item.mapMarkerName,
                    mapMarkerPositionX: item.mapMarkerPositionX,
                    mapMarkerPositionY: item.mapMarkerPositionY,
                    mapMarkerCreatedAt: item.mapMarkerCreatedAt,
                    mapMarkerUpdatedAt: item.mapMarkerUpdatedAt
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
    update(mapId, mapMarkerId, model) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new DAOUpdateResponse_1.default();
            try {
                const item = yield MapMarker_mongoose_1.default.findOne({ _id: mapMarkerId, mapMarkerMap: mapId });
                if (item) {
                    // Set new attributes
                    item.mapMarkerName = model.mapMarkerName === undefined ? item.mapMarkerName : model.mapMarkerName;
                    item.mapMarkerPositionX = model.mapMarkerPositionX === undefined ? item.mapMarkerPositionX : model.mapMarkerPositionX;
                    item.mapMarkerPositionY = model.mapMarkerPositionY === undefined ? item.mapMarkerPositionY : model.mapMarkerPositionY;
                    // Attempt to validate
                    yield item.validate();
                    // Now attempt to save
                    yield item.save();
                    // Return new map
                    response.UPDATED = true;
                    response.DATA = new MapMarker_client_1.default({
                        mapMarkerId: item._id,
                        mapMarkerUser: item.mapMarkerUser,
                        mapMarkerMap: item.mapMarkerMap,
                        mapMarkerName: item.mapMarkerName,
                        mapMarkerPositionX: item.mapMarkerPositionX,
                        mapMarkerPositionY: item.mapMarkerPositionY,
                        mapMarkerCreatedAt: item.mapMarkerCreatedAt,
                        mapMarkerUpdatedAt: item.mapMarkerUpdatedAt
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
    delete(mapId, mapMarkerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new DAODeleteResponse_1.default();
            try {
                const result = yield MapMarker_mongoose_1.default.deleteOne({
                    _id: mapMarkerId,
                    mapMarkerMap: mapId,
                });
                if (result.deletedCount && result.deletedCount > 0) {
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
exports.default = MapMarkerDAO;
