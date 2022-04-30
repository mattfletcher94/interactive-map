import mongoose from 'mongoose';
import TSOmit from '../helpers/TSOmit'

/**
 * Schema
 */
interface IImage {
    imageUser: string
    imageName: string
    //imagePath: string
    imageBase64: string
    imageBase64Thumbnail: string
}

/**
 * Create
 */
interface IImageCreate extends TSOmit<IImage, 'imageUser' | 'imageName' | 'imageBase64Thumbnail'> {
    imageName?: string,
    //imageFile: string
}

/**
 * Update 
 */
interface IImageUpdate extends TSOmit<IImage, 'imageUser' | 'imageBase64' | 'imageBase64Thumbnail'> {
}

/**
 * Client schema
 */
interface IImageClient extends TSOmit<IImage, 'imageBase64' | 'imageBase64Thumbnail'> {
    imageId: string,
    imagePath: string,
    imagePathThumbnail: string
}

/**
 * Document
 */
interface IImageDoc extends IImage, mongoose.Document {
    toClient(): IImageClient
}

/**
 * Mongoose schema definition
 */
const ImageSchemaFields: Record<keyof IImage, any> = {
    imageUser: {
        type: mongoose.Schema.Types.ObjectId, 
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
}

/**
 * Create mongoose schema
 */
const ImageSchema = new mongoose.Schema(ImageSchemaFields, {
    timestamps: { 
        createdAt: 'imageCreatedAt', 
        updatedAt: 'imageUpdatedAt' 
    },
});


/**
 * Define to client method
 */
 ImageSchema.methods.toClient = function (this: any, cb : any): IImageClient {
    return {
        imageId: this._id,
        imageUser: this.imageUser,
        imageName: this.imageName,
        imagePath: process.env.BASE_URL + '/static/images/' + this._id + '.png',
        imagePathThumbnail: process.env.BASE_URL + '/static/images/' + this._id + '-thumbnail.png',

        //imagePath: process.env.BASE_URL + '/' + this.imagePath,
        //imagePathThumbnail: process.env.BASE_URL + '/' + this.imagePath.substring(0, this.imagePath.length-4) + '-thumbnail.png',
    }
};

/**
 * Mongoose model
 */
 const Image = mongoose.model<IImageDoc>("Image", ImageSchema);

/**
 * Exports 
 */
export { Image, ImageSchema, IImage, IImageCreate, IImageUpdate, IImageDoc, IImageClient }