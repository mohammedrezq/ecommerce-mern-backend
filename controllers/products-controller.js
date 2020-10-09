const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");
const Product = require("../models/product");

let DUMMY_PRODUCTS = [
  {
    id: "p1",
    productCreator: "u1",
    productTitle: "Shoes From Nike",
    productSeries: "Nike City Ready",
    productPrice: 149.99,
    productType: "Shoes",
    productSizes: ["M 6 / W 7.5", "M 6.5 / W 8", "M 7 / W 8.5", "M 7.5 / W 9"],
    productShipping:
      "Free standard shipping and free 60-day returns for Nike Members.",
    productSizeFit: [
      "Model is wearing size S and is 5'9\"/175cm",
      "Loose fit for a roomy feel",
    ],
    productImages: [
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,b_rgb:f5f5f5/0a6391bb-dd85-4b99-a3b1-93d29e6e0c2e/yoga-luxe-womens-infinalon-crop-top-5XGffB.jpg",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,b_rgb:f5f5f5,q_80/b7051cb5-5966-439b-950a-df231c4363ec/yoga-luxe-womens-infinalon-crop-top-5XGffB.jpg",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,b_rgb:f5f5f5,q_80/13e1826e-2282-4123-9975-32b6bf25a728/yoga-luxe-womens-infinalon-crop-top-5XGffB.jpg",
    ],
  },
  {
    id: "p2",
    productCreator: "u2",
    productTitle: "Shoes From Addidas",
    productSeries: "Nike City Ready",
    productPrice: 149.99,
    productType: "Shoes",
    productSizes: ["M 6 / W 7.5", "M 6.5 / W 8", "M 7 / W 8.5", "M 7.5 / W 9"],
    productShipping:
      "Free standard shipping and free 60-day returns for Nike Members.",
    productSizeFit: [
      "Model is wearing size S and is 5'9\"/175cm",
      "Loose fit for a roomy feel",
    ],
    productImages: [
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,b_rgb:f5f5f5/0a6391bb-dd85-4b99-a3b1-93d29e6e0c2e/yoga-luxe-womens-infinalon-crop-top-5XGffB.jpg",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,b_rgb:f5f5f5,q_80/b7051cb5-5966-439b-950a-df231c4363ec/yoga-luxe-womens-infinalon-crop-top-5XGffB.jpg",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,b_rgb:f5f5f5,q_80/13e1826e-2282-4123-9975-32b6bf25a728/yoga-luxe-womens-infinalon-crop-top-5XGffB.jpg",
    ],
  },
  {
    id: "p3",
    productCreator: "u3",
    productTitle: "Shoes From PUMA",
    productSeries: "Nike City Ready",
    productPrice: 149.99,
    productType: "Shoes",
    productSizes: ["M 6 / W 7.5", "M 6.5 / W 8", "M 7 / W 8.5", "M 7.5 / W 9"],
    productShipping:
      "Free standard shipping and free 60-day returns for Nike Members.",
    productSizeFit: [
      "Model is wearing size S and is 5'9\"/175cm",
      "Loose fit for a roomy feel",
    ],
    productImages: [
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,b_rgb:f5f5f5/0a6391bb-dd85-4b99-a3b1-93d29e6e0c2e/yoga-luxe-womens-infinalon-crop-top-5XGffB.jpg",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,b_rgb:f5f5f5,q_80/b7051cb5-5966-439b-950a-df231c4363ec/yoga-luxe-womens-infinalon-crop-top-5XGffB.jpg",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,b_rgb:f5f5f5,q_80/13e1826e-2282-4123-9975-32b6bf25a728/yoga-luxe-womens-infinalon-crop-top-5XGffB.jpg",
    ],
  },
  {
    id: "p4",
    productCreator: "u1",
    productTitle: "Shoes From PUMA33333333333",
    productSeries: "Nike City Ready",
    productPrice: 149.99,
    productType: "Shoes",
    productSizes: ["M 6 / W 7.5", "M 6.5 / W 8", "M 7 / W 8.5", "M 7.5 / W 9"],
    productShipping:
      "Free standard shipping and free 60-day returns for Nike Members.",
    productSizeFit: [
      "Model is wearing size S and is 5'9\"/175cm",
      "Loose fit for a roomy feel",
    ],
    productImages: [
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,b_rgb:f5f5f5/0a6391bb-dd85-4b99-a3b1-93d29e6e0c2e/yoga-luxe-womens-infinalon-crop-top-5XGffB.jpg",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,b_rgb:f5f5f5,q_80/b7051cb5-5966-439b-950a-df231c4363ec/yoga-luxe-womens-infinalon-crop-top-5XGffB.jpg",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,b_rgb:f5f5f5,q_80/13e1826e-2282-4123-9975-32b6bf25a728/yoga-luxe-womens-infinalon-crop-top-5XGffB.jpg",
    ],
  },
];

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

  if (!product) {
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

  res.json({ products });
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

  try {
    await createdProduct.save(); // Create New Product using save() method from mongoose
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

  res
    .status(200)
    .json({
      product: product.toObject({ getters: true }),
      message: "Product Successfully Updated",
    });
};

/* Delete (REMOVE) Product */
const deleteProduct = async (req, res, next) => {
  const productId = req.params.pid;

  let product;

  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete the product. try again in few moments",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find a product for this ID", 500);
    return next(error);
  }

  try {
    await product.remove(); // mongoose method remove() is a deleting method
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
