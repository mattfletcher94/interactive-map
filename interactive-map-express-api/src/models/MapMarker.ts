import mongoose from 'mongoose';
import TSOmit from '../helpers/TSOmit'
import { IImageClient, IImageDoc } from './Image';

/**
 * Schema
 */
interface IMapMarker {
    mapMarkerUser: string,
    mapMarkerMap: string,
    mapMarkerKey: string,
    mapMarkerOrder: number,
    mapMarkerName: string,
    mapMarkerPositionX: number,
    mapMarkerPositionY: number,
    mapMarkerLocked: boolean,
    mapMarkerTitle: string,
    mapMarkerTitleDisplayType: string,
    mapMarkerDescription: string,
    mapMarkerPitchedUnitSelection: string,
    mapMarkerButtonEnabled: boolean,
    mapMarkerButtonLabel: string,
    mapMarkerButtonURL: string,
    mapMarkerImagesEnabled: boolean,
    mapMarkerImages: string[]
}

/**
 * Create
 */
interface IMapMarkerCreate {
    mapMarkerMap?: string,
    mapMarkerKey? : string,
    mapMarkerOrder?: number,
    mapMarkerName?: string,
    mapMarkerPositionX: number,
    mapMarkerPositionY: number,
    mapMarkerLocked?: boolean,
    mapMarkerTitle?: string,
    mapMarkerTitleDisplayType?: string,
    mapMarkerDescription?: string,
    mapMarkerPitchedUnitSelection?: string,
    mapMarkerButtonEnabled?: boolean,
    mapMarkerButtonLabel?: string,
    mapMarkerButtonURL?: string,
    mapMarkerImagesEnabled?: boolean,
    mapMarkerImages?: string[],
}

/**
 * Update 
 */
interface IMapMarkerUpdate {
    mapMarkerKey?: string,
    mapMarkerOrder?: number,
    mapMarkerName?: string,
    mapMarkerPositionX?: number,
    mapMarkerPositionY?: number,
    mapMarkerLocked?: boolean,
    mapMarkerTitle?: string,
    mapMarkerTitleDisplayType?: string,
    mapMarkerDescription?: string,
    mapMarkerPitchedUnitSelection?: string,
    mapMarkerButtonEnabled?: boolean,
    mapMarkerButtonLabel?: string,
    mapMarkerButtonURL?: string,
    mapMarkerImagesEnabled?: boolean,
    mapMarkerImages?: string[],
}

/**
 * Client schema
 */
interface IMapMarkerClient extends TSOmit<IMapMarker, 'mapMarkerImages'> {
    mapMarkerId: string,
    mapMarkerImages: IImageClient[]
}

/**
 * Document
 */
interface IMapMarkerDoc extends IMapMarker, mongoose.Document {
    toClient(): IMapMarkerClient
}

/**
 * Document populated
 */
 interface IMapMarkerDocPopulated extends Omit<IMapMarkerDoc, 'mapMarkerImages'> {
    mapMarkerImages: IImageDoc[]
}

/**
 * Mongoose schema definition
 */
const MapMarkerSchemaFields: Record<keyof IMapMarker, any> = {
    mapMarkerUser: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    mapMarkerMap: {
        type: mongoose.Schema.Types.ObjectId, 
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
        { type: mongoose.Schema.Types.ObjectId, ref: 'Image' }
    ],
}

/**
 * Create mongoose schema
 */
const MapMarkerSchema = new mongoose.Schema(MapMarkerSchemaFields, {
    timestamps: { 
        createdAt: 'mapMarkerCreatedAt', 
        updatedAt: 'mapMarkerUpdatedAt' 
    },
});


/**
 * Define to client method
 */
MapMarkerSchema.methods.toClient = function (this: IMapMarkerDocPopulated, cb : any): IMapMarkerClient {
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
    }
};

/**
 * Mongoose model
 */
 const MapMarker = mongoose.model<IMapMarkerDoc>("MapMarker", MapMarkerSchema);

/**
 * Exports 
 */
export { MapMarker, MapMarkerSchema, IMapMarker, IMapMarkerCreate, IMapMarkerUpdate, IMapMarkerDoc, IMapMarkerClient }