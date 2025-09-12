import * as categoryService from "../services/category.service.js";
import { catchAsync } from "../utils/error.utils.js";

// ================= ADMIN SIDE =================
export const createCategory = catchAsync(async (req, res) => {
    const { name, parentName } = req.body;

    const category = await categoryService.createCategory(name, parentName);

    res.status(201).json({
        success: true,
        message: "Category created successfully.",
        timestamp: new Date().toISOString(),
        category
    });
});

export const createChildCategory = catchAsync(async (req, res) => {
    const { parentId } = req.params;
    const { name } = req.body;

    const category = await categoryService.createChildCategory(name, parentId);

    res.status(201).json({
        success: true,
        message: "Category created successfully.",
        timestamp: new Date().toISOString(),
        category
    });
});

export const bulkCreateCategories = catchAsync(async (req, res) => {
    const { categories } = req.body; // [{name, parentName}, ...]
    const created = await categoryService.bulkCreateCategories(categories);
    res.status(201).json({
        success: true,
        message: "Categories created successfully.",
        timestamp: new Date().toISOString(),
        created
    });
});

export const updateCategoryName = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { newName } = req.body;

    const updatedCategory = await categoryService.updateCategoryName(id, newName);
    if (!updatedCategory) {
        throw new AppError("Category not found.", 404, ERROR_CODES.CATEGORY_NOT_FOUND);
    }

    res.status(200).json({
        success: true,
        message: "Category updated successfully.",
        timestamp: new Date().toISOString(),
        updatedCategory,
    });
});

export const updateCategoryParent = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { parentId } = req.body;
    const updated = await categoryService.updateCategoryParent(id, parentId);
    res.status(200).json({
        success: true,
        message: "Category parent updated successfully.",
        timestamp: new Date().toISOString(),
        updated
    });
});

// TODO What happens to releated products when category status changed? 
export const toggleCategoryStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updated = await categoryService.toggleCategoryStatus(id);
    res.status(200).json({
        success: true,
        message: "Category status toggled successfully.",
        timestamp: new Date().toISOString(),
        updated
    });
});

// TODO Change releated products category to "None"
export const deleteCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    await categoryService.deleteCategory(id);

    res.status(204).json({
        success: true,
        message: "Category and its subcategories deleted successfully.",
        timestamp: new Date().toISOString()
    });
});

export const bulkDeleteCategories = catchAsync(async (req, res) => {
    const { ids } = req.body; // [id1, id2, ...]
    await categoryService.bulkDeleteCategories(ids);
    res.status(204).json({
        success: true,
        message: "Categories and their subcategories deleted successfully.",
        timestamp: new Date().toISOString()
    });
});

// ================= USER SIDE =================

export const getAllCategories = catchAsync(async (req, res) => {
    const categories = await categoryService.getAllCategories();

    res.status(200).json({
        success: true,
        message: "Categories retrieved successfully.",
        categories,
        timestamp: new Date().toISOString()
    });
});

export const getCategoryById = catchAsync(async (req, res) => {
    const { id } = req.params;

    const category = await categoryService.getCategoryById(id);
    if (!category) {
        throw new AppError("Category not found.", 404, ERROR_CODES.CATEGORY_NOT_FOUND);
    }

    res.status(200).json({
        success: true,
        message: "Category retrieved successfully.",
        timestamp: new Date().toISOString(),
        category
    });
});

export const searchCategoriesByName = catchAsync(async (req, res) => {
    const { name } = req.params;
    const results = await categoryService.searchCategoriesByName(name);
    res.status(200).json({
        success: true,
        message: "Categories retrieved successfully.",
        timestamp: new Date().toISOString(),
        results
    });
});

export const getFlatCategories = catchAsync(async (req, res) => {
    const list = await categoryService.getFlatCategories();

    res.status(200).json({
        success: true,
        message: "Flat categories retrieved successfully.",
        timestamp: new Date().toISOString(),
        list
    });
});
