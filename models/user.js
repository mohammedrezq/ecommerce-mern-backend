const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    isAdmin: { type: Boolean, required: true, default: false },
    firstName: { type: String, required: true, maxlength: 80 },
    lastName: { type: String, required: true, maxlength: 80 },
    products: [
      { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
    ],
    bio: { type: String },
    cartHistory: { type: Array, default: [] },
    DateOfBirth: { type: Date, required: true },
    Country: { type: String, required: true },
    Gender: { type: String, required: true },
    Avatar: { type: String },
    orders: [{ type: mongoose.Types.ObjectId, required: true, ref: "Order" }],
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  // console.log(userSchema)
  // console.log("THIS IS THIS", this)
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // check if password was modified (Updated!)
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); // Hash the password before sending it to the database
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
