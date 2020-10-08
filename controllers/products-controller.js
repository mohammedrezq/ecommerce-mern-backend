const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

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

const getProductById = (req, res, next) => {
  const productId = req.params.pid; // { pid: 'p1' }

  const product = DUMMY_PRODUCTS.find((p) => {
    return p.id === productId;
  });

  if (!product) {
    const error = new HttpError("Could not find a product for that ID.", 404);
    return next(error);
  }

  res.json({ product }); // => {product} => {product: product}
};

/* Get List of all products */

const getAllProducts = (req, res, next ) => {
  res.json({ products: DUMMY_PRODUCTS })
}

/* Get Product (Link) by user Id (productCreator id) */

const getProductsByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const products = DUMMY_PRODUCTS.filter((u) => {
    return u.productCreator === userId;
  });

  if (!products || products.length === 0) {
    const error = new HttpError(
      "Could not find any products for the provided user ID.",
      404
    );
    return next(error);
  }

  res.json({ products }); // => {user} => {user: user}
};

/* Create New Product */
const createProduct = (req, res, next) => {

  const errors = validationResult(req); // Part of express-validator to check valiadtion for inputs

  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed please check the data again.", 422)
  }

  const {
    productTitle,
    productDescription,
    productPrice,
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

  const createdProduct = {
    id: uuidv4(),
    productTitle,
    productDescription,
    productPrice,
    productCategory,
    productSizes,
    productColors,
    genders,
    productShipping,
    productSizeFit,
    productImages,
    productCreator,
  };

  DUMMY_PRODUCTS.unshift(createdProduct); // <push> if we want to make it to be the last element to be added

  res.status(201).json({ product: createdProduct });
};

/* Update Product */
const updateProduct = (req, res, next) => {

  const errors = validationResult(req); // Part of express-validator to check valiadtion for inputs
  if (!errors.isEmpty()) {
    throw new HttpError("Update Failed due to invalid inputs please check the data in the input fields again.", 422 )
  }

  const {
    productTitle,
    productDescription,
    productPrice,
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

  const updatedProduct = { ...DUMMY_PRODUCTS.find((p) => p.id === productId) };

  const productIndex = DUMMY_PRODUCTS.findIndex((p) => p.id === productId);

  updatedProduct.productTitle = productTitle;
  updatedProduct.productDescription = productDescription;
  updatedProduct.productPrice = productPrice;
  updatedProduct.productCategory = productCategory;
  updatedProduct.productSizes = productSizes;
  updatedProduct.productColors = productColors;
  updatedProduct.genders = genders;
  updatedProduct.productShipping = productShipping;
  updatedProduct.productSizeFit = productSizeFit;
  updatedProduct.productImages = productImages;
  updatedProduct.productCreator = productCreator;

  DUMMY_PRODUCTS[productIndex] = updatedProduct;

  res
    .status(200)
    .json({ product: updatedProduct, message: "Product Successfully Updated" });
};

/* Delete (REMOVE) Product */
const deleteProduct = (req, res, next) => {
  const productId = req.params.pid;

  if(!DUMMY_PRODUCTS.find( p => p.id === productId)) {
    const error = new HttpError("Could not find a prodcut for that ID.", 404);
    return next(error);
  }

  DUMMY_PRODUCTS = DUMMY_PRODUCTS.filter((p) => p.id !== productId);

  res.status(200).json({ message: "Product Successfully Deleted" });
};

exports.getProductById = getProductById;
exports.getAllProducts = getAllProducts;
exports.getProductsByUserId = getProductsByUserId;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
