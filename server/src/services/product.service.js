import { Product } from "../models/product.model.js";

export const createProduct = async (data) => {
    return await Product.create(data);
};

export const getProducts = async (categoryId = null) => {
    const filter = categoryId ? { categories: categoryId } : {};
    return await Product.find(filter).populate("categories").lean();
};

// TODO: getProductsByCategory

export const getProductById = async (id) => {
    return await Product.findById(id).populate("categories").lean();
};

export const updateProduct = async (id, data) => {
    return await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};