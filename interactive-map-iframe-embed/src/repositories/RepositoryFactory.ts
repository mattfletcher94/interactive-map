import MapKeysRepository from "./MapKeysRepository";
import MapMarkersRepository from "./MapMarkersRepository";
import MapsRepository from "./MapsRepository";
import PitchedRepository from "./PitchedRepostiory";


export default class RepositoryFactory {

    public constructor() {

    }

    public getMapsRepository() : MapsRepository {
        return new MapsRepository('public/maps');
    }

    public getMapMarkersRepository(mapId : string) : MapMarkersRepository {
        return new MapMarkersRepository('public/maps/' + mapId + '/markers');
    }

    public getMapKeysRepository(mapId : string) : MapKeysRepository {
        return new MapKeysRepository('public/maps/' + mapId + '/keys');
    }

    public getPitchedRepository(pitchedBookingURL : string) : PitchedRepository {
        return new PitchedRepository(pitchedBookingURL);
    }
}