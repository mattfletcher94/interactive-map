export default class MapKeyClient {

    public mapKeyId = "";
    public mapKeyUser = "";
    public mapKeyMap = "";
    public mapKeyTitle = "";
    public mapKeyColor = "";
    public mapKeyInitialValue = false;
    public mapKeyCreatedAt = "";
    public mapKeyUpdatedAt = "";

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