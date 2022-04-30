import * as PIXI from 'pixi.js';
import ImageClient from '../ImageModels/Image.client';

type mapMarkerState = "default" | "available" | "unavailable" | "not_a_pitched_unit";

export default class MapMarkerEditor {

    public mapMarkerId : string = "";
    public mapMarkerUser: string = "";
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
    public mapMarkerCreatedAt: string = "";
    public mapMarkerUpdatedAt: string = "";
    public mapMarkerKey: string = "";
    public mapMarkerSelected: boolean = false;
    public mapMarkerHovered: boolean = false;
    public mapMarkerSprite: PIXI.Sprite = new PIXI.Sprite()
    public mapMarkerRender: boolean = true;
    public mapMarkerAvailable: boolean | null = null;
    public mapMarkerState: mapMarkerState = "default";
    public mapMarkerPrice: number = 0;

    constructor({
        mapMarkerId = "", 
        mapMarkerUser = "",
        mapMarkerMap = "",
        mapMarkerOrder = 0,
        mapMarkerName = "",
        mapMarkerPositionX = 0,
        mapMarkerPositionY = 0,
        mapMarkerTitle = "",
        mapMarkerTitleDisplayType = "never",
        mapMarkerDescription = "",
        mapMarkerPitchedUnitSelection = "",
        mapMarkerButtonEnabled = false,
        mapMarkerButtonLabel = "",
        mapMarkerButtonURL = "",
        mapMarkerImagesEnabled = false,
        mapMarkerImages = [] as ImageClient[],
        mapMarkerKey = "",
        mapMarkerSelected = false,
        mapMarkerSprite = new PIXI.Sprite(),
        mapMarkerAvailable = null,
        mapMarkerState = "default" as mapMarkerState,
        mapMarkerPrice = 0,
    } = {}) {
        this.mapMarkerId = mapMarkerId;
        this.mapMarkerUser = mapMarkerUser;
        this.mapMarkerMap = mapMarkerMap;
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
        this.mapMarkerKey = mapMarkerKey;
        this.mapMarkerSelected = mapMarkerSelected;
        this.mapMarkerSprite = mapMarkerSprite;
        this.mapMarkerAvailable = mapMarkerAvailable;
        this.mapMarkerState = mapMarkerState;
        this.mapMarkerPrice = mapMarkerPrice;
    }


}