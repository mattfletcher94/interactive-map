import '../../env';
import fs from 'fs';
import chai, { expect } from 'chai';
import mongoose from 'mongoose';
import RepositoryFactory from '../../repositories/RepositoryFactory';
import RepositoryValidationError from '../../repositories/errors/RepositoryValidationError';
import RepositoryNotFoundError from '../../repositories/errors/RepositoryNotFoundError';
import { Image } from '../../models/Image';
import { Map } from '../../models/Map';
import { MapMarker } from '../../models/MapMarker';
import { User } from '../../models/User';

// Use chai as promised
chai.use(require('chai-as-promised'));


/**
 * Test the MapMarkersRepository
 */
describe('MapMarkersRepository', () => {

    // Define globals
    let userId = "";
    let mapId = "";

    it("Creates a valid document", async () => {
        const repo = new RepositoryFactory().getMapMarkersRepository();
        const document = await repo.create(userId, {
            mapMarkerMap: mapId,
            mapMarkerName: "test",
            mapMarkerPositionX: 200,
            mapMarkerPositionY: 200,
        });
        expect(document.mapMarkerMap.toString()).to.equal(mapId.toString());
        expect(document.mapMarkerName).to.equal("test");
        expect(document.mapMarkerPositionX).to.equal(200);
        expect(document.mapMarkerPositionY).to.equal(200);
    });

    it("Throws an error when creating an invalid document", async () => {
        const repo = new RepositoryFactory().getMapMarkersRepository();
        await expect(repo.create(userId, {
            mapMarkerMap: mapId.toString(),
            mapMarkerName: "test",
            mapMarkerPositionX: <unknown>null as number,
            mapMarkerPositionY: 200,
        })).to.eventually.be.rejectedWith(RepositoryValidationError);
    });

    it("Gets all markers for a specific map", async () => {
        const repo = new RepositoryFactory().getMapMarkersRepository();
        const documents = await repo.getByUserIdAndMapId(userId.toString(), mapId.toString());
        expect(documents).to.be.an("array");
    });

    it("Gets one by its id", async () => {

        // Create an item first
        const repo = new RepositoryFactory().getMapMarkersRepository();
        const created = await repo.create(userId.toString(), {
            mapMarkerMap: mapId.toString(),
            mapMarkerName: "test",
            mapMarkerPositionX: 200,
            mapMarkerPositionY: 200,
        });

        // Get the item
        const document = await repo.getOneByUserIdAndMapId(userId.toString(), created.mapMarkerMap.toString(), created.mapMarkerId.toString());
        expect(document.mapMarkerMap.toString()).to.equal(mapId.toString());
        expect(document.mapMarkerName).to.equal("test");
        expect(document.mapMarkerPositionX).to.equal(200);
        expect(document.mapMarkerPositionY).to.equal(200);

    });

    it("Throws an error when getting a document that doesn't exist", async () => {
        const repo = new RepositoryFactory().getMapMarkersRepository();
        await expect(repo.getOneByUserIdAndMapId(userId, mapId, "123456789123456789123456")).to.eventually.be.rejectedWith(RepositoryNotFoundError);
    });

    it("Update a document with valid data", async () => {

        // Create a document first
        const repo = new RepositoryFactory().getMapMarkersRepository();
        const created = await repo.create(userId.toString(), {
            mapMarkerMap: mapId.toString(),
            mapMarkerName: "test",
            mapMarkerPositionX: 200,
            mapMarkerPositionY: 200,
        });

        // Update
        const updated = await repo.update(userId.toString(), created.mapMarkerId.toString(), {
            mapMarkerName: "Updated",
        });

        // Expect new name
        expect(updated.mapMarkerName).to.equal("Updated");

    });

    it("Update a document that doesn't exist", async () => {
        const repo = new RepositoryFactory().getMapMarkersRepository();
        await expect(repo.update(userId.toString(), "123456789123456789123456", {
            mapMarkerName: "New name",
        })).to.eventually.be.rejectedWith(RepositoryNotFoundError);
    });

    it("Delete a document", async () => {

        // Create an image first
        const repo = new RepositoryFactory().getMapMarkersRepository();
        const created = await repo.create(userId.toString(), {
            mapMarkerMap: mapId.toString(),
            mapMarkerName: "test",
            mapMarkerPositionX: 200,
            mapMarkerPositionY: 200,
        });

        // Update
        const deleted = await repo.delete(userId.toString(), created.mapMarkerId.toString());

        // Expect to be true
        expect(deleted).to.be.true;

    });

    // Delete an image document that doesn't exist
    it("Throws an error when deleting a document that doesn't exist", async () => {
        const repo = new RepositoryFactory().getMapMarkersRepository();
        await expect(repo.delete(userId.toString(), "123456789123456789123456")).to.eventually.be.rejectedWith(RepositoryNotFoundError);
    });

    /**
     * Before running tets, connect to mongoose database
     * and create a temporary user
     */
    before(function(done) {
        mongoose.connect(process.env.DB_CONNECTION as string, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
            Image.deleteMany({}).then(() => {
                Map.deleteMany({}).then(() => {
                    MapMarker.deleteMany({}).then(() => {
                        User.deleteMany({}).then(() => {
                            const user = new User({
                                userFirstName: "Test",
                                userLastName: "User",
                                userEmail: "testuser@test.com",
                                userPassword: "testpassword"
                            });
                            user.save().then((userData) => {
                                userId = userData._id.toString();

                                const image = new Image({
                                    imageUser: userId,
                                    imageName: "Test image",
                                    imageBase64: "img",
                                    imageBase64Thumbnail: "img",
                                });
                                image.save().then((imageData) => {
                                    const map = new Map({
                                        mapTitle: "test",
                                        mapImage: imageData ._id.toString()
                                    });
                                    map.save().then((mapData) => {
                                        mapId = mapData._id.toString();
                                        done();
                                    })

                                });
                            });
                        });
                    })
                });
            });
        }).catch((err) => {
            console.log(err);
        });
    });

    /**
     * After running tests, disconnected from mongoose
     */
    after(function(done){
        mongoose.disconnect().then(() => {
            if (userId) {
                fs.rmdirSync('uploads/' + userId, { recursive: true });
            }
            done();
        });
    });

});