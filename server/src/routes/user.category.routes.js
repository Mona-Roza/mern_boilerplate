import express from "express";

import * as categoryController from "../controllers/category.controller.js";
import * as productController from "../controllers/product.controller.js";

import * as authMiddlewares from "../middlewares/auth.middleware.js";

const router = express.Router();

// ---------------- GET REQUESTS ----------------
router.get("/", categoryController.getAllCategories);

router.get("/search/name/:name", categoryController.searchCategoriesByName);

router.get("/flat", categoryController.getFlatCategories);

router.get("/:id", categoryController.getCategoryById);

export default router;