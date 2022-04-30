import MapClient from "@/models/MapModels/Map.client";
import MapCreate from "@/models/MapModels/Map.create";
import MapUpdate from "@/models/MapModels/Map.update";
import BaseRepository from "./BaseRepository";
import IResponse from "./responses/IResponse";


export default class MapsRepository extends BaseRepository<MapClient, MapCreate, MapUpdate> {

}