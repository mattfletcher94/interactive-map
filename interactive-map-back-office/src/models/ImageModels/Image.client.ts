export default class ImageClient {

    public imageId = "";
    public imageUser = "";
    public imageName = "";
    public imagePath = "";
    public imagePathThumbnail = "";

    constructor({
        imageId = "", 
        imageUser = "",
        imageName = "",
        imagePath = "",
        imagePathThumbnail = "",
    } = {}) {
        this.imageId = imageId;
        this.imageUser = imageUser;
        this.imageName = imageName;
        this.imagePath = imagePath;
        this.imagePathThumbnail = imagePathThumbnail;
    }


}