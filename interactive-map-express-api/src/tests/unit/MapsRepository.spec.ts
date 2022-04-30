import '../../env';
import chai, { expect } from 'chai';
import mongoose from 'mongoose';
import RepositoryFactory from '../../repositories/RepositoryFactory';
import RepositoryValidationError from '../../repositories/errors/RepositoryValidationError';
import RepositoryNotFoundError from '../../repositories/errors/RepositoryNotFoundError';
import { Image } from '../../models/Image';
import { Map } from '../../models/Map';
import { User } from '../../models/User';

// Use chai as promised
chai.use(require('chai-as-promised'));


/**
 * Test the MapsRepository
 */
describe('MapsRepository', () => {

    // Define globals
    let userId = "";
    let imageId = "";

    it("Creates a valid document", async () => {
        const repo = new RepositoryFactory().getMapsRepository();
        const document = await repo.create(userId, {
            mapImage: imageId,
            mapTitle: "Test title",
            mapDescription: "Test description",
        });
        expect(document.mapImage?.imageId.toString()).to.equal(imageId.toString());
        expect(document.mapTitle).to.equal("Test title");
        expect(document.mapDescription).to.equal("Test description");
    });

    it("Throws an error when creating an invalid document", async () => {
        const repo = new RepositoryFactory().getMapsRepository();
        await expect(repo.create(userId, {
            mapImage: imageId,
            mapTitle: "",
        })).to.eventually.be.rejectedWith(RepositoryValidationError);
    });

    it("Gets all", async () => {
        const repo = new RepositoryFactory().getMapsRepository();
        const documents = await repo.getByUserId(userId);
        expect(documents).to.be.an("array");
    });

    it("Gets one by its id", async () => {

        // Create an item first
        const repo = new RepositoryFactory().getMapsRepository();
        const created = await repo.create(userId, {
            mapImage: imageId,
            mapTitle: "Test title",
            mapDescription: "Test description"
        });

        // Get the item
        const document = await repo.getOneByUserId(userId, created.mapId);
        expect(document.mapImage?.imageId.toString()).to.equal(imageId.toString());
        expect(document.mapTitle).to.equal(created.mapTitle);
        expect(document.mapDescription).to.equal(created.mapDescription);

    });

    it("Throws an error when getting a document that doesn't exist", async () => {
        const repo = new RepositoryFactory().getMapsRepository();
        await expect(repo.getOne("123456789123456789123456")).to.eventually.be.rejectedWith(RepositoryNotFoundError);
    });

    it("Update a document with valid data", async () => {

        // Create an image first
        const repo = new RepositoryFactory().getMapsRepository();
        const created = await repo.create(userId, {
            mapImage: imageId,
            mapTitle: "Test title",
            mapDescription: "Test description"
        });

        // Update
        const updated = await repo.update(userId, created.mapId, {
            mapTitle: "Updated",
        });

        // Expect new name
        expect(updated.mapTitle).to.equal("Updated");

    });

    it("Update a document that doesn't exist", async () => {
        const repo = new RepositoryFactory().getMapsRepository();
        await expect(repo.update(userId, "123456789123456789123456", {
            mapTitle: "New name",
        })).to.eventually.be.rejectedWith(RepositoryNotFoundError);
    });

    it("Delete a document", async () => {

        // Create an image first
        const repo = new RepositoryFactory().getMapsRepository();
        const created = await repo.create(userId, {
            mapImage: imageId,
            mapTitle: "test name",
            mapDescription: "test description",
        });

        // Update
        const deleted = await repo.delete(userId, created.mapId);

        // Expect to be true
        expect(deleted).to.be.true;

    });

    // Delete an image document that doesn't exist
    it("Throws an error when deleting a document that doesn't exist", async () => {
        const repo = new RepositoryFactory().getMapsRepository();
        await expect(repo.delete(userId, "123456789123456789123456")).to.eventually.be.rejectedWith(RepositoryNotFoundError);
    });

    /**
     * Before running tets, connect to mongoose database
     * and create a temporary user
     */
    before(function(done) {
        mongoose.connect(process.env.DB_CONNECTION as string, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
            Image.deleteMany({}).then(() => {
                Map.deleteMany({}).then(() => {
                    User.deleteMany({}).then(() => {
                        const user = new User({
                            userFirstName: "Test",
                            userLastName: "User",
                            userEmail: "testuser@test.com",
                            userPassword: "testpassword"
                        });
                        user.save().then((data) => {
                            userId = data._id.toString();

                            const image = new Image({
                                imageUser: userId,
                                imageName: "Test image",
                                imageBase64: "img",
                                imageBase64Thumbnail: "img",
                            });
                            image.save().then((data) => {
                                imageId = data._id.toString();
                                done();
                            });
                        });
                    });
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
            done();
        });
    });

});