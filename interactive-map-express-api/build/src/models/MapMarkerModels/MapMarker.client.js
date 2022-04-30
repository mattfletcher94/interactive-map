"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MapMarkerClient {
    constructor({ mapMarkerId = "", mapMarkerUser = "", mapMarkerMap = "", mapMarkerKey = "", mapMarkerOrder = 0, mapMarkerName = "", mapMarkerPositionX = 0, mapMarkerPositionY = 0, mapMarkerTitle = "", mapMarkerDescription = "", mapMarkerCreatedAt = "", mapMarkerUpdatedAt = "", } = {}) {
        this.mapMarkerId = "";
        this.mapMarkerUser = "";
        this.mapMarkerMap = "";
        this.mapMarkerKey = "";
        this.mapMarkerOrder = 0;
        this.mapMarkerName = "";
        this.mapMarkerPositionX = 0;
        this.mapMarkerPositionY = 0;
        this.mapMarkerTitle = "";
        this.mapMarkerDescription = "";
        this.mapMarkerCreatedAt = "";
        this.mapMarkerUpdatedAt = "";
        this.mapMarkerId = mapMarkerId;
        this.mapMarkerUser = mapMarkerUser;
        this.mapMarkerMap = mapMarkerMap;
        this.mapMarkerKey = mapMarkerKey;
        this.mapMarkerOrder = mapMarkerOrder;
        this.mapMarkerName = mapMarkerName;
        this.mapMarkerPositionX = mapMarkerPositionX;
        this.mapMarkerPositionY = mapMarkerPositionY;
        this.mapMarkerTitle = mapMarkerTitle;
        this.mapMarkerDescription = mapMarkerDescription;
        this.mapMarkerCreatedAt = mapMarkerCreatedAt;
        this.mapMarkerUpdatedAt = mapMarkerUpdatedAt;
    }
}
exports.default = MapMarkerClient;
