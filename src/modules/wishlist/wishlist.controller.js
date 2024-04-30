import { Wishlist } from "../../../DB/models/wishlist.model.js";
import { Product } from "../../../DB/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// add to wishlist
export const addToWishlist = asyncHandler(async (req, res, next) => {
    // data from request
    const { productId } = req.body;
    // check product
    const product = await Product.findById(productId);
    if (!product) return next(new Error("product not found!", { cause: 404 }));
    // check product existence in the wishlist
    const isProductInWishlist = await Wishlist.findOne({
        user: req.user._id,
        "products.productId": productId
    });
    if (isProductInWishlist) {
        return next(new Error("product already in wishlist!", { cause: 400 }));
    };
    // add product in products array in wishlist
    const wishlist = await Wishlist.findOneAndUpdate(
        { user: req.user._id },
        { $push: { products: { productId } } },
        { new: true }
    );
    // send response
    return res.json({ success: true, results: { wishlist } });
});

// get logged user wishlist
export const getUserWishlist = asyncHandler(async (req, res, next) => {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products.productId");
    return res.json({ success: true, results: { wishlist } });
});

// remove from wishlist
export const removeFromWishlist = asyncHandler(async (req, res, next) => {
    // data from request
    const { productId } = req.params;
    // check product
    const product = await Product.findById(productId);
    if (!product) return next(new Error("product not found!", { cause: 404 }));
    // remove product from wishlist 
    const wishlist = await Wishlist.findOneAndUpdate(
        { user: req.user._id },
        { $pull: { products: { productId } } },
        { new: true }
    );
    // send response
    return res.json({ success: true, results: { wishlist } });
});

