import mongoose from "mongoose";
import { MONGODB_URL } from "../configs/constant";

export const connectToMongoDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("Connected to MongoDB successfully");
        // Cleanup legacy unique indexes that reference removed fields
        try {
            const db = mongoose.connection.db;
            const usersColl = db.collection('users');
            const indexes = await usersColl.indexes();
            const indexNames = indexes.map((ix: any) => ix.name);
            const legacyIndexes = ['username_1', 'authId_1'];
            for (const name of legacyIndexes) {
                if (indexNames.includes(name)) {
                    try {
                        await usersColl.dropIndex(name);
                        console.log(`Dropped legacy index: ${name}`);
                    } catch (err) {
                        console.warn(`Could not drop index ${name}:`, err.message || err);
                    }
                }
            }
        } catch (err) {
            console.warn('Index cleanup skipped or failed:', err.message || err);
        }
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error; // rethrow the error after logging
    }
}