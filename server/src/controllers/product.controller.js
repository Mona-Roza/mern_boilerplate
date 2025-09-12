import * as productService from "../services/product.service.js";
import AppError, { catchAsync } from "../utils/error.utils.js";

// ================= ADMIN SIDE =================

export const createProduct = catchAsync(async (req, res) => {
    const { name, description, price, categories } = req.body;

    const images = req.files ? req.files.map(file => `${process.env.PRODUCTS_PATH}/${file.filename}`) : [];

    const product = await productService.createProduct({
        name,
        description,
        price,
        categories,
        images
    });
    res.status(201).json({
        success: true,
        message: "Product created successfully.",
        timestamp: new Date().toISOString(),
        product
    });
});

export const updateProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { name, description, price, categories } = req.body;

    const updateData = { name, description, price, categories };
    updateData.images = req.files ? req.files.map(file => `${process.env.PRODUCTS_PATH}/${file.filename}`) : [];

    const product = await productService.updateProduct(id, updateData);

    if (!product) throw new AppError("Product not found", 404);

    res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        timestamp: new Date().toISOString(),
        product
    });
});

export const deleteProduct = catchAsync(async (req, res) => {
    const deleted = await productService.deleteProduct(req.params.id);
    if (!deleted) throw new AppError("Product not found", 404);
    res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
        timestamp: new Date().toISOString()
    });
});

// ================= USER SIDE =================

export const getProducts = catchAsync(async (req, res) => {
    const { categoryId } = req.query;

    const products = await productService.getProducts(categoryId);
    res.status(200).json({
        success: true,
        message: "Products fetched successfully.",
        timestamp: new Date().toISOString(),
        products
    });
});

// TODO: getProductsByCategory

export const getProductById = catchAsync(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    if (!product) throw new AppError("Product not found", 404);
    res.status(200).json({
        success: true,
        message: "Product fetched successfully.",
        timestamp: new Date().toISOString(),
        product
    });
});