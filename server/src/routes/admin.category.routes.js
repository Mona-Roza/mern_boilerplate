import express from "express";

import * as categoryController from "../controllers/category.controller.js";
import * as productController from "../controllers/product.controller.js";

import * as authMiddlewares from "../middlewares/auth.middleware.js";

const router = express.Router();

// ---------------- POST REQUESTS ----------------
router.post("/",
    authMiddlewares.authenticate,
    authMiddlewares.authorizeByRoleName("admin"),
    categoryController.createCategory
);

router.post("/parent/:parentId/children",
    authMiddlewares.authenticate,
    authMiddlewares.authorizeByRoleName("admin"),
    categoryController.createChildCategory
);

router.post("/bulk",
    authMiddlewares.authenticate,
    authMiddlewares.authorizeByRoleName("admin"),
    categoryController.bulkCreateCategories
);

// ---------------- GET REQUESTS ----------------

// ---------------- PUT REQUESTS ----------------
router.put("/:id/name",
    authMiddlewares.authenticate,
    authMiddlewares.authorizeByRoleName("admin"),
    categoryController.updateCategoryName
);

router.put("/:id/parent",
    authMiddlewares.authenticate,
    authMiddlewares.authorizeByRoleName("admin"),
    categoryController.updateCategoryParent
);

router.put("/:id/status",
    authMiddlewares.authenticate,
    authMiddlewares.authorizeByRoleName("admin"),
    categoryController.toggleCategoryStatus
);

// ---------------- DELETE REQUESTS ----------------
router.delete("/bulk",
    authMiddlewares.authenticate,
    authMiddlewares.authorizeByRoleName("admin"),
    categoryController.bulkDeleteCategories
);

router.delete("/:id",
    authMiddlewares.authenticate,
    authMiddlewares.authorizeByRoleName("admin"),
    categoryController.deleteCategory
);

export default router;