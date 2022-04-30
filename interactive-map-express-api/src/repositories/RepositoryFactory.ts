import ImageRepository from "./ImageRepository";
import MapsRepository from "./MapsRepository";
import UsersRepository from "./UsersRepository";
import MapMarkersRepository from "./MapMarkersRepository";
import MapKeysRepository from "./MapKeysRepository";

export default class RepositoryFactory {

    public getImageRepository() : ImageRepository {
        return new ImageRepository();
    }

    public getMapsRepository() : MapsRepository {
        return new MapsRepository();
    }

    public getMapMarkersRepository() : MapMarkersRepository {
        return new MapMarkersRepository();
    }
    
    public getMapKeysRepository() : MapKeysRepository {
        return new MapKeysRepository();
    }

    public getUsersRepository() : UsersRepository {
        return new UsersRepository();
    }
}