import ImageClient from "../ImageModels/Image.client";

export default class MapMarkerClient {

    public mapMarkerId = "";
    public mapMarkerUser = "";
    public mapMarkerKey = "";
    public mapMarkerMap = "";
    public mapMarkerOrder = 0;
    public mapMarkerName = "";
    public mapMarkerPositionX = 0;
    public mapMarkerPositionY = 0;
    public mapMarkerLocked = false;
    public mapMarkerTitle = "";
    public mapMarkerTitleDisplayType = "";
    public mapMarkerDescription = "";
    public mapMarkerPitchedUnitSelection = "";
    public mapMarkerButtonEnabled = false;
    public mapMarkerButtonLabel = "";
    public mapMarkerButtonURL = "";
    public mapMarkerImagesEnabled = false;
    public mapMarkerImages: ImageClient[] = [];
    public mapMarkerCreatedAt = "";
    public mapMarkerUpdatedAt = "";

    constructor({
        mapMarkerId = "", 
        mapMarkerUser = "",
        mapMarkerMap = "",
        mapMarkerKey = "",
        mapMarkerOrder = 0,
        mapMarkerName = "",
        mapMarkerPositionX = 0,
        mapMarkerPositionY = 0,
        mapMarkerLocked = false,
        mapMarkerTitle = "",
        mapMarkerTitleDisplayType = "",
        mapMarkerDescription = "",
        mapMarkerPitchedUnitSelection = "",
        mapMarkerButtonEnabled = false,
        mapMarkerButtonLabel = "",
        mapMarkerButtonURL = "",
        mapMarkerImagesEnabled = false,
        mapMarkerImages = [] as ImageClient[],
        mapMarkerCreatedAt = "",
        mapMarkerUpdatedAt = "",
    } = {}) {
        this.mapMarkerId = mapMarkerId;
        this.mapMarkerUser = mapMarkerUser;
        this.mapMarkerMap = mapMarkerMap;
        this.mapMarkerKey = mapMarkerKey;
        this.mapMarkerOrder = mapMarkerOrder;
        this.mapMarkerName = mapMarkerName;
        this.mapMarkerPositionX = mapMarkerPositionX;
        this.mapMarkerPositionY = mapMarkerPositionY;
        this.mapMarkerLocked = mapMarkerLocked;
        this.mapMarkerTitle = mapMarkerTitle;
        this.mapMarkerTitleDisplayType = mapMarkerTitleDisplayType;
        this.mapMarkerDescription = mapMarkerDescription;
        this.mapMarkerPitchedUnitSelection = mapMarkerPitchedUnitSelection,
        this.mapMarkerButtonEnabled = mapMarkerButtonEnabled;
        this.mapMarkerButtonLabel = mapMarkerButtonLabel;
        this.mapMarkerButtonURL = mapMarkerButtonURL;
        this.mapMarkerImagesEnabled = mapMarkerImagesEnabled;
        this.mapMarkerImages = mapMarkerImages;
        this.mapMarkerCreatedAt = mapMarkerCreatedAt;
        this.mapMarkerUpdatedAt = mapMarkerUpdatedAt;
    }


}