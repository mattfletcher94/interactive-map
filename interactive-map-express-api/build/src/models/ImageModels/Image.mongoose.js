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
const mongoose_1 = __importDefault(require("mongoose"));
const User_mongoose_1 = __importDefault(require("../UserModels/User.mongoose"));
const ImageMongoose = mongoose_1.default.model('Image', new mongoose_1.default.Schema({
    imageUser: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        validate: {
            validator: function (imageUser) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield User_mongoose_1.default.findOne({ _id: imageUser });
                    return Promise.resolve(user == null ? false : true);
                });
            },
            message: (props) => `The user does not exist.`
        },
    },
    imageName: {
        type: String,
        trim: true,
        required: [true, "Image name is required."],
    },
    imagePath: {
        type: String,
        trim: true,
        required: [true, "Image path is required."],
    }
}, {
    timestamps: {
        createdAt: 'imageCreatedAt',
        updatedAt: 'imageUpdatedAt'
    }
}));
exports.default = ImageMongoose;
