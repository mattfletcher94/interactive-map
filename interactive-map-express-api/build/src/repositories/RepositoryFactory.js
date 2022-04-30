"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ImageRepository_1 = __importDefault(require("./ImageRepository"));
const MapsRepository_1 = __importDefault(require("./MapsRepository"));
const UsersRepository_1 = __importDefault(require("./UsersRepository"));
const MapMarkersRepository_1 = __importDefault(require("./MapMarkersRepository"));
const MapKeysRepository_1 = __importDefault(require("./MapKeysRepository"));
class RepositoryFactory {
    getImageRepository() {
        return new ImageRepository_1.default();
    }
    getMapsRepository() {
        return new MapsRepository_1.default();
    }
    getMapMarkersRepository() {
        return new MapMarkersRepository_1.default();
    }
    getMapKeysRepository() {
        return new MapKeysRepository_1.default();
    }
    getUsersRepository() {
        return new UsersRepository_1.default();
    }
}
exports.default = RepositoryFactory;
