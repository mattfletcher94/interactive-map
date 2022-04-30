import MapKeyCreate from "./MapKey.create";
import MapKeyUpdate from "./MapKey.update";

export default class MapKeyEditor {

    public mapKeyId = "";
    public mapKeyUser = "";
    public mapKeyMap = "";
    public mapKeyTitle = "";
    public mapKeyColor = "";
    public mapKeyInitialValue = true;
    public mapKeyCreatedAt = "";
    public mapKeyUpdatedAt = "";
    public mapKeyDirty = false;
    public mapKeyTemporary = false;
    public mapKeyBusy = false;
    public mapKeyError = "";

    constructor({
        mapKeyId = "", 
        mapKeyUser = "",
        mapKeyMap = "",
        mapKeyTitle = "",
        mapKeyColor = "",
        mapKeyInitialValue = true,
        mapKeyCreatedAt = "",
        mapKeyUpdatedAt = "",
        mapKeyDirty = false,
        mapKeyBusy = false,
        mapKeyTemporary = false,
        mapKeyError = "",
    } = {}) {
        this.mapKeyId = mapKeyId;
        this.mapKeyUser = mapKeyUser;
        this.mapKeyMap = mapKeyMap;
        this.mapKeyTitle = mapKeyTitle;
        this.mapKeyColor = mapKeyColor;
        this.mapKeyInitialValue = mapKeyInitialValue;
        this.mapKeyCreatedAt = mapKeyCreatedAt;
        this.mapKeyUpdatedAt = mapKeyUpdatedAt;
        this.mapKeyDirty = mapKeyDirty;
        this.mapKeyBusy = mapKeyBusy;
        this.mapKeyTemporary = mapKeyTemporary;
        this.mapKeyError = mapKeyError;
    }

    public toCreate(): MapKeyCreate {
        return {
            mapKeyMap: this.mapKeyMap,
            mapKeyTitle: this.mapKeyTitle,
            mapKeyColor: this.mapKeyColor,
            mapKeyInitialValue: this.mapKeyInitialValue,
        }
    }

    public toUpdate(): MapKeyUpdate {
        return {
            mapKeyTitle: this.mapKeyTitle,
            mapKeyColor: this.mapKeyColor,
            mapKeyInitialValue: this.mapKeyInitialValue,
        }
    }

}