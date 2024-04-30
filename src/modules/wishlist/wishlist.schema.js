import joi from "joi"
import { ObjectIdValidation } from "../../middleware/validation.middleware.js";

// add to wishlist
export const addToWishlist = joi.object({
    productId: joi.string().custom(ObjectIdValidation).required(),
}).required();

// remove from wishlist
export const removeFromWishlist = joi.object({
    productId: joi.string().custom(ObjectIdValidation).required(),
}).required();
