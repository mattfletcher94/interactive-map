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
describe('UsersRepository', () => {

    // Define globals
    let userId = "";
    let imageId = "";

    it("Creates a valid document", async () => {
        const repo = new RepositoryFactory().getUsersRepository();
        const document = await repo.create({
            userFirstName: "FirstName",
            userLastName: "LastName",
            userEmail: "test@test.com",
            userPassword: "testpassword12345",
        });
        expect(document.userFirstName).to.equal("FirstName");
        expect(document.userLastName).to.equal("LastName");
        expect(document.userEmail).to.equal("test@test.com");
    });

    it("Throws an error when creating an invalid document", async () => {
        const repo = new RepositoryFactory().getUsersRepository();
        await expect(repo.create({
            userEmail: null as never as string,
            userPassword: null as never as string,
            userFirstName: "FirstName",
            userLastName: "LastName",
        })).to.eventually.be.rejectedWith(RepositoryValidationError);
    });


    it("Gets one by its id", async () => {

        // Create an item first
        const repo = new RepositoryFactory().getUsersRepository();
        const created = await repo.create({
            userFirstName: "FirstName",
            userLastName: "LastName",
            userEmail: "test@test2.com",
            userPassword: "testpassword12345",
        });

        // Get the item
        const document = await repo.getOne(created.userId);
        expect(document.userFirstName).to.equal("FirstName");
        expect(document.userLastName).to.equal("LastName");
        expect(document.userEmail).to.equal("test@test2.com");
    });

    it("Throws an error when getting a document that doesn't exist", async () => {
        const repo = new RepositoryFactory().getUsersRepository();
        await expect(repo.getOne("123456789123456789123456")).to.eventually.be.rejectedWith(RepositoryNotFoundError);
    });

    it("Logs in succesfully", async () => {

        // Create an item first
        const repo = new RepositoryFactory().getUsersRepository();
        await repo.create({
            userFirstName: "FirstName",
            userLastName: "LastName",
            userEmail: "test@test3.com",
            userPassword: "testpassword12345",
        });

        // Get the item
        const token = await repo.login({
            userEmail: "test@test3.com",
            userPassword: "testpassword12345"
        });
        expect(token).to.not.be.empty;
    });

    it("Throws an error when logging in unsuccessfully", async () => {
        const repo = new RepositoryFactory().getUsersRepository();
        await expect(repo.login({
            userEmail: "thisemaildoesntexist@test.com",
            userPassword: "testpassword12345"
        })).to.eventually.be.rejectedWith(RepositoryValidationError);
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