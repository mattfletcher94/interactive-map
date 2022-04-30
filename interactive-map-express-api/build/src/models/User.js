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
exports.UserSchema = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Mongoose schema definition
 */
const UserSchemaFields = {
    userFirstName: {
        type: String,
        trim: true,
        required: [true, "First name is required."],
        max: 255
    },
    userLastName: {
        type: String,
        trim: true,
        required: [true, "Last name is required."],
        max: 255
    },
    userEmail: {
        type: String,
        trim: true,
        required: [true, "Email address is required."],
        validate: {
            validator: function (val) {
                return __awaiter(this, void 0, void 0, function* () {
                    const result = yield User.findOne({ userEmail: val, _id: { $ne: this._id } });
                    return Promise.resolve(result == null ? true : false);
                });
            },
            message: (props) => `Email address already in use.`
        },
    },
    userPassword: {
        type: String,
        trim: true,
        required: [true, "Password is required."],
        minlength: [6, "Password should be at least {MINLENGTH} chracters long."],
    },
    userRole: {
        type: String,
        trim: true,
        required: true,
        enum: ['user', 'admin'],
        default: 'user',
    }
};
/**
 * Create mongoose schema
 */
const UserSchema = new mongoose_1.default.Schema(UserSchemaFields, {
    timestamps: {
        createdAt: 'userCreatedAt',
        updatedAt: 'userUpdatedAt'
    },
});
exports.UserSchema = UserSchema;
/**
 * Define to client method
 */
UserSchema.methods.toClient = function (cb) {
    return {
        userId: this._id,
        userEmail: this.userEmail,
        userFirstName: this.userFirstName,
        userLastName: this.userLastName,
        userRole: this.userRole
    };
};
/**
 * Map model
 */
const User = mongoose_1.default.model("User", UserSchema);
exports.User = User;
