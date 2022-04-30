import mongoose from 'mongoose';
import TSOmit from '../helpers/TSOmit'

/**
 * Schema
 */
interface IUser {
    userFirstName: string
    userLastName: string
    userEmail: string
    userPassword: string
    userRole: string
}

/**
 * Create a new user
 */
interface IUserCreate extends TSOmit<IUser, 'userRole'> {
}

/**
 * Update a user
 */
interface IUserUpdate  {
	userFirstName?: string
    userLastName?: string
    userEmail?: string
    userPassword?: string
}

/**
 * Login a user
 */
interface IUserLogin {
    userEmail: string,
    userPassword: string
}

/**
 * Client schema
 */
interface IUserClient extends TSOmit<IUser, 'userPassword'> {
    userId: string,
}

/**
 * Document
 */
interface IUserDoc extends IUser, mongoose.Document {
    toClient(): IUserClient
}

/**
 * Mongoose schema definition
 */
const UserSchemaFields: Record<keyof IUser, any> = {
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
            validator: async function (this: any, val : string) : Promise<boolean> {
                const result = await User.findOne({ userEmail: val, _id: { $ne: this._id} });
                return Promise.resolve(result == null ? true : false);
            },
            message: (props : any) => `Email address already in use.`
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
}

/**
 * Create mongoose schema
 */
const UserSchema = new mongoose.Schema(UserSchemaFields, {
    timestamps: { 
        createdAt: 'userCreatedAt', 
        updatedAt: 'userUpdatedAt' 
    },
});


/**
 * Define to client method
 */
UserSchema.methods.toClient = function (this: any, cb : any): IUserClient {
    return {
        userId: this._id,
        userEmail: this.userEmail,
        userFirstName: this.userFirstName,
        userLastName: this.userLastName,
        userRole: this.userRole
    }
};

/**
 * Map model
 */
 const User = mongoose.model<IUserDoc>("User", UserSchema);

/**
 * Exports 
 */
export { User, UserSchema, IUser, IUserCreate, IUserUpdate, IUserDoc, IUserClient, IUserLogin }