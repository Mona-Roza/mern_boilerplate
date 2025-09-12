import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./src/app.js";
import { logger } from "./src/utils/logger.js";
import { connectDB } from "./src/config/db.config.js";

dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
}

const PORT = process.env.PORT || 8080;

import crypto from "crypto";
import { Role } from "./src/models/role.model.js";

const createInitialRoles = async () => {
    const roles = [
        {
            name: "admin",
            permissions: ["user:read", "user:write", "order:manage", "product:manage"]
        },
        {
            name: "client",
            permissions: ["order:manage"]
        }
    ];

    for (const role of roles) {
        const exists = await Role.findOne({ name: role.name });
        if (!exists) {
            const hash = crypto.createHash("sha256").update(role.name).digest("hex");
            await Role.create({ ...role, hash });
            console.log(`Created role: ${role.name}`);
        }
    }
};

async function start() {
    try {
        // 1) Connect DB
        await connectDB();

        // 2) Start server
        const server = app.listen(PORT, () => {
            logger.info(`API listening on http://localhost:${PORT}`);
        });

        // 3) Create initial roles if not exist
        await createInitialRoles();

        // 4) Graceful shutdown
        const shutdown = (signal) => async () => {
            try {
                logger.info(`\n${signal} received. Closing server...`);
                await new Promise((resolve) => server.close(resolve));
                await mongoose.connection.close();
                logger.info("Closed out remaining connections.");
                process.exit(0);
            } catch (err) {
                logger.error({ err }, "Error during shutdown:");
                process.exit(1);
            }
        };

        process.on("SIGINT", shutdown("SIGINT"));
        process.on("SIGTERM", shutdown("SIGTERM"));
    } catch (err) {
        logger.error({ err }, "Startup error:");
        process.exit(1);
    }
}

start();
