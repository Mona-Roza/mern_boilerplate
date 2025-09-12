import express from "express";
import * as productController from "../controllers/product.controller.js";
import * as authMiddlewares from "../middlewares/auth.middleware.js";
import { uploadProductImage } from "../middlewares/product.middleware.js";

const router = express.Router();

router.get("/", productController.getProducts);

router.get("/:id", productController.getProductById);

export default router;