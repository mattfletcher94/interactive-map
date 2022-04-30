"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapMarkerSchema = exports.MapMarker = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Mongoose schema definition
 */
const MapMarkerSchemaFields = {
    mapMarkerUser: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    mapMarkerMap: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Map'
    },
    mapMarkerKey: {
        type: String,
        required: false,
        default: "",
    },
    mapMarkerOrder: {
        type: Number,
        required: false,
        default: 0
    },
    mapMarkerName: {
        type: String,
        required: false,
        default: "",
    },
    mapMarkerPositionX: {
        type: Number,
        required: [true, 'The map marker X position is required.'],
        default: 0
    },
    mapMarkerPositionY: {
        type: Number,
        required: [true, 'The map marker Y position is required.'],
        default: 0
    },
    mapMarkerLocked: {
        type: Boolean,
        required: false,
        default: false,
    },
    mapMarkerTitle: {
        type: String,
        required: false,
        default: "",
    },
    mapMarkerTitleDisplayType: {
        type: String,
        trim: true,
        required: true,
        enum: ['never', 'hover', 'always'],
        default: 'never',
    },
    mapMarkerDescription: {
        type: String,
        required: false,
        default: "",
    },
    mapMarkerPitchedUnitSelection: {
        type: String,
        required: false,
        default: "",
    },
    mapMarkerButtonEnabled: {
        type: Boolean,
        required: false,
        default: false,
    },
    mapMarkerButtonLabel: {
        type: String,
        required: false,
        default: "Find out more",
    },
    mapMarkerButtonURL: {
        type: String,
        required: false,
        default: "",
    },
    mapMarkerImagesEnabled: {
        type: Boolean,
        required: false,
        default: false,
    },
    mapMarkerImages: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Image' }
    ],
};
/**
 * Create mongoose schema
 */
const MapMarkerSchema = new mongoose_1.default.Schema(MapMarkerSchemaFields, {
    timestamps: {
        createdAt: 'mapMarkerCreatedAt',
        updatedAt: 'mapMarkerUpdatedAt'
    },
});
exports.MapMarkerSchema = MapMarkerSchema;
/**
 * Define to client method
 */
MapMarkerSchema.methods.toClient = function (cb) {
    return {
        mapMarkerId: this._id,
        mapMarkerUser: this.mapMarkerUser,
        mapMarkerMap: this.mapMarkerMap,
        mapMarkerKey: this.mapMarkerKey,
        mapMarkerOrder: this.mapMarkerOrder,
        mapMarkerName: this.mapMarkerName,
        mapMarkerPositionX: this.mapMarkerPositionX,
        mapMarkerPositionY: this.mapMarkerPositionY,
        mapMarkerLocked: this.mapMarkerLocked,
        mapMarkerTitle: this.mapMarkerTitle,
        mapMarkerTitleDisplayType: this.mapMarkerTitleDisplayType,
        mapMarkerDescription: this.mapMarkerDescription,
        mapMarkerPitchedUnitSelection: this.mapMarkerPitchedUnitSelection,
        mapMarkerButtonEnabled: this.mapMarkerButtonEnabled,
        mapMarkerButtonLabel: this.mapMarkerButtonLabel,
        mapMarkerButtonURL: this.mapMarkerButtonURL,
        mapMarkerImagesEnabled: this.mapMarkerImagesEnabled,
        mapMarkerImages: this.mapMarkerImages.map((image) => {
            return image.toClient();
        })
    };
};
/**
 * Mongoose model
 */
const MapMarker = mongoose_1.default.model("MapMarker", MapMarkerSchema);
exports.MapMarker = MapMarker;
