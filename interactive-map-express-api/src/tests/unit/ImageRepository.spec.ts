import '../../env';
import fs from 'fs'
import chai, { expect } from 'chai';
import mongoose from 'mongoose';
import RepositoryValidationError from '../../repositories/errors/RepositoryValidationError';
import RepositoryNotFoundError from '../../repositories/errors/RepositoryNotFoundError';
import RepositoryFactory from '../../repositories/RepositoryFactory';
import { User } from '../../models/User';
import { Image } from '../../models/Image';

// Use chai as promised
chai.use(require('chai-as-promised'));


/**
 * Test the imageRespository
 */
describe('ImageRepository', () => {

    const base64Img = "PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6c3ZnanM9Imh0dHA6Ly9zdmdqcy5jb20vc3ZnanMiIHZlcnNpb249IjEuMSIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHg9IjAiIHk9IjAiIHZpZXdCb3g9IjAgMCA0MTMuMDk5IDQxMy4wOTkiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTIwNi41NDksMEwyMDYuNTQ5LDBjLTgyLjYsMC0xNDkuMyw2Ni43LTE0OS4zLDE0OS4zYzAsMjguOCw5LjIsNTYuMywyMiw3OC44OTlsOTcuMywxNjguMzk5YzYuMSwxMSwxOC40LDE2LjUsMzAsMTYuNSAgICBjMTEuNjAxLDAsMjMuMy01LjUsMzAtMTYuNWw5Ny4zLTE2OC4yOTljMTIuOS0yMi42MDEsMjItNDkuNjAxLDIyLTc4LjkwMUMzNTUuODQ5LDY2LjgsMjg5LjE0OSwwLDIwNi41NDksMHogTTIwNi41NDksMTkzLjQgICAgYy0zMCwwLTU0LjUtMjQuNS01NC41LTU0LjVzMjQuNS01NC41LDU0LjUtNTQuNXM1NC41LDI0LjUsNTQuNSw1NC41QzI2MS4wNDksMTY5LDIzNi41NDksMTkzLjQsMjA2LjU0OSwxOTMuNHoiIGZpbGw9IiM0YTllZDgiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiLz4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8L2c+PC9zdmc+Cg==";

    // Define the user Id
    let userId = "";

    it("Creates a valid document", async () => {
        const repo = new RepositoryFactory().getImageRepository();
        const image = await repo.create(userId, {
            imageName: "test name",
            imageBase64: base64Img,
        });
        expect(image.imageName).to.equal("test name");
    });

    it("Throws an error when creating an invalid document", async () => {
        const repo = new RepositoryFactory().getImageRepository();
        await expect(repo.create(userId, {
        } as any)).to.eventually.be.rejectedWith(RepositoryValidationError);
    });

    it("Gets all documents", async () => {
        const repo = new RepositoryFactory().getImageRepository();
        const documents = await repo.getByUserId(userId);
        expect(documents).to.be.an("array");
    });

    it("Gets a document by its id", async () => {

        // Create an image first
        const repo = new RepositoryFactory().getImageRepository();
        const created = await repo.create(userId, {
            imageName: "test name",
            imageBase64: base64Img,
        });

        // Get the image
        const document = await repo.getOneByUserId(userId, created.imageId);
        expect(document.imageId.toString()).to.equal(created.imageId.toString());
        expect(document.imageName).to.equal(created.imageName);

    });

    it("Throws an error when getting a document that doesn't exist", async () => {
        const repo = new RepositoryFactory().getImageRepository();
        await expect(repo.getOneByUserId(userId, "123456789123456789123456")).to.eventually.be.rejectedWith(RepositoryNotFoundError);
    });

    it("Update a document with valid data", async () => {

        // Create an image first
        const repo = new RepositoryFactory().getImageRepository();
        const created = await repo.create(userId, {
            imageName: "test name",
            imageBase64: base64Img,
        });

        // Update
        const updated = await repo.update(userId, created.imageId, {
            imageName: "Updated",
        });

        // Expect new name
        expect(updated.imageName).to.equal("Updated");

    });

    it("Update a document that doesn't exist", async () => {
        const repo = new RepositoryFactory().getImageRepository();
        await expect(repo.update(userId, "123456789123456789123456", {
            imageName: "New name",
        })).to.eventually.be.rejectedWith(RepositoryNotFoundError);
    });

    it("Delete a document", async () => {

        // Create an image first
        const repo = new RepositoryFactory().getImageRepository();
        const created = await repo.create(userId, {
            imageName: "test name",
            imageBase64: base64Img,
        });

        // Update
        const deleted = await repo.delete(userId, created.imageId);

        // Expect to be true
        expect(deleted).to.be.true;

    });

    it("Throws an error when deleting a document that doesn't exist", async () => {
        const repo = new RepositoryFactory().getImageRepository();
        await expect(repo.delete(userId, "123456789123456789123456")).to.eventually.be.rejectedWith(RepositoryNotFoundError);
    });

    /**
     * Before running tets, connect to mongoose database
     * and create a temporary user
     */
    before(function(done) {
        mongoose.connect(process.env.DB_CONNECTION as string, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
            Image.deleteMany({}).then(() => {
                User.deleteMany({}).then(() => {
                    const user = new User({
                        userFirstName: "Test",
                        userLastName: "User",
                        userEmail: "testuser@test.com",
                        userPassword: "testpassword"
                    });
                    user.save().then((data) => {
                        userId = data._id.toString();
                        done();
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
            fs.rmdirSync('uploads/' + userId, { recursive: true });
            done();
        });
    });

});