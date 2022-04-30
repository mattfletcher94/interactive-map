import MapMarkerClient from "@/models/MapMarkerModels/MapMarker.client";
import MapMarkerCreate from "@/models/MapMarkerModels/MapMarker.create";
import MapMarkerUpdate from "@/models/MapMarkerModels/MapMarker.update";
import BaseRepository from "./BaseRepository";


export default class MapsRepository extends BaseRepository<MapMarkerClient, MapMarkerCreate, MapMarkerUpdate> {

}