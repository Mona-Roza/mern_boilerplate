import { Router } from "express";

import authRoutes from "./auth.routes.js";

import adminRoutes from "./admin.user.routes.js"
import adminCategoryRoutes from "./admin.category.routes.js";
import adminProductRoutes from "./admin.product.routes.js";

import userRoutes from "./user.user.routes.js";
import userCategoryRoutes from "./user.category.routes.js"
import userProductRoutes from "./user.product.routes.js"

const router = Router();

router.use("/auth", authRoutes);

router.use("/admin/categories", adminCategoryRoutes);
router.use("/admin/products", adminProductRoutes);
router.use("/admin/user", adminRoutes);

router.use("/categories", userCategoryRoutes);
router.use("/products", userProductRoutes);
router.use("/user", userRoutes);

export default router;
