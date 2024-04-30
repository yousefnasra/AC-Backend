import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import * as wishlistController from "./wishlist.controller.js"
import * as wishlistSchema from "./wishlist.schema.js"
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";

const router = Router();

// wishlist created when user activate his account 
// add to wishlist
router.post("/", isAuthenticated, isAuthorized("user"), validation(wishlistSchema.addToWishlist), wishlistController.addToWishlist);

// get user wishlist
router.get("/", isAuthenticated, isAuthorized("user"), wishlistController.getUserWishlist);

// remove product from wishlist
router.patch("/:productId", isAuthenticated, isAuthorized("user"), validation(wishlistSchema.removeFromWishlist), wishlistController.removeFromWishlist);

export default router;