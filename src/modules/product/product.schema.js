import joi from "joi"
import { ObjectIdValidation } from "../../middleware/validation.middleware.js";

// create product
export const createProduct = joi.object({
    name: joi.string().min(2).max(400).required(),
    description: joi.string().min(3).max(400).required(),
    coolingSystemType: joi.string().valid("Cooling Only", "Cooling & Heating").required(),
    horsePower: joi.string().min(4).max(7).required(),
    coverageArea: joi.string().min(2).max(50).required(),
    modelName: joi.string().min(2).max(50).required(),
    color: joi.string().min(2).max(20).required(),
    inverterFunction: joi.boolean().required(),
    plasmaFunction: joi.boolean().required(),
    turboFunction: joi.boolean().required(),
    availableItems: joi.number().integer().min(1).required(),
    price: joi.number().min(15000).required(),
    discount: joi.number().integer().min(1).max(70),
    category: joi.string().custom(ObjectIdValidation).required(true),
    brand: joi.string().custom(ObjectIdValidation).required(true),
}).required();

// delete product
export const deleteProduct = joi.object({
    id: joi.string().custom(ObjectIdValidation).required(),
}).required();

// get product
export const getProduct = joi.object({
    id: joi.string().custom(ObjectIdValidation).required(),
}).required();