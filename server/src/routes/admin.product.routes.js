import express from "express";
import * as productController from "../controllers/product.controller.js";
import * as authMiddlewares from "../middlewares/auth.middleware.js";
import { uploadProductImage } from "../middlewares/product.middleware.js";

const router = express.Router();

// {
//    "name": "String",
//    "description": "String",
//    "price": "String",
//    "categories": ["categoryId1", "categoryId2", ...],
//    "images": [file1, file2 ...] 
// }   
router.post(
    "/",
    authMiddlewares.authenticate,
    authMiddlewares.authorizeByRoleName("admin"),
    uploadProductImage.array("images"),
    productController.createProduct
);

// {
//    "name": "String",
//    "description": "String",
//    "price": "String",
//    "categories": ["categoryId1", "categoryId2", ...],
//    "images": [file1, file2 ...] 
// }   
router.put(
    "/:id",
    authMiddlewares.authenticate,
    authMiddlewares.authorizeByRoleName("admin"),
    uploadProductImage.array("images"),
    productController.updateProduct
);

// TODO update product image

router.delete(
    "/:id",
    authMiddlewares.authenticate,
    authMiddlewares.authorizeByRoleName("admin"),
    productController.deleteProduct
);

export default router;