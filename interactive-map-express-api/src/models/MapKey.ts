import mongoose from 'mongoose';
import TSOmit from '../helpers/TSOmit'

/**
 * Schema
 */
interface IMapKey {
    mapKeyUser: string,
    mapKeyMap: string,
    mapKeyTitle: string,
    mapKeyColor: string,
    mapKeyInitialValue: boolean
}

/**
 * Create
 */
interface IMapKeyCreate extends TSOmit<IMapKey, 'mapKeyUser' | "mapKeyInitialValue"> {
    mapKeyInitialValue?: boolean,
}

/**
 * Update 
 */
interface IMapKeyUpdate {
    mapKeyTitle?: string,
    mapKeyColor?: string,
    mapKeyInitialValue?: boolean,
}

/**
 * Client schema
 */
interface IMapKeyClient extends IMapKey {
    mapKeyId: string,
}

/**
 * Document
 */
interface IMapKeyDoc extends IMapKey, mongoose.Document {
    toClient(): IMapKeyClient
}

/**
 * Mongoose schema definition
 */
const MapKeySchemaFields: Record<keyof IMapKey, any> = {
    mapKeyUser: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    mapKeyMap: {
        type: mongoose.Schema.Types.ObjectId, 
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
}

/**
 * Create mongoose schema
 */
const MapKeySchema = new mongoose.Schema(MapKeySchemaFields, {
    timestamps: { 
        createdAt: 'mapKeyCreatedAt', 
        updatedAt: 'mapKeyUpdatedAt' 
    },
});


/**
 * Define to client method
 */
 MapKeySchema.methods.toClient = function (this: IMapKeyDoc, cb : any): IMapKeyClient {
    return {
        mapKeyId: this._id,
        mapKeyMap: this.mapKeyMap,
        mapKeyUser: this.mapKeyUser,
        mapKeyInitialValue: this.mapKeyInitialValue,
        mapKeyColor: this.mapKeyColor,
        mapKeyTitle: this.mapKeyTitle,
    }
};

/**
 * Mongoose model
 */
const MapKey = mongoose.model<IMapKeyDoc>("MapKey", MapKeySchema);

/**
 * Exports 
 */
export { MapKey, MapKeySchema, IMapKey, IMapKeyCreate, IMapKeyUpdate, IMapKeyDoc, IMapKeyClient }