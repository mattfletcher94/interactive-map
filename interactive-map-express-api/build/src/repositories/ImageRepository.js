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
const sharp_1 = __importDefault(require("sharp"));
const RepositoryNotFoundError_1 = __importDefault(require("./errors/RepositoryNotFoundError"));
const RepositoryValidationError_1 = __importDefault(require("./errors/RepositoryValidationError"));
const Image_1 = require("../models/Image");
const Map_1 = require("../models/Map");
const RepositoryCanNotDeleteError_1 = __importDefault(require("./errors/RepositoryCanNotDeleteError"));
const MapMarker_1 = require("../models/MapMarker");
class ImageRepository {
    /**
     * Create a new image
     */
    create(userId, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var resizedImageAsBase64 = "";
                if (model.imageBase64) {
                    try {
                        let resizedImage = Buffer.from(model.imageBase64, "base64");
                        resizedImage = yield sharp_1.default(resizedImage).resize(300, 300).toBuffer();
                        resizedImageAsBase64 = resizedImage.toString("base64");
                    }
                    catch (e) {
                        // Ignore quietly
                    }
                }
                // Create document
                const document = new Image_1.Image({
                    imageUser: userId,
                    imageName: model.imageName,
                    imageBase64: model.imageBase64,
                    imageBase64Thumbnail: resizedImageAsBase64,
                });
                // Save doc
                const savedDocument = yield document.save();
                // Return
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
     * Update an image
     */
    update(userId, imageId, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find document
                const document = yield Image_1.Image.findOne({ _id: imageId, imageUser: userId }).orFail();
                // Set new attributes
                document.imageName = model.imageName ? model.imageName : document.imageName;
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
     * Delete an image
     * @param id
     */
    delete(userId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if image is used by a map,
                // and if so then don't remove
                const map = yield Map_1.Map.findOne({ mapImage: id });
                if (map) {
                    throw new RepositoryCanNotDeleteError_1.default("Cannot delete image because it is being used by the Map '" + map.mapTitle + "'");
                }
                // Find image document
                const document = yield Image_1.Image.findOne({ _id: id, imageUser: userId }).orFail();
                // Remove files
                //fs.unlink(<string>document.imagePath, (err) => { });
                //fs.unlink(<string>document.imagePath.substring(0, document.imagePath.length-4) + '-thumbnail.png', (err) => { });
                yield document.deleteOne();
                // Remove from map marker galleries
                yield MapMarker_1.MapMarker.updateMany({ mapMarkerUser: userId }, { $pull: { mapMarkerImages: id } }, { multi: true });
                // Deleted
                return true;
            }
            catch (err) {
                if (err.name == "DocumentNotFoundError") {
                    throw new RepositoryNotFoundError_1.default("The item could not be found.");
                }
                else if (err && err.name === 'ValidationError') {
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
     * Get all images
     */
    getByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const documents = yield Image_1.Image.find({ imageUser: userId }).sort({ '_id': -1 });
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
     * Get one image by id
     */
    getOneByUserId(userId, imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = yield Image_1.Image.findOne({ _id: imageId, imageUser: userId }).orFail();
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
exports.default = ImageRepository;
