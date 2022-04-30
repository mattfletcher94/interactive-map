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
const MapMarker_1 = require("../models/MapMarker");
class MapMarkersRepository {
    /**
     * Create a map marker
     * @param userId
     * @param model
     */
    create(userId, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = new MapMarker_1.MapMarker(Object.assign({ mapMarkerUser: userId }, model));
                const savedDocument = yield document.save();
                yield savedDocument.populate("mapMarkerImages").execPopulate();
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
    update(userId, mapMarkerId, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find document
                const document = yield MapMarker_1.MapMarker.findOne({ _id: mapMarkerId, mapMarkerUser: userId, }).orFail();
                // Set new attributes
                document.mapMarkerKey = model.mapMarkerKey === undefined ? document.mapMarkerKey : model.mapMarkerKey;
                document.mapMarkerOrder = model.mapMarkerOrder === undefined ? document.mapMarkerOrder : model.mapMarkerOrder;
                document.mapMarkerName = model.mapMarkerName === undefined ? document.mapMarkerName : model.mapMarkerName;
                document.mapMarkerPositionX = model.mapMarkerPositionX === undefined ? document.mapMarkerPositionX : model.mapMarkerPositionX;
                document.mapMarkerPositionY = model.mapMarkerPositionY === undefined ? document.mapMarkerPositionY : model.mapMarkerPositionY;
                document.mapMarkerLocked = model.mapMarkerLocked === undefined ? document.mapMarkerLocked : model.mapMarkerLocked;
                document.mapMarkerTitle = model.mapMarkerTitle === undefined ? document.mapMarkerTitle : model.mapMarkerTitle;
                document.mapMarkerTitleDisplayType = model.mapMarkerTitleDisplayType === undefined ? document.mapMarkerTitleDisplayType : model.mapMarkerTitleDisplayType;
                document.mapMarkerDescription = model.mapMarkerDescription === undefined ? document.mapMarkerDescription : model.mapMarkerDescription;
                document.mapMarkerPitchedUnitSelection = model.mapMarkerPitchedUnitSelection === undefined ? document.mapMarkerPitchedUnitSelection : model.mapMarkerPitchedUnitSelection;
                document.mapMarkerButtonEnabled = model.mapMarkerButtonEnabled === undefined ? document.mapMarkerButtonEnabled : model.mapMarkerButtonEnabled;
                document.mapMarkerButtonLabel = model.mapMarkerButtonLabel === undefined ? document.mapMarkerButtonLabel : model.mapMarkerButtonLabel;
                document.mapMarkerButtonURL = model.mapMarkerButtonURL === undefined ? document.mapMarkerButtonURL : model.mapMarkerButtonURL;
                document.mapMarkerImagesEnabled = model.mapMarkerImagesEnabled === undefined ? document.mapMarkerImagesEnabled : model.mapMarkerImagesEnabled;
                document.mapMarkerImages = model.mapMarkerImages === undefined ? document.mapMarkerImages : model.mapMarkerImages;
                // Validate  new fields
                yield document.validate();
                // Save now document
                const savedDocument = yield document.save();
                yield savedDocument.populate("mapMarkerImages").execPopulate();
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
     * Delete a map marker
     * @param id
     */
    delete(userId, mapMarkerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = yield MapMarker_1.MapMarker.findOne({ _id: mapMarkerId, mapMarkerUser: userId }).orFail();
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
    /**
     * Get all markers by map id
     * @param mapId
     */
    getByMapId(mapId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const documents = yield MapMarker_1.MapMarker.find({ mapMarkerMap: mapId }).populate("mapMarkerImages").sort({ '_id': -1 });
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
     * Get all map markers by map id and user id
     */
    getByUserIdAndMapId(userId, mapId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const documents = yield MapMarker_1.MapMarker.find({ mapMarkerMap: mapId, mapMarkerUser: userId }).populate("mapMarkerImages").sort({ '_id': -1 });
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
     * Get all map markers by map id and user id
     */
    getOneByUserIdAndMapId(userId, mapId, mapMarkerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = yield MapMarker_1.MapMarker.findOne({ _id: mapMarkerId, mapMarkerMap: mapId, mapMarkerUser: userId }).populate("mapMarkerImages").orFail();
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
     * Get all map markers by map id and user id
     */
    getOneByMapId(mapId, mapMarkerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = yield MapMarker_1.MapMarker.findOne({ _id: mapMarkerId, mapMarkerMap: mapId }).populate("mapMarkerImages").orFail();
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
exports.default = MapMarkersRepository;
