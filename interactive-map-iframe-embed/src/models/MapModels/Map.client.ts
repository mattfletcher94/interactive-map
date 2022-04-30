import ImageClient from "../ImageModels/Image.client";


export default class MapClient {

    public mapId : string = "";
    public mapUser: string = "";
    public mapImage: ImageClient | null = null;
    public mapTitle: string = "";
    public mapDescription: string = "";
    public mapPitchedBookingEnabled: boolean = false;
    public mapPitchedBookingURL: string = "";

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