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
require("../env");
const RepositoryValidationError_1 = __importDefault(require("./errors/RepositoryValidationError"));
const RepositoryNotFoundError_1 = __importDefault(require("./errors/RepositoryNotFoundError"));
const MapKey_1 = require("../models/MapKey");
const MapMarker_1 = require("../models/MapMarker");
class MapKeysRepository {
    /**
     * Create a new map key
     */
    create(userId, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = new MapKey_1.MapKey({
                    mapKeyUser: userId,
                    mapKeyMap: model.mapKeyMap,
                    mapKeyTitle: model.mapKeyTitle,
                    mapKeyInitialValue: model.mapKeyInitialValue,
                    mapKeyColor: model.mapKeyColor,
                });
                const savedDocument = yield document.save();
                return savedDocument.toClient();
            }
            catch (err) {
                if (err && err.name === 'ValidationError') {
                    throw new RepositoryValidationError_1.default("The item could not be created.", Object.keys(err.errors).map((k) => {
                        return { field: err.errors[k].properties.path, message: err.errors[k].properties.message };
                    }));
                }
                else {
                    throw err;
                }
            }
        });
    }
    /**
     * Update a map marker
     */
    update(userId, mapKeyId, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find document
                const document = yield MapKey_1.MapKey.findOne({ _id: mapKeyId, mapKeyUser: userId, }).orFail();
                // Set new attributes
                document.mapKeyTitle = model.mapKeyTitle === undefined ? document.mapKeyTitle : model.mapKeyTitle;
                document.mapKeyColor = model.mapKeyColor === undefined ? document.mapKeyColor : model.mapKeyColor;
                document.mapKeyInitialValue = model.mapKeyInitialValue === undefined ? document.mapKeyInitialValue : model.mapKeyInitialValue;
                // Validate  new fields
                yield document.validate();
                // Save now document
                const savedDocument = yield document.save();
                // Return new document
                return savedDocument.toClient();
            }
            catch (err) {
                if (err && err.name === 'ValidationError') {
                    throw new RepositoryValidationError_1.default("The item could not be updated.", Object.keys(err.errors).map((k) => {
                        return { field: err.errors[k].properties.path, message: err.errors[k].properties.message };
                    }));
                }
                else if (err.name == "DocumentNotFoundError") {
                    throw new RepositoryNotFoundError_1.default("The item could not be found.");
                }
                else {
                    throw err;
                }
            }
        });
    }
    /**
     * Delete a map key
     * @param id
     */
    delete(userId, mapKeyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = yield MapKey_1.MapKey.findOne({ _id: mapKeyId, mapKeyUser: userId }).orFail();
                yield document.deleteOne();
                // Update all map markers that use this key to reference no key
                yield MapMarker_1.MapMarker.updateMany({
                    mapMarkerKey: mapKeyId,
                    mapMarkerUser: userId,
                }, {
                    "$set": {
                        "mapMarkerKey": ""
                    }
                });
                return true;
            }
            catch (err) {
                if (err.name == "DocumentNotFoundError") {
                    throw new RepositoryNotFoundError_1.default("The item could not be found.");
                }
                else {
                    throw err;
                }
            }
        });
    }
    /**
     * Get all map keys by map id
     */
    getByMapId(mapId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const documents = yield MapKey_1.MapKey.find({ mapKeyMap: mapId }).sort({ '_id': -1 });
                return documents.map((document) => {
                    return document.toClient();
                });
            }
            catch (err) {
                throw err;
            }
        });
    }
    /**
     * Get all map keys by map id and user id
     */
    getByUserIdAndMapId(userId, mapId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const documents = yield MapKey_1.MapKey.find({ mapKeyMap: mapId, mapKeyUser: userId }).sort({ '_id': -1 });
                return documents.map((document) => {
                    return document.toClient();
                });
            }
            catch (err) {
                throw err;
            }
        });
    }
    /**
     * Get map key by id
     */
    getOneByMapId(mapId, mapKeyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = yield MapKey_1.MapKey.findOne({ _id: mapKeyId, mapKeyMap: mapId }).orFail();
                return document.toClient();
            }
            catch (err) {
                if (err.name == "DocumentNotFoundError") {
                    throw new RepositoryNotFoundError_1.default("The item could not be found.");
                }
                else {
                    throw err;
                }
            }
        });
    }
    /**
     * Get map key by id
     */
    getOneByUserIdAndMapId(userId, mapId, mapKeyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = yield MapKey_1.MapKey.findOne({ _id: mapKeyId, mapKeyMap: mapId, mapKeyUser: userId }).orFail();
                return document.toClient();
            }
            catch (err) {
                if (err.name == "DocumentNotFoundError") {
                    throw new RepositoryNotFoundError_1.default("The item could not be found.");
                }
                else {
                    throw err;
                }
            }
        });
    }
}
exports.default = MapKeysRepository;
