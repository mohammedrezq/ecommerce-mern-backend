const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Product = require("../models/product");
const Cat = require("../models/category");
const User = require("../models/user");
const { countDocuments } = require("../models/product");


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
  const pageSize = 60;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword ? {
    Title: {
      $regex: req.query.keyword,
      $options: 'i'
    }
  } : {}

  let products;
  let count;
  try {
    count = await Product.countDocuments({...keyword})
    products = await Product.find({ ...keyword }).sort({ createdAt: -1 }).limit(pageSize).skip(pageSize * (page - 1)); // sort -1 descending || 1 ascending
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
    products: products.map((product) => product.toObject({ getters: true })), page, pages: Math.ceil(count /pageSize) 
  });
};

/* Get Product (Link) by user Id (User id) */

const getProductsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let products;
  try {
    products = await Product.find({ User: userId });
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
    Title,
    Description,
    Price,
    CountInStock,
    Category,
    Sizes,
    Colors,
    Genders,
    Shipping,
    SizeFit,
    Images,
    // UserId,
  } = req.body;

  // const producTitle = req.body.productTitle;

  const createdProduct = new Product({
    Title,
    Description,
    Price,
    CountInStock,
    Category,
    Sizes,
    Colors,
    Genders,
    Shipping,
    SizeFit,
    Images,
    // UserId,
  });

  // Check if category exist, to add products to it
  let category;
  try {
    category = await Cat.findById(Category);
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

  // console.log(category);

  // Check if User exist, to add products to it
  // let user;
  // try {
  //   user = await User.findById(UserId);
  // } catch (err) {
  //   const error = new HttpError(
  //     "Creating product failed, please try again.",
  //     500
  //   );
  //   return next(error);
  // }

  // if (!user) {
  //   const error = new HttpError("Could not find User for provided ID", 404);
  //   return next(error);
  // }

  // console.log(user);

  try {
    const sess = await mongoose.startSession(); // start a session from mongooose
    sess.startTransaction(); // start a transaction from mongoose
    await createdProduct.save({ session: sess }); // save created product
    category.products.push(createdProduct); // add category ID (unique for the cat) to the product created
    // user.products.push(createdProduct); // add userID (unique for the cat) to the product created
    await category.save({ session: sess }); // add products Array to the category
    // await user.save({ session: sess }); // add products Array to the user
    await sess.commitTransaction(); // Commit the session from mongoose

    // await createdProduct.save(); // Create New Product using save() method from mongoose
  } catch (err) {
    const error = new HttpError(
      "Creating product failed, please try again",
      500
    );
    return next(error);
  }

  res.status(201).json( createdProduct );
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

  
  const productId = req.params.pid;

  console.log(productId)

  const {
    Title,
    Description,
    Price,
    CountInStock,
    Category,
    Sizes,
    Colors,
    Genders,
    Shipping,
    SizeFit,
    Images,
    // UserId,
  } = req.body;


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

  if(product) {

    product.Title = Title || product.Title;
    product.Description = Description || product.Description;
    product.Price = Price || product.Price;
    product.CountInStock = CountInStock || product.CountInStock;
    product.Category = Category || product.Category;
    product.Sizes = Sizes || product.Sizes;
    product.Colors = Colors || product.Colors;
    product.Genders = Genders || product.Genders;
    product.Shipping = Shipping || product.Shipping;
    product.SizeFit = SizeFit || product.SizeFit;
    product.Images = Images || product.Images;
    // product.UserId = UserId;
    
    const updatedProduct = await product.save();
    res.status(200).json( {product: updatedProduct} );
  } else {
    const error = new HttpError(
      "Updating Product info failed, please try again in few moments",
      404
    );
    return next(error);
  }
  // try {
  // } catch (err) {
  //   const error = new HttpError(
  //     "Something went wrong, could not update the products",
  //     500
  //   );
  //   return next(error);
  // }

};





/* Create New Review for a Product */
const createProductReview = async (req, res, next) => {
  
  const {
    title,
    rating,
    comment,
  } = req.body;

  const productId = req.params.pid;

  console.log(productId)


  console.log(req.user)
  
  let product;
  
  // try {
    product = await Product.findById(productId);
    // } catch (err) {
      //   const error = new HttpError(
        //     "Something went wrong, could not update product.",
        //     500
        //   );
        //   return next(error);
        // }
        
        
  if(product) {
    const alreadyReviewed  = product.Reviews.find(r => r.user.toString() === req.user._id.toString())
    // console.log(product.Reviews)
    if(alreadyReviewed) {
      const error = new HttpError("Product was already reviewed", "400")
      return next(error);
    }

    // console.log(product)

    const review = {
      title,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      rating: Number(rating),
      comment,
      user: req.user._id
    }

    product.Reviews.push(review);

    product.NumReviews = product.Reviews.length;

    product.Rating = product.Reviews.reduce((acc, item) => item.rating + acc, 0 ) /product.Reviews.length;

    await product.save()
    res.status(201).json({message: "Review successfully added!"})

  } else {
    const error = new HttpError(
      "Review adding failed, please try again in few moments",
      404
    );
    return next(error);
  }
};





/* Delete (REMOVE) Product */
// const deleteProduct = async (req, res, next) => {
//   const productId = req.params.pid;

//   let product;
//   let product2;

//   try {
//     product = await Product.findById(productId).populate("Category");
//     product2 = await Product.findById(productId).populate("UserId");
//   } catch (err) {
//     const error = new HttpError(
//       "Something went wrong, could not delete the product. try again in few moments",
//       500
//     );
//     return next(error);
//   }
//   // console.log(product.productCategory.products); // product IDs in Category products Array

//   if (!product && !product2 ) {
//     const error = new HttpError("Could not find a product for this ID", 500);
//     return next(error);
//   }

//   // Removing Product and its ID from Category, Products IDs Array and Save Category
//   try {
//     const sess = await mongoose.startSession(); // start a session from mongooose
//     sess.startTransaction(); // start a transaction from mongoose
//     await product.remove({ session: sess }); // save created product
//     await product2.remove({ session: sess }); // save created product
//     product.Category.products.pull(product); // save category category ID (unique for the cat) from the product Category.products array removed
//     product2.UserId.products.pull(product2); // save user User ID (unique for the cat) from the product UserId.products array removed
//     await product.Category.save({ session: sess }); // add products Array to the category
//     await product2.UserId.save({ session: sess }); // add products Array to the user
//     await sess.commitTransaction(); // Commit the session from mongoose

//     // await product.remove(); // mongoose method remove() is a deleting method
//   } catch (err) {
//     const error = new HttpError(
//       "Something went wrong, could not delete the product. try again in few moments",
//       404
//     );
//     return next(error);
//   }

//   res.status(200).json({ message: "Product Successfully Deleted" });
// };


/* Delete (REMOVE) Product */
const deleteProduct = async (req, res, next) => {
  const productId = req.params.pid;

  let product;
  // let product2;

  try {
    product = await Product.findById(productId);
    // product2 = await Product.findById(productId).populate("UserId");
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

    await product.remove();
    // const sess = await mongoose.startSession(); // start a session from mongooose
    // sess.startTransaction(); // start a transaction from mongoose
    // await product.remove({ session: sess }); // save created product
    // await product2.remove({ session: sess }); // save created product
    // product.Category.products.pull(product); // save category category ID (unique for the cat) from the product Category.products array removed
    // product2.UserId.products.pull(product2); // save user User ID (unique for the cat) from the product UserId.products array removed
    // await product.Category.save({ session: sess }); // add products Array to the category
    // await product2.UserId.save({ session: sess }); // add products Array to the user
    // await sess.commitTransaction(); // Commit the session from mongoose

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
exports.createProductReview = createProductReview;
exports.deleteProduct = deleteProduct;
