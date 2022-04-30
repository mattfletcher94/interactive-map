import '../env'
import RepositoryValidationError from "./errors/RepositoryValidationError";
import RepositoryNotFoundError from './errors/RepositoryNotFoundError';
import { IMapKey, IMapKeyClient, IMapKeyCreate, IMapKeyUpdate, MapKey } from '../models/MapKey';
import { MapMarker } from '../models/MapMarker';


export default class MapKeysRepository {

    /**
     * Create a new map key
     */
    async create(userId: string, model : IMapKeyCreate) {
        try {
            const document = new MapKey({
                mapKeyUser: userId,
                mapKeyMap: model.mapKeyMap,
                mapKeyTitle: model.mapKeyTitle,
                mapKeyInitialValue: model.mapKeyInitialValue,
                mapKeyColor: model.mapKeyColor,
            } as IMapKey);
            const savedDocument = await document.save();
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
     * Update a map marker
     */
    async update(userId: string, mapKeyId: string, model: IMapKeyUpdate) {
        try {

            // Find document
            const document = await MapKey.findOne({ _id: mapKeyId, mapKeyUser: userId, }).orFail();

            // Set new attributes
            document.mapKeyTitle = model.mapKeyTitle === undefined ? document.mapKeyTitle : model.mapKeyTitle;
            document.mapKeyColor = model.mapKeyColor === undefined ? document.mapKeyColor : model.mapKeyColor;
            document.mapKeyInitialValue = model.mapKeyInitialValue === undefined ? document.mapKeyInitialValue : model.mapKeyInitialValue;

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
     * Delete a map key
     * @param id 
     */
    async delete(userId: string, mapKeyId: string) {
        try {
            const document = await MapKey.findOne({ _id: mapKeyId, mapKeyUser: userId }).orFail();
            await document.deleteOne();

            // Update all map markers that use this key to reference no key
            await MapMarker.updateMany({ 
                mapMarkerKey: mapKeyId, 
                mapMarkerUser: userId, 
            }, {
                "$set": {
                    "mapMarkerKey": ""
                }
            });
            return true;
        } catch (err) {
            if (err.name == "DocumentNotFoundError") {
                throw new RepositoryNotFoundError("The item could not be found.");
            } else {
                throw err;
            }
        }
    }

    /**
     * Get all map keys by map id
     */
    async getByMapId(mapId: string) : Promise<Array<IMapKeyClient>> {
        try {
            const documents = await MapKey.find({ mapKeyMap: mapId }).sort({ '_id' : -1 });
            return documents.map((document) => {
                return document.toClient();
            });
        } catch (err) {
            throw err;
        }
    }

    /**
     * Get all map keys by map id and user id
     */
    async getByUserIdAndMapId(userId: string, mapId: string) : Promise<Array<IMapKeyClient>> {
        try {
            const documents = await MapKey.find({ mapKeyMap: mapId, mapKeyUser: userId }).sort({ '_id' : -1 });
            return documents.map((document) => {
                return document.toClient();
            });
        } catch (err) {
            throw err;
        }
    }

    /**
     * Get map key by id
     */
    async getOneByMapId(mapId: string, mapKeyId : string) {
        try {
            const document = await MapKey.findOne({ _id: mapKeyId, mapKeyMap: mapId }).orFail();
            return document.toClient();
        } catch (err) {
            if (err.name == "DocumentNotFoundError") {
                throw new RepositoryNotFoundError("The item could not be found.");
            } else {
                throw err;
            }
        }
    }

    /**
     * Get map key by id
     */
    async getOneByUserIdAndMapId(userId: string, mapId: string, mapKeyId : string) {
        try {
            const document = await MapKey.findOne({ _id: mapKeyId, mapKeyMap: mapId, mapKeyUser: userId  }).orFail();
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