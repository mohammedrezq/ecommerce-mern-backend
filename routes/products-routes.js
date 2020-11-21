const express = require("express");
const { check } = require("express-validator");

const productsController = require("../controllers/products-controller");
const { protect, adminstrator } = require('../middleware/authMiddleware');

const router = express.Router(); // const { Router } = require('express');

/* Get List of all products by High Prices */

router.get("/HighestPrice", productsController.getAllProductsHighPrice);

/* Get List of all products by Low Prices */

router.get("/LowestPrice", productsController.getAllProductsLowPrice);

/* Get List of  Top Rated products */

router.get("/TopRated", productsController.getTopProductsRating);


/* Get Product (Link) by product Id */

router.get("/:pid", productsController.getProductById);

/* Get List of all products */

router.get("/", productsController.getAllProducts);

/* Get Product (Link) by user Id (productCreator id) */

router.get("/user/:uid", productsController.getProductsByUserId);

/* Create New Product */

router.post(
  "/",
  protect,
  adminstrator,
  [
    check("Title").not().isEmpty(),
    check("Description").not().isEmpty(),
    check("Price").not().isEmpty(),
    check("CountInStock").not().isEmpty(),
    check("Category").not().isEmpty(),
    check("Images").not().isEmpty(),
  ],

  productsController.createProduct
);

/* Update Product */

router.put(
  "/:pid", protect, adminstrator,
  [
    check("Title").not().isEmpty(),
    check("Description").not().isEmpty(),
    check("Price").not().isEmpty(),
    check("CountInStock").not().isEmpty(),
    check("Category").not().isEmpty(),
    check("Images").not().isEmpty(),
  ],
  productsController.updateProduct
);

/* Create Product Review */

router.post("/:pid/reviews", protect, productsController.createProductReview);

/* Delete (REMOVE) Product */

router.delete("/:pid", protect, adminstrator, productsController.deleteProduct);

module.exports = router;
