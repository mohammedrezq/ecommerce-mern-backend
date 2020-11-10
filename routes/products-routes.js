const express = require("express");
const { check } = require("express-validator");

const productsController = require("../controllers/products-controller");
const { protect, adminstrator } = require('../middleware/authMiddleware');
const fileUpload = require('../middleware/fileuploadMiddleware');

const router = express.Router(); // const { Router } = require('express');

/* Get Product (Link) by product Id */

router.get("/:pid", productsController.getProductById);

/* Get List of all products */

router.get("/", productsController.getAllProducts);

/* Get Product (Link) by user Id (productCreator id) */

router.get("/user/:uid", productsController.getProductsByUserId);

/* Create New Product */

router.post(
  "/",
  // fileUpload.array("Images")
  // ,
  [
    check("Title").not().isEmpty(),
    check("Description").not().isEmpty().isLength({ min: 10 }),
    check("Price").not().isEmpty(),
    check("CountInStock").not().isEmpty(),
    check("Category").not().isEmpty(),
    check("Images").not().isEmpty(),
  ],

  productsController.createProduct
);

/* Update Product */

router.patch(
  "/:pid",
  [
    check("Title").not().isEmpty(),
    check("Description").not().isEmpty().isLength({ min: 10 }),
    check("Price").not().isEmpty(),
    check("CountInStock").not().isEmpty(),
    check("Category").not().isEmpty(),
    check("Images").not().isEmpty(),
  ],
  productsController.updateProduct
);

/* Delete (REMOVE) Product */

router.delete("/:pid", protect, adminstrator, productsController.deleteProduct);

module.exports = router;
