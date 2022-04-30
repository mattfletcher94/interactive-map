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
exports.MapSchema = exports.Map = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Image_1 = require("./Image");
/**
 * Mongoose schema definition
 */
const MapSchemaFields = {
    mapUser: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    mapImage: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Image',
        validate: {
            validator: function (imageId) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!mongoose_1.default.isValidObjectId(imageId)) {
                        return Promise.resolve(false);
                    }
                    const image = yield Image_1.Image.findOne({ _id: imageId });
                    return Promise.resolve(image == null ? false : true);
                });
            },
            message: (props) => `The image does not exist.`
        },
    },
    mapTitle: {
        type: String,
        trim: true,
        required: [true, "Map title is required."],
        minlength: [4, "Map title should be at least {MINLENGTH} chracters long."],
        maxlength: [255, "Map title should be a maximum of {MAXLENGTH} chracters long."]
    },
    mapDescription: {
        type: String,
        trim: true,
        required: false,
        maxlength: 255,
    },
    mapPitchedBookingEnabled: {
        type: Boolean,
        required: false,
        default: false,
    },
    mapPitchedBookingURL: {
        type: String,
        trim: true,
        required: false,
        maxlength: 255,
    }
};
/**
 * Create mongoose schema
 */
const MapSchema = new mongoose_1.default.Schema(MapSchemaFields, {
    timestamps: {
        createdAt: 'mapCreatedAt',
        updatedAt: 'mapUpdatedAt'
    },
});
exports.MapSchema = MapSchema;
/**
 * Define to client method
 */
MapSchema.methods.toClient = function (cb) {
    return {
        mapId: this._id,
        mapUser: this.mapUser,
        mapImage: this.mapImage.toClient(),
        mapTitle: this.mapTitle,
        mapDescription: this.mapDescription,
        mapPitchedBookingEnabled: this.mapPitchedBookingEnabled,
        mapPitchedBookingURL: this.mapPitchedBookingURL
    };
};
/**
 * Mongoose model
 */
const Map = mongoose_1.default.model("Map", MapSchema);
exports.Map = Map;
