import RepositoryNotFoundError from './errors/RepositoryNotFoundError';
import RepositoryValidationError from './errors/RepositoryValidationError';
import { Map, IMap, IMapCreate, IMapUpdate } from "../models/Map";

export default class MapsRepository {
    
    /**
     * Create a new map
     * @param userId 
     * @param model 
     */
    async create(userId: string, model : IMapCreate) {
        try {
            const document = new Map({
                mapUser: userId,
                mapImage: model.mapImage,
                mapTitle: model.mapTitle,
                mapDescription: model.mapDescription,
                mapPitchedBookingEnabled: model.mapPitchedBookingEnabled,
                mapPitchedBookingURL: model.mapPitchedBookingURL,
            });
            const savedDocument = await document.save();
            await savedDocument.populate('mapImage').execPopulate();
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
     * Update a map
     * @param userId 
     * @param modelId 
     * @param model 
     */
    async update(userId: string, mapId: string, model: IMapUpdate) {
        try {

            // Find document
            const document = await Map.findOne({ _id: mapId, mapUser: userId }).orFail();

            // Set new attributes
            document.mapTitle                   = model.mapTitle === undefined ? document.mapTitle : model.mapTitle;
            document.mapDescription             = model.mapDescription === undefined ? document.mapDescription : model.mapDescription;
            document.mapImage                   = model.mapImage === undefined ? document.mapImage : model.mapImage;
            document.mapPitchedBookingEnabled   = model.mapPitchedBookingEnabled === undefined ? document.mapPitchedBookingEnabled : model.mapPitchedBookingEnabled;
            document.mapPitchedBookingURL       = model.mapPitchedBookingURL === undefined ? document.mapPitchedBookingURL : model.mapPitchedBookingURL;

            // Validate  new fields
            await document.validate();

            // Save now document
            const savedDocument = await document.save();
            await savedDocument.populate('mapImage').execPopulate();

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
     * Get all maps for a specific user
     * @param userId 
     */
    public async getByUserId(userId : string) {
        try {
            const documents = await Map.find({ mapUser: userId }).populate("mapImage").sort({ '_id' : -1 });
            return documents.map((document) => {
                return document.toClient();
            });
        } catch (err) {
            throw err;
        }
    }
    
    /**
     * Get one map by id
     * @param mapId 
     */
    public async getOne(mapId : string) {
        try {
            const document = await Map.findOne({ _id: mapId }).populate("mapImage").orFail();
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
     * Get one map for a specific user
     * @param userId 
     * @param mapId 
     */
    public async getOneByUserId(userId : string, mapId : string) {
        try {
            const document = await Map.findOne({ _id: mapId, mapUser: userId }).populate("mapImage").orFail();
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
     * Delete a map 
     * @param userId 
     * @param mapId 
     */
    async delete(userId : string, mapId: string) {
        try {
            const document = await Map.findOne({ _id: mapId, mapUser: userId }).orFail();
            await document.deleteOne();
            return true;
        } catch (err) {
            if (err.name == "DocumentNotFoundError") {
                throw new RepositoryNotFoundError("The item could not be found.");
            } else {
                throw err;
            }
        }
    }


}