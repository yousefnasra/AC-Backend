import { Schema, Types, model } from "mongoose";

const productSchema = new Schema({
    name: { type: String, required: true, min: 2, max: 400 },
    description: { type: String, min: 10, max: 400 },
    coolingSystemType: {
        type: String,
        enum: ["Cooling Only", "Cooling & Heating"],
        required: true
    },
    horsePower: { type: String, required: true, min: 4, max: 7 },
    coverageArea: { type: String, required: true, min: 2, max: 50 },
    modelName: { type: String, required: true, min: 2, max: 50 },
    color: { type: String, required: true, min: 2, max: 20 },
    inverterFunction: { type: Boolean, required: true },
    plasmaFunction: { type: Boolean, required: true },
    turboFunction: { type: Boolean, required: true },
    images: [
        {
            id: { type: String, required: true },
            url: { type: String, required: true }
        }
    ],
    defaultImage: {
        id: { type: String, required: true },
        url: { type: String, required: true }
    },
    availableItems: { type: Number, min: 0, required: true },
    soldItems: { type: Number, default: 0 },
    price: { type: Number, min: 1, required: true },
    discount: { type: Number, min: 1, max: 70 },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    brand: { type: Types.ObjectId, ref: "Brand", required: true },
    cloudFolder: { type: String, unique: true, required: true },
    averageRate: { type: Number, min: 1, max: 5 },
},
    { timestamps: true, strictQuery: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// viruals
productSchema.virtual("review", {
    ref: "Review",
    localField: "_id",
    foreignField: "productId",
});

productSchema.virtual("finalPrice").get(function () {
    // this >>> doucument === return >>> final price
    return Number.parseFloat(
        this.price - (this.price * this.discount || 0) / 100
    ).toFixed(2);
});

// query helper to paginate
productSchema.query.paginate = function (page) {
    page = page < 1 || isNaN(page) || !page ? 1 : page;
    const limit = 2; // 2 products per page
    const skip = limit * (page - 1);
    // this >> query
    return this.skip(skip).limit(limit);
};
// query helper to search 
productSchema.query.search = async function (keyword) {
    if (keyword) {
        return await this.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        });
    };
    return this; //query
};

// methods
productSchema.methods.inStock = function (requiredQuantity) {
    // this >> doucument >> product
    return this.availableItems >= requiredQuantity ? true : false;
};

export const Product = model("Product", productSchema);