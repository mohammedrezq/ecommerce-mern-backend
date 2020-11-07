const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    categoryTitle: { type: String, required: true },
    categoryDescription: { type: String, required: true, minlength: 3, maxlength: 600 },
    categoryImage: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product"}] ,
}, { timestamps: true });


module.exports = mongoose.model("Cat", categorySchema);