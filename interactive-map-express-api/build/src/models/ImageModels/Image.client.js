"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ImageClient {
    constructor({ imageId = "", imageUser = "", imageName = "", imagePath = "", imageCreatedAt = "", imageUpdatedAt = "", } = {}) {
        this.imageId = "";
        this.imageUser = "";
        this.imageName = "";
        this.imagePath = "";
        this.imageCreatedAt = "";
        this.imageUpdatedAt = "";
        this.imageId = imageId;
        this.imageUser = imageUser;
        this.imageName = imageName;
        this.imagePath = imagePath;
        this.imageCreatedAt = imageCreatedAt;
        this.imageUpdatedAt = imageUpdatedAt;
    }
}
exports.default = ImageClient;
