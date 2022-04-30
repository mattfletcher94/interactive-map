export default class ImageClient {

    public imageId : string = "";
    public imageUser: string = "";
    public imageName: string = "";
    public imagePath: string = "";
    public imagePathThumbnail: string = "";
    public imageCreatedAt: string = "";
    public imageUpdatedAt: string = "";

    constructor({
        imageId = "", 
        imageUser = "",
        imageName = "",
        imagePath = "",
        imagePathThumbnail = "",
        imageCreatedAt = "",
        imageUpdatedAt = "",
    } = {}) {
        this.imageId = imageId;
        this.imageUser = imageUser;
        this.imageName = imageName;
        this.imagePath = imagePath;
        this.imagePathThumbnail = imagePathThumbnail;
        this.imageCreatedAt = imageCreatedAt;
        this.imageUpdatedAt = imageUpdatedAt;
    }


}