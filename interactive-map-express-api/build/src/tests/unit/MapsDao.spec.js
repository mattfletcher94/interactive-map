"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../env");
/*
describe('Maps DAO', () => {

    let userId = "";
    let validMap = {
        mapTitle: "My Map Title",
        mapDescription: "Map Description",
        mapImage: mongoose.Types.ObjectId().toHexString(),
    }
    let invalidMap = {
        mapTitle: "",
        mapDescription: "",
        mapImage: mongoose.Types.ObjectId().toHexString(),
    }
    
    before(function(done) {
        mongoose.connect(process.env.DB_CONNECTION_TEST as string, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
            User.deleteMany({}, () => {
                const user = new User({
                    userFirstName: "Test",
                    userLastName: "User",
                    userEmail: "testuser@test.com",
                    userPassword: "testpassword"
                });
                user.save().then((data) => {
                    userId = data._id;
                    done();
                });
            });
        }).catch((err) => {
            console.log(err);
        });
    });

    after(function(done){
        mongoose.disconnect().then(() => {
            done();
        });
    });

    it("Create map with validation errors", async () => {
        const res = await new MapsDAO().create(userId, invalidMap);
        expect(res.VALIDATION_ERRORS.length).be.be.greaterThan(0);
        return expect(res.VALIDATION_ERROR).to.be.true;
    });


    it('Gets all maps', async () => {
        const res = await new MapsDAO().getAll(userId);

        return expect(res.DATA).to.be.an('array');
    });

});*/ 
