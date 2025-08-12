import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { logger } from "../utils/logger.js";

// Prefer a single MONGODB_URI, else build from parts.
const uri =
    process.env.DB_URI ||
    `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}` + `@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;

export const connectDB = async () => {
    try {
        mongoose.set("strictQuery", true);

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        logger.info("MongoDB connected successfully");

        // Ensure indexes if autoIndex=false in prod
        await User.init();

    } catch (err) {
        logger.error({ err }, "MongoDB connection failed");
        process.exit(1);
    }
};
