import mongoose from 'mongoose'
import fs from 'fs-extra';
import mkdirp from 'mkdirp';
import sharp from "sharp"
import RepositoryNotFoundError from './errors/RepositoryNotFoundError';
import RepositoryValidationError from './errors/RepositoryValidationError';
import { Image, IImage, IImageCreate, IImageUpdate } from "../models/Image";
import { Map } from "../models/Map";
import RepositoryCanNotDeleteError from './errors/RepositoryCanNotDeleteError';
import { MapMarker } from '../models/MapMarker';

export default class ImageRepository {

    /**
     * Create a new image
     */
    public async create(userId: string, model : IImageCreate) {
        try {

            var resizedImageAsBase64 = "";
            if (model.imageBase64) {
                try {
                    let resizedImage = Buffer.from(model.imageBase64, "base64");
                    resizedImage = await sharp(resizedImage).resize(300, 300).toBuffer();
                    resizedImageAsBase64 = resizedImage.toString("base64");
                } catch (e) {
                    // Ignore quietly
                }
            }



            // Create document
            const document = new Image({
                imageUser: userId,
                imageName: model.imageName,
                imageBase64: model.imageBase64,
                imageBase64Thumbnail: resizedImageAsBase64,
            } as IImage);

            // Save doc
            const savedDocument = await document.save();

            // Return
            return savedDocument.toClient();

        } catch (err) {
            if (err && err.name === 'ValidationError') {
                throw new RepositoryValidationError("The item could not be created.", Object.keys(err.errors).map((k : any) => {
                    return { field: err.errors[k].properties.path, message: err.errors[k].properties.message }
                }));
            } else {
                throw err;
            }
        }
    }

    /**
     * Update an image
     */
    async update(userId : string, imageId: string, model: IImageUpdate) {
        try {

            // Find document
            const document = await Image.findOne({ _id: imageId, imageUser: userId }).orFail();

            // Set new attributes
            document.imageName = model.imageName ? model.imageName : document.imageName;

            // Validate  new fields
            await document.validate();

            // Save now document
            const savedDocument = await document.save();

            // Return new document
            return savedDocument.toClient();

        } catch (err) {
            if (err && err.name === 'ValidationError') {
                throw new RepositoryValidationError("The item could not be updated.", Object.keys(err.errors).map((k : any) => {
                    return { field: err.errors[k].properties.path, message: err.errors[k].properties.message }
                }));
            } else if (err.name == "DocumentNotFoundError") {
                throw new RepositoryNotFoundError("The item could not be found.");
            } else {
                throw err;
            }
        }
    }
    
    /**
     * Delete an image
     * @param id 
     */
    async delete(userId: string, id: string) {
        try {

            // Check if image is used by a map,
            // and if so then don't remove
            const map = await Map.findOne({ mapImage: id });
            if (map) {
                throw new RepositoryCanNotDeleteError("Cannot delete image because it is being used by the Map '"  + map.mapTitle + "'");
            }
            
            // Find image document
            const document = await Image.findOne({ _id: id, imageUser: userId }).orFail();

            // Remove files
            //fs.unlink(<string>document.imagePath, (err) => { });
            //fs.unlink(<string>document.imagePath.substring(0, document.imagePath.length-4) + '-thumbnail.png', (err) => { });
            await document.deleteOne();


            // Remove from map marker galleries
            await MapMarker.updateMany(
                { mapMarkerUser: userId }, 
                { $pull: { mapMarkerImages: id } },
                { multi:true }
            );
            
            // Deleted
            return true;

        } catch (err) {
            if (err.name == "DocumentNotFoundError") {
                throw new RepositoryNotFoundError("The item could not be found.");
            } else if (err && err.name === 'ValidationError') {
                throw new RepositoryValidationError("The item could not be created.", Object.keys(err.errors).map((k : any) => {
                    return { field: err.errors[k].properties.path, message: err.errors[k].properties.message }
                }));
            } else {
                throw err;
            }
        }
    }

    /**
     * Get all images
     */
    async getByUserId(userId : string) {
        try {
            const documents = await Image.find({ imageUser: userId }).sort({ '_id' : -1 });
            return documents.map((document) => {
                return document.toClient();
            });
        } catch (err) {
            throw err;
        }
    }

    /**
     * Get one image by id
     */
    async getOneByUserId(userId: string, imageId : string) {
        try {
            const document = await Image.findOne({ _id: imageId, imageUser: userId }).orFail();
            return document.toClient();
        } catch (err) {
            if (err.name == "DocumentNotFoundError") {
                throw new RepositoryNotFoundError("The item could not be found.");
            } else {
                throw err;
            }
        }
    }

}