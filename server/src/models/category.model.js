import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        active: {
            type: Boolean,
            default: false
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null, // If it's a main category it should be null
        },
    },
    { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
