const express = require("express");
const { check } = require("express-validator");

const productsController = require("../controllers/products-controller");

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
  [
    check("productTitle").not().isEmpty(),
    check("productDescription").not().isEmpty().isLength({ min: 10 }),
    check("productPrice").not().isEmpty(),
    check("productCategory").not().isEmpty(),
    check("productSizes").not().isEmpty(),
    check("productColors").not().isEmpty(),
    check("genders").not().isEmpty(),
    check("productShipping").not().isEmpty(),
    check("productSizeFit").not().isEmpty(),
    check("productImages").not().isEmpty(),
  ],

  productsController.createProduct
);

/* Update Product */

router.patch(
  "/:pid",
  [
    check("productTitle").not().isEmpty(),
    check("productDescription").not().isEmpty().isLength({ min: 10 }),
    check("productPrice").not().isEmpty(),
    check("productCategory").not().isEmpty(),
    check("productSizes").not().isEmpty(),
    check("productColors").not().isEmpty(),
    check("genders").not().isEmpty(),
    check("productShipping").not().isEmpty(),
    check("productSizeFit").not().isEmpty(),
    check("productImages").not().isEmpty(),
  ],
  productsController.updateProduct
);

/* Delete (REMOVE) Product */

router.delete("/:pid", productsController.deleteProduct);

module.exports = router;
