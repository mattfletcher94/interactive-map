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
const RepositoryNotFoundError_1 = __importDefault(require("./errors/RepositoryNotFoundError"));
const RepositoryValidationError_1 = __importDefault(require("./errors/RepositoryValidationError"));
const Map_1 = require("../models/Map");
class MapsRepository {
    /**
     * Create a new map
     * @param userId
     * @param model
     */
    create(userId, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = new Map_1.Map({
                    mapUser: userId,
                    mapImage: model.mapImage,
                    mapTitle: model.mapTitle,
                    mapDescription: model.mapDescription,
                    mapPitchedBookingEnabled: model.mapPitchedBookingEnabled,
                    mapPitchedBookingURL: model.mapPitchedBookingURL,
                });
                const savedDocument = yield document.save();
                yield savedDocument.populate('mapImage').execPopulate();
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
     * Update a map
     * @param userId
     * @param modelId
     * @param model
     */
    update(userId, mapId, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find document
                const document = yield Map_1.Map.findOne({ _id: mapId, mapUser: userId }).orFail();
                // Set new attributes
                document.mapTitle = model.mapTitle === undefined ? document.mapTitle : model.mapTitle;
                document.mapDescription = model.mapDescription === undefined ? document.mapDescription : model.mapDescription;
                document.mapImage = model.mapImage === undefined ? document.mapImage : model.mapImage;
                document.mapPitchedBookingEnabled = model.mapPitchedBookingEnabled === undefined ? document.mapPitchedBookingEnabled : model.mapPitchedBookingEnabled;
                document.mapPitchedBookingURL = model.mapPitchedBookingURL === undefined ? document.mapPitchedBookingURL : model.mapPitchedBookingURL;
                // Validate  new fields
                yield document.validate();
                // Save now document
                const savedDocument = yield document.save();
                yield savedDocument.populate('mapImage').execPopulate();
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
     * Get all maps for a specific user
     * @param userId
     */
    getByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const documents = yield Map_1.Map.find({ mapUser: userId }).populate("mapImage").sort({ '_id': -1 });
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
     * Get one map by id
     * @param mapId
     */
    getOne(mapId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = yield Map_1.Map.findOne({ _id: mapId }).populate("mapImage").orFail();
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
     * Get one map for a specific user
     * @param userId
     * @param mapId
     */
    getOneByUserId(userId, mapId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = yield Map_1.Map.findOne({ _id: mapId, mapUser: userId }).populate("mapImage").orFail();
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
     * Delete a map
     * @param userId
     * @param mapId
     */
    delete(userId, mapId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = yield Map_1.Map.findOne({ _id: mapId, mapUser: userId }).orFail();
                yield document.deleteOne();
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
}
exports.default = MapsRepository;
