import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import router from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// --- Security & parsing middleware ---
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- CORS ---
// Adjust origin(s) to your FE(s). If you need cookies cross-origin,
// keep credentials: true and set the FE to send withCredentials.
const corsOptions = {
    origin: ["http://localhost:8081"], // add prod origins here
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// --- Routes ---
app.use("/api", router);

// --- Global error handler (must be last) ---
app.use(errorHandler);

export default app;
