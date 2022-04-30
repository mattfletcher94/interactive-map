import '../../env';
import request from 'supertest';
import { expect } from 'chai';
import { server } from '../../server';
import { IUserClient, User } from '../../models/User';
import { IImageClient, Image } from '../../models/Image';
import UsersRepository from '../../repositories/UsersRepository';
import ImageRepository from '../../repositories/ImageRepository';


describe('Images Controller', () => {


    // Globals
    let req = null as any;
    let serv = null as any;
    let user = {} as IUserClient;
    let image = {} as IImageClient;
    var jwt = "" as string;
    

    /**
     * Succesfully gets user images
     */
    it('GET:200 images/', () => {
        return req.get('/images').set('Authorization', 'Bearer ' + jwt).expect((res : any) => {
            expect(res.body.data).to.be.an('array');
        }).expect(200);
    });
    
    /**
     * Succesfully gets one user image
     */
    it('GET:200 images/:id/', () => {
        return req.get('/images/' + image.imageId.toString()).set('Authorization', 'Bearer ' + jwt).expect((res : any) => {
            expect(res.body.data.imageId.toString()).to.be.equal(image.imageId.toString());
            expect(res.body.data.imageName).to.be.equal(image.imageName);
            expect(res.body.data.imageUser.toString()).to.be.equal(user.userId.toString());
        }).expect(200);
    });

    /**
     * Unsuccesfully gets one user image
     */
    it('GET:404 images/:id/', () => {
        return req.get('/images/' + "123456789123456789123456").set('Authorization', 'Bearer ' + jwt).expect((res : any) => {
        }).expect(404);
    });

    /**
     * Succesfully delete one user image
     */
    it('DELETE:201 images/:id/', () => {
        return req.delete('/images/' + image.imageId.toString()).set('Authorization', 'Bearer ' + jwt).expect((res : any) => {
        }).expect(201);
    });

    /**
     * Unsuccesfully delete one user image
     */
    it('DELETE:404 images/:id/', () => {
        return req.delete('/images/' + "123456789123456789123456").set('Authorization', 'Bearer ' + jwt).expect((res : any) => {
        }).expect(404);
    });

    /**
     * Before running tets, start up the server
     * Delete all users from test database
     * and then create a new one for testing
     */
    before(function(done) {
        serv = server.listen();
        req = request.agent(server);
        User.deleteMany({}, async () => {
            await Image.deleteMany({}, async () => {
				const repo = new UsersRepository();
				user = await repo.create({
					userFirstName: "test",
					userLastName: "test",
					userEmail: "test@test.com",
					userPassword: "testpassword12345",
				});
				const imageRepo = new ImageRepository();
				image = await imageRepo.create(user.userId, {
					imageName: "test",
					imageBase64: "test",
				});
				jwt = await repo.login({
					userEmail: "test@test.com",
					userPassword: "testpassword12345",
				});
				done();
			});
            
        });
    });

    /**
     * After running tests, disconnected from server
     */
    after(function(done){
        server.close(done);
    });

});