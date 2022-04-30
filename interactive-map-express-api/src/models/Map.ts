import mongoose from 'mongoose';
import TSOmit from '../helpers/TSOmit'
import { Image, IImageClient, IImageDoc } from './Image';

/**
 * Interfaces in Typescript are different than your traditional interface,
 * they do not need to be implemented, and can be used
 * simply to define the signature of data structures.
 */

/**
 * Map Schema.
 * Contains all fields associated with the Map Model.
 */
interface IMap {
    mapUser: string,
    mapImage: string,
    mapTitle: string,
    mapDescription: string,
    mapPitchedBookingEnabled: boolean,
    mapPitchedBookingURL: string,
}

/**
 * Create Map Schema.
 * Contains fields needed to create a new map.
 * Fields marked with question marks are optional.
 */
interface IMapCreate extends TSOmit<IMap, 'mapUser' | 'mapDescription' | 'mapPitchedBookingEnabled' | 'mapPitchedBookingURL'> {
    mapDescription?: string;
    mapPitchedBookingEnabled?: boolean;
    mapPitchedBookingURL?: string,
}

/**
 * Update Map schema.
 * Similiar to the Create schema, but all fields are optional. 
 */
interface IMapUpdate extends TSOmit<IMap, 'mapUser' | 'mapTitle' | 'mapDescription'  | 'mapImage' | 'mapPitchedBookingEnabled' | 'mapPitchedBookingURL'> {
    mapImage?: string;
    mapTitle?: string;
    mapDescription?: string;
    mapPitchedBookingEnabled?: boolean;
    mapPitchedBookingURL?: string,
}

/**
 * Client schema.
 * This is the data strcture that is returned to the client.
 * Sometimes you don't want to return all fields.
 */
interface IMapClient extends TSOmit<IMap, 'mapImage'> {
    mapId: string,
    mapImage: IImageClient
}

/**
 * Mongoose document schema.
 * Attach functions to model
 * Little hack to help with typescript support.
 */
interface IMapDoc extends IMap, mongoose.Document {
    toClient(): IMapClient
}

/**
 * Document populated
 */
 interface IMapDocPopulated extends Omit<IMapDoc, 'mapImage'> {
    mapImage: IImageDoc
}

/**
 * Mongoose schema definition
 */
const MapSchemaFields: Record<keyof IMap, any> = {
    mapUser: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    mapImage: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Image',
        validate: {
            validator: async function (imageId : string) : Promise<boolean> {
                if (!mongoose.isValidObjectId(imageId)) {
                    return Promise.resolve(false);
                }
                const image = await Image.findOne({ _id: imageId });
                return Promise.resolve(image == null ? false : true);
            },
            message: (props : any) => `The image does not exist.`
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
}

/**
 * Create mongoose schema
 */
const MapSchema = new mongoose.Schema(MapSchemaFields, {
    timestamps: { 
        createdAt: 'mapCreatedAt', 
        updatedAt: 'mapUpdatedAt' 
    },
});


/**
 * Define to client method
 */
 MapSchema.methods.toClient = function (this: IMapDocPopulated, cb : any): IMapClient {
    return {
        mapId: this._id,
        mapUser: this.mapUser,
        mapImage: this.mapImage.toClient(),
        mapTitle: this.mapTitle,
        mapDescription: this.mapDescription,
        mapPitchedBookingEnabled: this.mapPitchedBookingEnabled,
        mapPitchedBookingURL: this.mapPitchedBookingURL
    }
};

/**
 * Mongoose model
 */
 const Map = mongoose.model<IMapDoc>("Map", MapSchema);

/**
 * Exports 
 */
export { Map, MapSchema, IMap, IMapCreate, IMapUpdate, IMapDoc, IMapClient }