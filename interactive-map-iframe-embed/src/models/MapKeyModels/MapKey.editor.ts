export default class MapKeyEditor {

    public mapKeyId : string = "";
    public mapKeyUser: string = "";
    public mapKeyMap: string = "";
    public mapKeyTitle: string = "";
    public mapKeyColor: string = "";
    public mapKeyInitialValue: boolean = true;
    public mapKeyCreatedAt: string = "";
    public mapKeyUpdatedAt: string = "";
    public mapKeySelected: boolean = false;

    constructor({
        mapKeyId = "", 
        mapKeyUser = "",
        mapKeyMap = "",
        mapKeyTitle = "",
        mapKeyColor = "",
        mapKeyInitialValue = true,
        mapKeyCreatedAt = "",
        mapKeyUpdatedAt = "",
        mapKeySelected = true,
    } = {}) {
        this.mapKeyId = mapKeyId;
        this.mapKeyUser = mapKeyUser;
        this.mapKeyMap = mapKeyMap;
        this.mapKeyTitle = mapKeyTitle;
        this.mapKeyColor = mapKeyColor;
        this.mapKeyInitialValue = mapKeyInitialValue;
        this.mapKeyCreatedAt = mapKeyCreatedAt;
        this.mapKeyUpdatedAt = mapKeyUpdatedAt;
        this.mapKeySelected = mapKeySelected
    }

}