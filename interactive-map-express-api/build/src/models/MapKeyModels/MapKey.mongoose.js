"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MapKeyMongoose = mongoose_1.default.model('MapKey', new mongoose_1.default.Schema({
    mapKeyUser: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    mapKeyMap: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Map'
    },
    mapKeyTitle: {
        type: String,
        trim: true,
        default: "",
        required: [true, 'The map key title field is required.'],
    },
    mapKeyColor: {
        type: String,
        trim: true,
        required: [true, 'The map key colour field is required.'],
    },
    mapKeyInitialValue: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: {
        createdAt: 'mapKeyCreatedAt',
        updatedAt: 'mapKeyUpdatedAt'
    },
}));
exports.default = MapKeyMongoose;
