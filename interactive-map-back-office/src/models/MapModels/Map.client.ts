import ImageClient from "../ImageModels/Image.client";


export default class MapClient {

    public mapId = "";
    public mapUser = "";
    public mapImage: ImageClient | null = null;
    public mapTitle = "";
    public mapDescription = "";
    public mapPitchedBookingEnabled = false;
    public mapPitchedBookingURL = "";

    constructor({
        mapId = "", 
        mapUser = "",
        mapImage = new ImageClient(),
        mapTitle = "",
        mapDescription = "",
        mapPitchedBookingEnabled = false,
        mapPitchedBookingURL = "",
    } = {}) {
        this.mapId = mapId;
        this.mapUser = mapUser;
        this.mapImage = mapImage;
        this.mapTitle = mapTitle;
        this.mapDescription = mapDescription;
        this.mapPitchedBookingEnabled = mapPitchedBookingEnabled;
        this.mapPitchedBookingURL = mapPitchedBookingURL;
    }

}