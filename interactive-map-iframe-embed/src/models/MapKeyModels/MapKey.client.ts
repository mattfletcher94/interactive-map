export default class MapKeyClient {

    public mapKeyId : string = "";
    public mapKeyUser: string = "";
    public mapKeyMap: string = "";
    public mapKeyTitle: string = "";
    public mapKeyColor: string = "";
    public mapKeyInitialValue: boolean = false;
    public mapKeyCreatedAt: string = "";
    public mapKeyUpdatedAt: string = "";

    constructor({
        mapKeyId = "", 
        mapKeyUser = "",
        mapKeyMap = "",
        mapKeyTitle = "",
        mapKeyColor = "",
        mapKeyInitialValue = false,
        mapKeyCreatedAt = "",
        mapKeyUpdatedAt = "",
    } = {}) {
        this.mapKeyId = mapKeyId;
        this.mapKeyUser = mapKeyUser;
        this.mapKeyMap = mapKeyMap;
        this.mapKeyTitle = mapKeyTitle;
        this.mapKeyColor = mapKeyColor;
        this.mapKeyInitialValue = mapKeyInitialValue;
        this.mapKeyCreatedAt = mapKeyCreatedAt;
        this.mapKeyUpdatedAt = mapKeyUpdatedAt;
    }

}