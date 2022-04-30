import RepositoryNotFoundError from "./errors/RepositoryNotFoundError";
import RepositoryValidationError from "./errors/RepositoryValidationError";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser, IUserCreate, User, IUserLogin, IUserUpdate } from "../models/User";
import { Map, IMap, IMapCreate, IMapUpdate } from "../models/Map";
import { MapMarker, IMapMarker, IMapMarkerCreate, IMapMarkerUpdate, IMapMarkerClient } from "../models/MapMarker";
import { MapKey } from "../models/MapKey";
import { Image } from "../models/Image";

export default class UsersRepository {
    
    /**
     * Create a new user
     */
    async create(model : IUserCreate) {
        try {

            const document = new User({
                userEmail: model.userEmail,
                userFirstName: model.userFirstName,
                userLastName: model.userLastName,
                userPassword: model.userPassword,
            } as IUser);

            // Is user valid?
            await document.validate();
            
            // Create hash password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(document.userPassword, salt);

            // Set the hashed password
            document.userPassword = hash;

            // Save user
            const savedDocument = await document.save();

            // Return document
            return savedDocument.toClient();

        } catch (err) {
            if (err && err.name === 'ValidationError') {
                throw new RepositoryValidationError("The item could not be created.", Object.keys(err.errors).map((k : any) => {
                    return { field: err.errors[k].properties.path, message: err.errors[k].properties.message }
                }));
            } else {
                throw err;
            }
        }
    }
    
	
    /**
     * Update a user
     * @param userId 
     * @param model 
     */
	 async update(userId: string, model: IUserUpdate) {
        try {

            // Find document
            const document = await User.findOne({ _id: userId }).orFail();

            // Set new attributes
			document.userFirstName = model.userFirstName === undefined ? document.userFirstName : model.userFirstName;
			document.userLastName = model.userLastName === undefined ? document.userLastName : model.userLastName;
			document.userEmail = model.userEmail === undefined ? document.userEmail : model.userEmail;
			
			// Hash new password if needed
			if (model.userPassword !== undefined) {
				const salt = await bcrypt.genSalt(10);
				const hash = await bcrypt.hash(model.userPassword, salt);
				document.userPassword = hash;
			} else {
				document.userPassword = document.userPassword;
			}

            // Validate  new fields
            await document.validate();

            // Save now document
            const savedDocument = await document.save();

            // Return new document
            return savedDocument.toClient();

        } catch (err) {
            if (err && err.name === 'ValidationError') {
                throw new RepositoryValidationError("The item could not be updated.", Object.keys(err.errors).map((k : any) => {
                    return { field: err.errors[k].properties.path, message: err.errors[k].properties.message }
                }));
            } else if (err.name == "DocumentNotFoundError") {
                throw new RepositoryNotFoundError("The item could not be found.");
            } else {
                throw err;
            }
        }
    }

    /**
     * Login a user
     */
    async login(model : IUserLogin) : Promise<string> {

        // If user email wasn't provided
        if (!model.userEmail) {
            throw new RepositoryValidationError("Could not login.", [
                { field: "userEmail", message: "Email address is required."}
            ]);
        }

        // If user password wasn't provided
        if (!model.userPassword) {
            throw new RepositoryValidationError("Could not login.", [
                { field: "userPassword", message: "Password is required."}
            ]);
        }

        // Find user by email
        try {

            // find document
            const document = await User.findOne({ userEmail: model.userEmail }).orFail();

            // Compare password using bcrypt
            const validPass = await bcrypt.compare(model.userPassword, document.userPassword);

            // If password is valid
            if (validPass) {

                // Logged in successfully, so create a JWT token
                const token = jwt.sign({
                    userId: document?._id,
                    userRole: document?.userRole,
                }, process.env.TOKEN_SECRET as string, {
                    issuer: 'Interactive Map API',
                    audience: 'admin.mattfletcher.name',
                    expiresIn: '600m',
                });

                // Return the token
                return token;

            }

            // Password is invalid
            else {
                throw new RepositoryValidationError("Could not login.", [
                    { field: "userPassword", message: "Password is incorrect."}
                ]);
            }

        } catch (err) {
            if (err.name == "DocumentNotFoundError") {
                throw new RepositoryValidationError("Could not login.", [
                    { field: "userEmail", message: "Email address not recognised."}
                ]);
            } else {
                throw err;
            }
        }
        
    }

    /**
     * Get one user
     */
    async getOne(id : string) {
        try {
            const document = await User.findOne({ _id: id }).orFail();
            return document.toClient();
            //return this.mongooseToClient(document);
        } catch (err) {
            if (err.name == "DocumentNotFoundError") {
                throw new RepositoryNotFoundError("The item could not be found.");
            } else {
                throw err;
            }
        }
    }

    /**
     * Delete a user 
     */
	 async delete(userId : string) {
        try {
            const document = await User.findOne({ _id: userId }).orFail();
            await document.deleteOne();
			await Map.deleteMany({ mapUser: userId });
			await MapMarker.deleteMany({ mapMarkerUser: userId });
			await MapKey.deleteMany({ mapKeyUser: userId });
			await Image.deleteMany({ imageUser: userId });
            return true;
        } catch (err) {
            if (err.name == "DocumentNotFoundError") {
                throw new RepositoryNotFoundError("The item could not be found.");
            } else {
                throw err;
            }
        }
    }
}