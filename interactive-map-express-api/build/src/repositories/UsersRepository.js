"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RepositoryNotFoundError_1 = __importDefault(require("./errors/RepositoryNotFoundError"));
const RepositoryValidationError_1 = __importDefault(require("./errors/RepositoryValidationError"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const Map_1 = require("../models/Map");
const MapMarker_1 = require("../models/MapMarker");
const MapKey_1 = require("../models/MapKey");
const Image_1 = require("../models/Image");
class UsersRepository {
    /**
     * Create a new user
     */
    create(model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = new User_1.User({
                    userEmail: model.userEmail,
                    userFirstName: model.userFirstName,
                    userLastName: model.userLastName,
                    userPassword: model.userPassword,
                });
                // Is user valid?
                yield document.validate();
                // Create hash password
                const salt = yield bcryptjs_1.default.genSalt(10);
                const hash = yield bcryptjs_1.default.hash(document.userPassword, salt);
                // Set the hashed password
                document.userPassword = hash;
                // Save user
                const savedDocument = yield document.save();
                // Return document
                return savedDocument.toClient();
            }
            catch (err) {
                if (err && err.name === 'ValidationError') {
                    throw new RepositoryValidationError_1.default("The item could not be created.", Object.keys(err.errors).map((k) => {
                        return { field: err.errors[k].properties.path, message: err.errors[k].properties.message };
                    }));
                }
                else {
                    throw err;
                }
            }
        });
    }
    /**
     * Update a user
     * @param userId
     * @param model
     */
    update(userId, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find document
                const document = yield User_1.User.findOne({ _id: userId }).orFail();
                // Set new attributes
                document.userFirstName = model.userFirstName === undefined ? document.userFirstName : model.userFirstName;
                document.userLastName = model.userLastName === undefined ? document.userLastName : model.userLastName;
                document.userEmail = model.userEmail === undefined ? document.userEmail : model.userEmail;
                // Hash new password if needed
                if (model.userPassword !== undefined) {
                    const salt = yield bcryptjs_1.default.genSalt(10);
                    const hash = yield bcryptjs_1.default.hash(model.userPassword, salt);
                    document.userPassword = hash;
                }
                else {
                    document.userPassword = document.userPassword;
                }
                // Validate  new fields
                yield document.validate();
                // Save now document
                const savedDocument = yield document.save();
                // Return new document
                return savedDocument.toClient();
            }
            catch (err) {
                if (err && err.name === 'ValidationError') {
                    throw new RepositoryValidationError_1.default("The item could not be updated.", Object.keys(err.errors).map((k) => {
                        return { field: err.errors[k].properties.path, message: err.errors[k].properties.message };
                    }));
                }
                else if (err.name == "DocumentNotFoundError") {
                    throw new RepositoryNotFoundError_1.default("The item could not be found.");
                }
                else {
                    throw err;
                }
            }
        });
    }
    /**
     * Login a user
     */
    login(model) {
        return __awaiter(this, void 0, void 0, function* () {
            // If user email wasn't provided
            if (!model.userEmail) {
                throw new RepositoryValidationError_1.default("Could not login.", [
                    { field: "userEmail", message: "Email address is required." }
                ]);
            }
            // If user password wasn't provided
            if (!model.userPassword) {
                throw new RepositoryValidationError_1.default("Could not login.", [
                    { field: "userPassword", message: "Password is required." }
                ]);
            }
            // Find user by email
            try {
                // find document
                const document = yield User_1.User.findOne({ userEmail: model.userEmail }).orFail();
                // Compare password using bcrypt
                const validPass = yield bcryptjs_1.default.compare(model.userPassword, document.userPassword);
                // If password is valid
                if (validPass) {
                    // Logged in successfully, so create a JWT token
                    const token = jsonwebtoken_1.default.sign({
                        userId: document === null || document === void 0 ? void 0 : document._id,
                        userRole: document === null || document === void 0 ? void 0 : document.userRole,
                    }, process.env.TOKEN_SECRET, {
                        issuer: 'Interactive Map API',
                        audience: 'admin.mattfletcher.name',
                        expiresIn: '600m',
                    });
                    // Return the token
                    return token;
                }
                // Password is invalid
                else {
                    throw new RepositoryValidationError_1.default("Could not login.", [
                        { field: "userPassword", message: "Password is incorrect." }
                    ]);
                }
            }
            catch (err) {
                if (err.name == "DocumentNotFoundError") {
                    throw new RepositoryValidationError_1.default("Could not login.", [
                        { field: "userEmail", message: "Email address not recognised." }
                    ]);
                }
                else {
                    throw err;
                }
            }
        });
    }
    /**
     * Get one user
     */
    getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = yield User_1.User.findOne({ _id: id }).orFail();
                return document.toClient();
                //return this.mongooseToClient(document);
            }
            catch (err) {
                if (err.name == "DocumentNotFoundError") {
                    throw new RepositoryNotFoundError_1.default("The item could not be found.");
                }
                else {
                    throw err;
                }
            }
        });
    }
    /**
     * Delete a user
     */
    delete(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = yield User_1.User.findOne({ _id: userId }).orFail();
                yield document.deleteOne();
                yield Map_1.Map.deleteMany({ mapUser: userId });
                yield MapMarker_1.MapMarker.deleteMany({ mapMarkerUser: userId });
                yield MapKey_1.MapKey.deleteMany({ mapKeyUser: userId });
                yield Image_1.Image.deleteMany({ imageUser: userId });
                return true;
            }
            catch (err) {
                if (err.name == "DocumentNotFoundError") {
                    throw new RepositoryNotFoundError_1.default("The item could not be found.");
                }
                else {
                    throw err;
                }
            }
        });
    }
}
exports.default = UsersRepository;
