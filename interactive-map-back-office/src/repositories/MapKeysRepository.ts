import MapKeyClient from "@/models/MapKeyModels/MapKey.client";
import MapKeyCreate from "@/models/MapKeyModels/MapKey.create";
import MapKeyUpdate from "@/models/MapKeyModels/MapKey.update";
import BaseRepository from "./BaseRepository";


export default class MapsRepository extends BaseRepository<MapKeyClient, MapKeyCreate, MapKeyUpdate> {

}