import '../env'
import RepositoryValidationError from "./errors/RepositoryValidationError";
import RepositoryNotFoundError from './errors/RepositoryNotFoundError';
import { MapMarker, IMapMarker, IMapMarkerCreate, IMapMarkerUpdate, IMapMarkerClient } from "../models/MapMarker";


export default class MapMarkersRepository  {

    /**
     * Create a map marker
     * @param userId 
     * @param model 
     */
    async create(userId: string, model : IMapMarkerCreate) {
        try {
            const document = new MapMarker({
                mapMarkerUser: userId,
                ...model
            });
            const savedDocument = await document.save();
            await savedDocument.populate("mapMarkerImages").execPopulate();
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
    async update(userId: string, mapMarkerId: string, model: IMapMarkerUpdate) {
        try {

            // Find document
            const document = await MapMarker.findOne({ _id: mapMarkerId, mapMarkerUser: userId, }).orFail();

            // Set new attributes
            document.mapMarkerKey = model.mapMarkerKey === undefined ? document.mapMarkerKey : model.mapMarkerKey;
            document.mapMarkerOrder = model.mapMarkerOrder === undefined ? document.mapMarkerOrder : model.mapMarkerOrder;
            document.mapMarkerName = model.mapMarkerName === undefined ? document.mapMarkerName : model.mapMarkerName;
            document.mapMarkerPositionX = model.mapMarkerPositionX === undefined ? document.mapMarkerPositionX : model.mapMarkerPositionX;
            document.mapMarkerPositionY = model.mapMarkerPositionY === undefined ? document.mapMarkerPositionY : model.mapMarkerPositionY;
            document.mapMarkerLocked = model.mapMarkerLocked === undefined ? document.mapMarkerLocked : model.mapMarkerLocked;
            document.mapMarkerTitle = model.mapMarkerTitle === undefined ? document.mapMarkerTitle : model.mapMarkerTitle;
            document.mapMarkerTitleDisplayType = model.mapMarkerTitleDisplayType === undefined ? document.mapMarkerTitleDisplayType : model.mapMarkerTitleDisplayType;
            document.mapMarkerDescription = model.mapMarkerDescription === undefined ? document.mapMarkerDescription : model.mapMarkerDescription;
            document.mapMarkerPitchedUnitSelection = model.mapMarkerPitchedUnitSelection === undefined ? document.mapMarkerPitchedUnitSelection : model.mapMarkerPitchedUnitSelection;
            document.mapMarkerButtonEnabled = model.mapMarkerButtonEnabled === undefined ? document.mapMarkerButtonEnabled : model.mapMarkerButtonEnabled;
            document.mapMarkerButtonLabel = model.mapMarkerButtonLabel === undefined ? document.mapMarkerButtonLabel : model.mapMarkerButtonLabel;
            document.mapMarkerButtonURL = model.mapMarkerButtonURL === undefined ? document.mapMarkerButtonURL : model.mapMarkerButtonURL;
            document.mapMarkerImagesEnabled = model.mapMarkerImagesEnabled === undefined ? document.mapMarkerImagesEnabled : model.mapMarkerImagesEnabled;
            document.mapMarkerImages = model.mapMarkerImages === undefined ? document.mapMarkerImages : model.mapMarkerImages as any;

            // Validate  new fields
            await document.validate();

            // Save now document
            const savedDocument = await document.save();
            await savedDocument.populate("mapMarkerImages").execPopulate();

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
     * Delete a map marker
     * @param id 
     */
    async delete(userId: string, mapMarkerId: string) {
        try {
            const document = await MapMarker.findOne({ _id: mapMarkerId, mapMarkerUser: userId }).orFail();
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

    /**
     * Get all markers by map id
     * @param mapId 
     */
    async getByMapId(mapId: string) : Promise<Array<IMapMarkerClient>> {
        try {
            const documents = await MapMarker.find({ mapMarkerMap: mapId }).populate("mapMarkerImages").sort({ '_id' : -1 });
            return documents.map((document) => {
                return document.toClient();
            });
        } catch (err) {
            throw err;
        }
    }

    /**
     * Get all map markers by map id and user id
     */
    async getByUserIdAndMapId(userId: string, mapId: string) : Promise<Array<IMapMarkerClient>> {
        try {
            const documents = await MapMarker.find({ mapMarkerMap: mapId, mapMarkerUser: userId }).populate("mapMarkerImages").sort({ '_id' : -1 });
            return documents.map((document) => {
                return document.toClient();
            });
        } catch (err) {
            throw err;
        }
    }

    
    /**
     * Get all map markers by map id and user id
     */
    async getOneByUserIdAndMapId(userId: string, mapId: string, mapMarkerId : string) : Promise<IMapMarkerClient> {
        try {
            const document = await MapMarker.findOne({ _id: mapMarkerId, mapMarkerMap: mapId, mapMarkerUser: userId }).populate("mapMarkerImages").orFail();
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
     * Get all map markers by map id and user id
     */
    async getOneByMapId(mapId: string, mapMarkerId : string) : Promise<IMapMarkerClient> {
        try {
            const document = await MapMarker.findOne({ _id: mapMarkerId, mapMarkerMap: mapId }).populate("mapMarkerImages").orFail();
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