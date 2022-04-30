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
const BaseRepository_1 = __importDefault(require("./BaseRepository"));
const RepositoryValidationError_1 = __importDefault(require("./errors/RepositoryValidationError"));
const RepositoryNotFoundError_1 = __importDefault(require("./errors/RepositoryNotFoundError"));
const Map_client_1 = __importDefault(require("../models/MapModels/Map.client"));
const Image_client_1 = __importDefault(require("../models/ImageModels/Image.client"));
class MapsRepositoryOld extends BaseRepository_1.default {
    /**
     * Create a new map
     */
    create(userId, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = new this.Model({
                    mapUser: userId,
                    mapImage: model.mapImage,
                    mapTitle: model.mapTitle,
                    mapDescription: model.mapDescription,
                });
                const savedDocument = yield document.save();
                yield savedDocument.populate('mapImage').execPopulate();
                return this.mongooseToClient(savedDocument);
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
     */
    update(userId, modelId, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find document
                const document = yield this.Model.findOne({ _id: modelId, mapUser: userId }).orFail();
                // Set new attributes
                document.mapTitle = model.mapTitle === undefined ? document.mapTitle : model.mapTitle;
                document.mapDescription = model.mapDescription === undefined ? document.mapDescription : model.mapDescription;
                document.mapImage = model.mapImage === undefined ? document.mapImage : model.mapImage;
                document.mapIsPublished = model.mapIsPublished === undefined ? document.mapIsPublished : model.mapIsPublished;
                // Validate  new fields
                yield document.validate();
                // Save now document
                const savedDocument = yield document.save();
                yield savedDocument.populate('mapImage').execPopulate();
                // Return new document
                return this.mongooseToClient(savedDocument);
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
     * Delete a map
     * @param id
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find image
                const document = yield this.Model.findOne({ _id: id, mapUser: this.userId }).orFail();
                // Delete image
                yield document.deleteOne();
                // Deleted
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
     * Get all maps
     */
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const documents = yield this.Model.find({ mapUser: this.userId }).populate("mapImage").sort({ '_id': -1 });
                return documents.map((document) => {
                    return this.mongooseToClient(document);
                });
            }
            catch (err) {
                throw err;
            }
        });
    }
    /**
     * Get one map by id
     */
    getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = yield this.Model.findOne({ _id: id, mapUser: this.userId }).populate("mapImage").orFail();
                return this.mongooseToClient(document);
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
     * Convert a mongoose document to a client model
     */
    mongooseToClient(document) {
        const imageDocument = document.mapImage;
        const imageClient = new Image_client_1.default({
            imageId: imageDocument._id.toString(),
            imageUser: imageDocument.imageUser,
            imageName: imageDocument.imageName,
            imagePath: process.env.BASE_URL + '/' + imageDocument.imagePath,
            imageCreatedAt: imageDocument.imageCreatedAt,
            imageUpdatedAt: imageDocument.imageUpdatedAt
        });
        //const mapKeyDocuments : MapKeySchema[] = document.mapKeys;
        /*const keys : MapKeyClient[] = mapKeyDocuments.map((mapKey) => {
            return new MapKeyClient({
                mapKeyId: mapKey._id,
                mapKeyTitle: mapKey.mapKeyTitle,
                mapKeyColor: mapKey.mapKeyColor,
                mapKeyInitialValue: mapKey.mapKeyInitialValue,
                mapKeyCreatedAt: mapKey.mapKeyCreatedAt,
                mapKeyUpdatedAt: mapKey.mapKeyUpdatedAt,
            });
        });*/
        return new Map_client_1.default({
            mapId: document._id.toString(),
            mapUser: document.mapUser,
            mapTitle: document.mapTitle,
            mapDescription: document.mapDescription,
            mapIsPublished: document.mapIsPublished,
            mapImage: imageClient,
            //mapKeys: keys,
            mapCreatedAt: document.mapCreatedAt,
            mapUpdatedAt: document.mapUpdatedAt,
        });
    }
}
exports.default = MapsRepositoryOld;
