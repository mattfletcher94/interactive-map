import ImageClient from "../ImageModels/Image.client";

export default class MapMarkerClient {

    public mapMarkerId : string = "";
    public mapMarkerUser: string = "";
    public mapMarkerKey: string = "";
    public mapMarkerMap: string = "";
    public mapMarkerOrder: number = 0;
    public mapMarkerName: string = "";
    public mapMarkerPositionX: number = 0;
    public mapMarkerPositionY: number = 0;
    public mapMarkerTitle: string = "";
    public mapMarkerTitleDisplayType: string = "";
    public mapMarkerDescription: string = "";
    public mapMarkerPitchedUnitSelection: string = "";
    public mapMarkerButtonEnabled: boolean = false;
    public mapMarkerButtonLabel: string = "";
    public mapMarkerButtonURL: string = "";
    public mapMarkerImagesEnabled: boolean = false;
    public mapMarkerImages: ImageClient[] = [];

    constructor({
        mapMarkerId = "", 
        mapMarkerUser = "",
        mapMarkerMap = "",
        mapMarkerKey = "",
        mapMarkerOrder = 0,
        mapMarkerName = "",
        mapMarkerPositionX = 0,
        mapMarkerPositionY = 0,
        mapMarkerTitle = "",
        mapMarkerTitleDisplayType = 'never',
        mapMarkerDescription = "",
        mapMarkerPitchedUnitSelection = "",
        mapMarkerButtonEnabled = false,
        mapMarkerButtonLabel = "",
        mapMarkerButtonURL = "",
        mapMarkerImagesEnabled = false,
        mapMarkerImages = [] as ImageClient[],
    } = {}) {
        this.mapMarkerId = mapMarkerId;
        this.mapMarkerUser = mapMarkerUser;
        this.mapMarkerMap = mapMarkerMap;
        this.mapMarkerKey = mapMarkerKey;
        this.mapMarkerOrder = mapMarkerOrder;
        this.mapMarkerName = mapMarkerName;
        this.mapMarkerPositionX = mapMarkerPositionX;
        this.mapMarkerPositionY = mapMarkerPositionY;
        this.mapMarkerTitle = mapMarkerTitle;
        this.mapMarkerTitleDisplayType = mapMarkerTitleDisplayType;
        this.mapMarkerDescription = mapMarkerDescription;
        this.mapMarkerPitchedUnitSelection = mapMarkerPitchedUnitSelection,
        this.mapMarkerButtonEnabled = mapMarkerButtonEnabled;
        this.mapMarkerButtonLabel = mapMarkerButtonLabel;
        this.mapMarkerButtonURL = mapMarkerButtonURL;
        this.mapMarkerImagesEnabled = mapMarkerImagesEnabled;
        this.mapMarkerImages = mapMarkerImages;
    }


}