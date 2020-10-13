const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  isAdmin: { type: Boolean, required: true, default: false },
  fisrtName: { type: String, required: true, maxlength: 80 },
  lastName: { type: String, required: true, maxlength: 80 },
  products: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product"}] ,
  bio: { type: String },
  cartHistory: { type: Array, default: [] },
  DateOfBirth: { type: String, required: true },
  Country: { type: String, required: true },
  Gender: { type: String, required: true },
  Avatar: { type: String },
}, { timestamps: true });

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
