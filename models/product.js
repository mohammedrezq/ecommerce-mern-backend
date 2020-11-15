const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    title: { type:String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId , required: true, ref: "User" }
}, {
    timestamps: true
})

const productSchema = new Schema ({
    User: { type: mongoose.Schema.Types.ObjectId , ref: "User" },
    Title: { type: String, required: true },
    Description: { type: String, required: true},
    Price: { type: Number, required: true, default: 0 },
    CountInStock: { type: Number, required: true, default: 0 },
    Category: { type: mongoose.Schema.Types.ObjectId , required: true, ref: "Cat" },
    Reviews: [reviewSchema],
    Sizes: { type: Array },
    Brand: { type: String },
    Rating: { type: Number, required: true, default: 0 },
    NumReviews: { type: Number, required: true, default: 0 },
    Colors: { type: Array },
    Genders: { type: Array },
    Shipping: { type: String },
    SizeFit: { type: String },
    Images: { type: Array, required: true },
}, { timestamps: true })

module.exports = mongoose.model("Product", productSchema);