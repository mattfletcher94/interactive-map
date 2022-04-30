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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const DAOGetOneResponse_1 = __importDefault(require("../daoResponses/DAOGetOneResponse"));
const DAOCreateResponse_1 = __importDefault(require("../daoResponses/DAOCreateResponse"));
const User_mongoose_1 = __importDefault(require("../models/UserModels/User.mongoose"));
const User_client_1 = __importDefault(require("../models/UserModels/User.client"));
const DAOLoginResponse_1 = __importDefault(require("../daoResponses/DAOLoginResponse"));
class UserDAO {
    getById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new DAOGetOneResponse_1.default();
            try {
                const user = yield User_mongoose_1.default.findOne({ _id: userId });
                if (user) {
                    response.FOUND = true;
                    response.DATA = new User_client_1.default({
                        userId: user._id,
                        userFirstName: user.userFirstName,
                        userLastName: user.userLastName,
                        userEmail: user.userEmail,
                        userRole: user.userRole,
                        userCreatedAt: user.userCreatedAt,
                        userUpdatedAt: user.userUpdatedAt,
                    });
                }
                else {
                    response.NOT_FOUND = true;
                }
                return response;
            }
            catch (err) {
                response.UNKNOWN_ERROR = true;
                response.UNKNOWN_ERROR_REASON = err.message;
                return response;
            }
        });
    }
    create(model) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create response
            const response = new DAOCreateResponse_1.default();
            // Run code
            try {
                // Create a new mongo user
                const user = new User_mongoose_1.default({
                    userFirstName: model.userFirstName,
                    userLastName: model.userLastName,
                    userEmail: model.userEmail,
                    userPassword: model.userPassword
                });
                // Is user valid?
                yield user.validate();
                // Create hash password
                const salt = yield bcryptjs_1.default.genSalt(10);
                const hash = yield bcryptjs_1.default.hash(user.userPassword, salt);
                // Set the hashed password
                user.userPassword = hash;
                // Create user
                const savedUser = yield user.save();
                response.CREATED = true;
                response.DATA = new User_client_1.default({
                    userId: savedUser._id,
                    userFirstName: savedUser.userFirstName,
                    userLastName: savedUser.userLastName,
                    userEmail: savedUser.userEmail,
                    userRole: savedUser.userRole,
                    userCreatedAt: savedUser.userCreatedAt,
                    userUpdatedAt: savedUser.userUpdatedAt,
                });
                return response;
            }
            catch (err) {
                if (err && err.name === 'ValidationError') {
                    response.VALIDATION_ERROR = true;
                    response.VALIDATION_ERRORS = Object.keys(err.errors).map((k) => {
                        return { field: err.errors[k].properties.path, message: err.errors[k].properties.message };
                    });
                    return response;
                }
                else {
                    response.UNKNOWN_ERROR = true;
                    response.UNKNOWN_ERROR_REASON = err.message;
                    return response;
                }
            }
        });
    }
    login(model) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create response
            const response = new DAOLoginResponse_1.default();
            // If user email wasn't provided
            if (!model.userEmail) {
                response.VALIDATION_ERROR = true;
                response.VALIDATION_ERRORS.push({
                    field: "userEmail",
                    message: "Email address is required."
                });
                return response;
            }
            // If user password wasn't provided
            if (!model.userPassword) {
                response.VALIDATION_ERROR = true;
                response.VALIDATION_ERRORS.push({
                    field: "userPassword",
                    message: "Password is required."
                });
                return response;
            }
            // Get user
            const user = yield User_mongoose_1.default.findOne({ userEmail: model.userEmail });
            if (user) {
                // Check password against user
                const validPass = yield bcryptjs_1.default.compare(model.userPassword, user.userPassword);
                // If password is incorrect
                if (validPass) {
                    // Logged in successfully, so create a JWT token
                    const token = jsonwebtoken_1.default.sign({
                        userId: user === null || user === void 0 ? void 0 : user._id,
                        userRole: user === null || user === void 0 ? void 0 : user.userRole,
                    }, process.env.TOKEN_SECRET, {
                        issuer: 'Interactive Map API',
                        audience: 'admin.mattfletcher.name',
                        expiresIn: '600m',
                    });
                    // Return response
                    response.SUCCESS = true;
                    response.TOKEN = token;
                    return response;
                }
                else {
                    response.VALIDATION_ERROR = true;
                    response.VALIDATION_ERRORS.push({
                        field: "userPassword",
                        message: "Password is incorrect."
                    });
                    return response;
                }
            }
            else {
                response.VALIDATION_ERROR = true;
                response.VALIDATION_ERRORS.push({
                    field: "userEmail",
                    message: "Email address not recognised."
                });
                return response;
            }
        });
    }
}
exports.default = UserDAO;
