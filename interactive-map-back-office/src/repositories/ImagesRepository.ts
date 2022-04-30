import ImageClient from "@/models/ImageModels/Image.client";
import ImageCreate from "@/models/ImageModels/Image.create";
import ImageUpdate from "@/models/ImageModels/Image.update";
import BaseRepository from "./BaseRepository";
import IResponseCreate from "./responses/IResponseCreate";


export default class ImagesRepository extends BaseRepository<ImageClient, ImageCreate, ImageUpdate> {

    /**
     * @Override
     * Create a new item
     * Possible responses: is201, is400
     */
    async create(model: ImageCreate) {
        const { data } = await this.axiosClient.post<IResponseCreate<ImageClient>>("/", model);
        return data;
    }

}