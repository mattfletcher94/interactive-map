"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MapMarker = mongoose_1.default.model('MapMarker', new mongoose_1.default.Schema({
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
    mapMarkerTitle: {
        type: String,
        required: false,
        default: "",
    },
    mapMarkerDescription: {
        type: String,
        required: false,
        default: "",
    },
}, {
    timestamps: {
        createdAt: 'mapMarkerCreatedAt',
        updatedAt: 'mapMarkerUpdatedAt'
    },
}));
exports.default = MapMarker;
