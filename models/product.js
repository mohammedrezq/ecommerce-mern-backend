const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema ({
    productTitle: { type: String, required: true },
    productDescription: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productNumInStock: { type: Number, required: true},
    productCategory: { type: String, required: true} ,
    productSizes: { type: Array, required: true },
    productColors: { type: Array, required: true },
    genders: { type: Array, required: true },
    productShipping: { type: String, required: true },
    productSizeFit: { type: String, required: true },
    productImages: { type: Array, required: true },
    productCreator: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model("Product", productSchema);