"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Image_client_1 = __importDefault(require("../ImageModels/Image.client"));
class MapClient {
    constructor({ mapId = "", mapUser = "", mapImage = new Image_client_1.default(), mapTitle = "", mapDescription = "", mapIsPublished = false, 
    //mapKeys = [] as MapKeyClient[],
    mapCreatedAt = "", mapUpdatedAt = "", } = {}) {
        this.mapId = "";
        this.mapUser = "";
        this.mapImage = null;
        this.mapTitle = "";
        this.mapDescription = "";
        this.mapIsPublished = false;
        //public mapKeys: MapKeyClient[] = [];
        this.mapCreatedAt = "";
        this.mapUpdatedAt = "";
        this.mapId = mapId;
        this.mapUser = mapUser;
        this.mapImage = mapImage;
        this.mapTitle = mapTitle;
        this.mapDescription = mapDescription;
        this.mapIsPublished = mapIsPublished;
        //this.mapKeys = mapKeys;
        this.mapCreatedAt = mapCreatedAt;
        this.mapUpdatedAt = mapUpdatedAt;
    }
}
exports.default = MapClient;
