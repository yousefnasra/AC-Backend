import { Schema, Types, model } from "mongoose";

const wishlistSchema = new Schema({
    products: [
        {
            productId: { type: Types.ObjectId, ref: "Product" },
        }
    ],
    user: { type: Types.ObjectId, ref: "User", required: true, unique: true },
},
    { timestamps: true }
);

export const Wishlist = model("wishlist", wishlistSchema);