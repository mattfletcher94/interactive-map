import * as PIXI from 'pixi.js';
import ImageClient from '../ImageModels/Image.client';
import MapKeyEditor from '../MapKeyModels/MapKey.editor';
import MapMarkerCreate from './MapMarker.create';
import MapMarkerUpdate from './MapMarker.update';

export default class MapMarkerEditor {

    public mapMarkerId = "";
    public mapMarkerUser = "";
    public mapMarkerMap = "";
    public mapMarkerKey = "";
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
    public mapMarkerSelected = false;
    public mapMarkerHovered = false;
    public mapMarkerSprite: PIXI.Sprite;
    public mapMarkerDirty = false;
    public mapMarkerTemporary = false;
    public mapMarkerBusy = false;
    public mapMarkerError = "";

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


        mapMarkerSelected = false,
        mapMarkerDirty = false,
        mapMarkerTemporary = false,
        mapMarkerSprite = new PIXI.Sprite(),
        mapMarkerBusy = false,
        mapMarkerError = ""
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

        
        this.mapMarkerSelected = mapMarkerSelected;
        this.mapMarkerDirty = mapMarkerDirty;
        this.mapMarkerTemporary = mapMarkerTemporary;
        this.mapMarkerSprite = mapMarkerSprite;
        this.mapMarkerBusy = mapMarkerBusy;
        this.mapMarkerError = mapMarkerError;
    }

    public toCreate(): MapMarkerCreate {
        return {
            mapMarkerKey: this.mapMarkerKey,
            mapMarkerMap: this.mapMarkerMap,
            mapMarkerOrder: this.mapMarkerOrder,
            mapMarkerName: this.mapMarkerName,
            mapMarkerPositionX: this.mapMarkerPositionX,
            mapMarkerPositionY: this.mapMarkerPositionY,
            mapMarkerLocked: this.mapMarkerLocked,
            mapMarkerTitle: this.mapMarkerTitle,
            mapMarkerTitleDisplayType: this.mapMarkerTitleDisplayType,
            mapMarkerDescription: this.mapMarkerDescription,
            mapMarkerPitchedUnitSelection: this.mapMarkerPitchedUnitSelection,
            mapMarkerButtonEnabled: this.mapMarkerButtonEnabled,
            mapMarkerButtonLabel: this.mapMarkerButtonLabel,
            mapMarkerButtonURL: this.mapMarkerButtonURL,
            mapMarkerImagesEnabled: this.mapMarkerImagesEnabled,
            mapMarkerImages: this.mapMarkerImages.map((i) => {
                return i.imageId
            }),
        }
    }

    public toUpdate(): MapMarkerUpdate {
        return {
            mapMarkerKey: this.mapMarkerKey,
            mapMarkerOrder: this.mapMarkerOrder,
            mapMarkerName: this.mapMarkerName,
            mapMarkerPositionX: this.mapMarkerPositionX,
            mapMarkerPositionY: this.mapMarkerPositionY,
            mapMarkerLocked: this.mapMarkerLocked,
            mapMarkerTitle: this.mapMarkerTitle,
            mapMarkerTitleDisplayType: this.mapMarkerTitleDisplayType,
            mapMarkerDescription: this.mapMarkerDescription,
            mapMarkerPitchedUnitSelection: this.mapMarkerPitchedUnitSelection,
            mapMarkerButtonEnabled: this.mapMarkerButtonEnabled,
            mapMarkerButtonLabel: this.mapMarkerButtonLabel,
            mapMarkerButtonURL: this.mapMarkerButtonURL,
            mapMarkerImagesEnabled: this.mapMarkerImagesEnabled,
            mapMarkerImages: this.mapMarkerImages.map((i) => {
                return i.imageId
            }),
        }
    }

}