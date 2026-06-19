import mongoose, { Schema, Document } from "mongoose";
import { UserType } from "../types/user.type";

export interface IUser extends UserType, Document {
    // can add mongo related attr
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
const UserMongoSchema: Schema = new Schema<IUser>(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        gender: { type: String, enum: ["male", "female", "other"], default: "other" },
        contactNumber: { type: String },
        profileImage: { type: String, default: null }
    },
    {
        timestamps: true // createdAt and updatedAt will be automatically added and managed by mongoose
    }
)
export const UserModel = mongoose.model<IUser>
(
    "User", // db.users -> Model Name "User"
    UserMongoSchema
);