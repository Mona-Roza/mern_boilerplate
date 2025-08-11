
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth/auth.routes.js";

dotenv.config();

// Middleware configuration
const corsOptions = {
    origin: "http://localhost:8081"
}

const app = express();
app.use(cors(corsOptions)) // ?
app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(express.urlencoded({ extended: true })); // ? 

app.use("/api/auth", authRoutes);


// TODO
// Set port and start server
const PORT = process.env.PORT || 8080;
const uri = `mongodb://${db.dbConfig.USERNAME}:${db.dbConfig.PASSWORD}@${db.dbConfig.HOST}:${db.dbConfig.PORT}/${db.dbConfig.DB}?authSource=admin`;


