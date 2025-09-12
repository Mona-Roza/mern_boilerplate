import { Category } from "../models/category.model.js";

import AppError from "../utils/error.utils.js";

import { ERROR_CODES } from "../constants/error.constants.js";

export const createCategory = async (name, parentName = null) => {
    let parentId = null;

    if (parentName) {
        const parentCategory = await Category.findOne({ name: parentName }).lean();
        if (!parentCategory) {
            throw new AppError("Parent category not found.", 404, ERROR_CODES.PARENT_CATEGORY_NOT_FOUND);
            //   return null; --- IGNORE ---
        }
        parentId = parentCategory._id;
    }

    return await Category.create({ name, parent: parentId });
};

export const createChildCategory = async (name, parentId) => {
    return await Category.create({ name, parent: parentId });
};

export const bulkCreateCategories = async (categories) => {
    // categories: [{name, parentName}]
    const created = [];
    for (let cat of categories) {
        const c = await createCategory(cat.name, cat.parentName);
        created.push(c);
    }
    return created;
};

export const getAllCategories = async () => {
    const categories = await Category.find().lean();

    const categoryMap = {};
    const tree = [];

    categories.forEach(cat => {
        cat.children = [];
        categoryMap[cat._id.toString()] = cat;
    });

    categories.forEach(cat => {
        if (cat.parent) {
            const parent = categoryMap[cat.parent.toString()];
            if (parent) {
                parent.children.push(cat);
            }
        } else {
            tree.push(cat);
        }
    });

    const cleanTree = (nodes) => {
        return nodes.map(node => {
            const { __v, ...rest } = node;
            return { ...rest, children: cleanTree(node.children) };
        });
    };

    return cleanTree(tree);
};

export const getCategoryById = async (id) => {
    const category = await Category.findById(id).lean();
    if (!category) return null;

    const { __v, createdAt, updatedAt, ...rest } = category;
    return rest;
};

export const searchCategoriesByName = async (name) => {
    return await Category.find({ name: { $regex: name, $options: "i" } }).lean();
};

export const getFlatCategories = async () => {
    const categories = await Category.find().lean();

    return categories.map(cat => ({ name: cat.name, id: cat._id }));
};

export const updateCategoryName = async (id, newName) => {
    return await Category.findByIdAndUpdate(
        id,
        { name: newName },
        { new: true, runValidators: true }
    );
};

export const updateCategoryParent = async (id, parentId) => {
    return await Category.findByIdAndUpdate(id, { parent: parentId }, { new: true });
};

export const toggleCategoryStatus = async (id) => {
    const cat = await Category.findById(id);
    if (!cat) throw new Error("Category not found");
    cat.active = !cat.active;
    await cat.save();
    return cat;
};

export const deleteCategory = async (categoryId) => {

    const subCategories = await Category.find({ parent: categoryId });

    for (const sub of subCategories) {
        await deleteCategory(sub._id);
    }

    await Category.findByIdAndDelete(categoryId);
};

export const bulkDeleteCategories = async (ids) => {
    await Category.deleteMany({ _id: { $in: ids } });
};
