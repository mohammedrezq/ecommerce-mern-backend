const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Product = require("../models/product");
const Cat = require("../models/category");


/* Get Product (Link) by product Id */

const getProductById = async (req, res, next) => {
  const productId = req.params.pid; // { pid: 'p1' }

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError(
      "Could not find any products for the provided ID",
      500
    );
    return next(error);
  }

  if (!product || product.length === 0) {
    const error = new HttpError("Could not find a product for that ID.", 404);
    return next(error);
  }

  res.json({ product: product.toObject({ getters: true }) }); // => {product} => {product: product}
};

/* Get List of all products */

const getAllProducts = async (req, res, next) => {
  let products;
  try {
    products = await Product.find();
  } catch (err) {
    const error = new HttpError(
      "Could not fetch any products, please try again in few moments",
      404
    );
    return next(error);
  }

  if (products.length === 0) {
    const error = new HttpError("Could not fetch any products.", 422);
    return next(error);
  }

  res.json({
    products: products.map((product) => product.toObject({ getters: true })),
  });
};

/* Get Product (Link) by user Id (productCreator id) */

const getProductsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let products;
  try {
    products = await Product.find({ productCreator: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching products failed for the provided user ID, please try again in few moments.",
      500
    );
    return next(error);
  }

  if (!products || products.length === 0) {
    const error = new HttpError(
      "Could not find any products for the provided user ID.",
      404
    );
    return next(error);
  }

  res.json({
    products: products.map((product) => product.toObject({ getters: true })),
  }); // => {user} => {user: user}
};

/* Create New Product */
const createProduct = async (req, res, next) => {
  const errors = validationResult(req); // Part of express-validator to check valiadtion for inputs

  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed please check the data again.",
      422
    );
    return next(error);
  }

  const {
    productTitle,
    productDescription,
    productPrice,
    productNumInStock,
    productCategory,
    productSizes,
    productColors,
    genders,
    productShipping,
    productSizeFit,
    productImages,
    productCreator,
  } = req.body;

  // const producTitle = req.body.productTitle;

  const createdProduct = new Product({
    productTitle,
    productDescription,
    productPrice,
    productNumInStock,
    productCategory,
    productSizes,
    productColors,
    genders,
    productShipping,
    productSizeFit,
    productImages,
    productCreator,
  });

  // Check if category exist, to add products to it
  let category;
  try {
    category = await Cat.findById(productCategory);
  } catch (err) {
    const error = new HttpError(
      "Creating product failed, please try again.",
      500
    );
    return next(error);
  }

  if (!category) {
    const error = new HttpError("Could not find Category for provided ID", 404);
    return next(error);
  }

  console.log(category);

  try {
    const sess = await mongoose.startSession(); // start a session from mongooose
    sess.startTransaction(); // start a transaction from mongoose
    await createdProduct.save({ session: sess }); // save created product
    category.products.push(createdProduct); // add category ID (unique for the cat) to the product created
    await category.save({ session: sess }); // add products Array to the category
    await sess.commitTransaction(); // Commit the session from mongoose

    // await createdProduct.save(); // Create New Product using save() method from mongoose
  } catch (err) {
    const error = new HttpError(
      "Creating product failed, please try again",
      500
    );
    return next(error);
  }

  res.status(201).json({ product: createdProduct });
};

/* Update Product */
const updateProduct = async (req, res, next) => {
  const errors = validationResult(req); // Part of express-validator to check valiadtion for inputs
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Update Failed due to invalid inputs please check the data in the input fields again.",
      422
    );
    return next(error);
  }

  const {
    productTitle,
    productDescription,
    productPrice,
    productNumInStock,
    productCategory,
    productSizes,
    productColors,
    genders,
    productShipping,
    productSizeFit,
    productImages,
    productCreator,
  } = req.body;

  const productId = req.params.pid;

  let product;

  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update product.",
      500
    );
    return next(error);
  }

  product.productTitle = productTitle;
  product.productDescription = productDescription;
  product.productPrice = productPrice;
  product.productNumInStock = productNumInStock;
  product.productCategory = productCategory;
  product.productSizes = productSizes;
  product.productColors = productColors;
  product.genders = genders;
  product.productShipping = productShipping;
  product.productSizeFit = productSizeFit;
  product.productImages = productImages;
  product.productCreator = productCreator;

  try {
    await product.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update the products",
      500
    );
    return next(error);
  }

  res.status(200).json({
    product: product,
    message: "Product Successfully Updated",
  });
};

/* Delete (REMOVE) Product */
const deleteProduct = async (req, res, next) => {
  const productId = req.params.pid;

  let product;

  try {
    product = await Product.findById(productId).populate("productCategory");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete the product. try again in few moments",
      500
    );
    return next(error);
  }
  // console.log(product.productCategory.products); // product IDs in Category products Array

  if (!product) {
    const error = new HttpError("Could not find a product for this ID", 500);
    return next(error);
  }

  // Removing Product and its ID from Category, Products IDs Array and Save Category
  try {
    const sess = await mongoose.startSession(); // start a session from mongooose
    sess.startTransaction(); // start a transaction from mongoose
    await product.remove({ session: sess }); // remove product
    product.productCategory.products.pull(product); // save category category ID (unique for the cat) from the product productsCategory.products array removed
    await product.productCategory.save({ session: sess }); // remove product from the Array in the category
    await sess.commitTransaction(); // Commit the session from mongoose

    // await product.remove(); // mongoose method remove() is a deleting method
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete the product. try again in few moments",
      404
    );
    return next(error);
  }

  res.status(200).json({ message: "Product Successfully Deleted" });
};

exports.getProductById = getProductById;
exports.getAllProducts = getAllProducts;
exports.getProductsByUserId = getProductsByUserId;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
