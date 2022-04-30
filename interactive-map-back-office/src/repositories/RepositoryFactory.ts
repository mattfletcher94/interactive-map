import ImagesRepository from "./ImagesRepository";
import MapKeysRepository from "./MapKeysRepository";
import MapMarkersRepository from "./MapMarkersRepository";
import MapsRepository from "./MapsRepository";
import PitchedUnitsRepository from "./PitchedUnitsRepository";
import UsersRepository from "./UserRepository";


export default class RepositoryFactory {

    public constructor() {

    }

    public getUsersRepository(): UsersRepository {
        return new UsersRepository("users");
    }
    
    public getMapsRepository(): MapsRepository {
        return new MapsRepository('maps');
    }

    public getImagesRepository(): ImagesRepository {
        return new ImagesRepository('images');
    }
    
    public getMapMarkersRepository(mapId: string): MapMarkersRepository {
        return new MapMarkersRepository('maps/' + mapId + '/markers');
    }

    public getMapKeysRepository(mapId: string): MapKeysRepository {
        return new MapKeysRepository('maps/' + mapId + '/keys');
    }

    public getPitchedUnitsRepository(pitchedBookingURL: string): PitchedUnitsRepository {
        return new PitchedUnitsRepository(pitchedBookingURL);
    }
}