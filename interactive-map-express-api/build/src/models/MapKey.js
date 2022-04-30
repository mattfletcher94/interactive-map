"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapKeySchema = exports.MapKey = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Mongoose schema definition
 */
const MapKeySchemaFields = {
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
};
/**
 * Create mongoose schema
 */
const MapKeySchema = new mongoose_1.default.Schema(MapKeySchemaFields, {
    timestamps: {
        createdAt: 'mapKeyCreatedAt',
        updatedAt: 'mapKeyUpdatedAt'
    },
});
exports.MapKeySchema = MapKeySchema;
/**
 * Define to client method
 */
MapKeySchema.methods.toClient = function (cb) {
    return {
        mapKeyId: this._id,
        mapKeyMap: this.mapKeyMap,
        mapKeyUser: this.mapKeyUser,
        mapKeyInitialValue: this.mapKeyInitialValue,
        mapKeyColor: this.mapKeyColor,
        mapKeyTitle: this.mapKeyTitle,
    };
};
/**
 * Mongoose model
 */
const MapKey = mongoose_1.default.model("MapKey", MapKeySchema);
exports.MapKey = MapKey;
