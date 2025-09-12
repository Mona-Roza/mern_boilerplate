import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        price: {
            type: Number,
        },
        images: [{ type: String }],
        categories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        }]
    },
    {
        timestamps: true
    }
);

export const Product = mongoose.model("Product", productSchema);