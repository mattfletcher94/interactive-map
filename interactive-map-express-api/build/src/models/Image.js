"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageSchema = exports.Image = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Mongoose schema definition
 */
const ImageSchemaFields = {
    imageUser: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    imageName: {
        type: String,
        trim: true,
    },
    imageBase64: {
        type: String,
        required: [true, "Image base64 string must be provided."],
    },
    imageBase64Thumbnail: {
        type: String,
    }
    /*imagePath: {
        type: String,
        trim: true,
        required: [true, "Image path is required."],
    }*/
};
/**
 * Create mongoose schema
 */
const ImageSchema = new mongoose_1.default.Schema(ImageSchemaFields, {
    timestamps: {
        createdAt: 'imageCreatedAt',
        updatedAt: 'imageUpdatedAt'
    },
});
exports.ImageSchema = ImageSchema;
/**
 * Define to client method
 */
ImageSchema.methods.toClient = function (cb) {
    return {
        imageId: this._id,
        imageUser: this.imageUser,
        imageName: this.imageName,
        imagePath: process.env.BASE_URL + '/static/images/' + this._id + '.png',
        imagePathThumbnail: process.env.BASE_URL + '/static/images/' + this._id + '-thumbnail.png',
    };
};
/**
 * Mongoose model
 */
const Image = mongoose_1.default.model("Image", ImageSchema);
exports.Image = Image;
