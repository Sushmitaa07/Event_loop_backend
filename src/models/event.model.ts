import mongoose, { Schema, Document } from "mongoose";
import { EventType } from "../types/event.type";

export interface IEvent extends EventType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const EventMongoSchema: Schema = new Schema<IEvent>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        location: { type: String, required: true },
        price: { type: Number, required: true, default: 0 },
        category: {
            type: String,
            enum: ["music", "sports", "theater", "art", "comedy"],
            required: true,
        },
        image: { type: String, default: null },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: true,
    }
);

export const EventModel = mongoose.model<IEvent>("Event", EventMongoSchema);
