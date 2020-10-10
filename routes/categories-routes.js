const express = require("express");
const { check } = require("express-validator");

const categoreisController = require("../controllers/categories-controller");

const router = express.Router(); // const { Router } = require('express');

/* Create New Category */

router.post(
  "/",
  check("categoryTitle").not().isEmpty(),
  check("categoryDescription").not().isEmpty().isLength({ min: 5 }),
  categoreisController.createCategory
);

/* Get Category By ID */

router.get("/:cid", categoreisController.getCategoryById);

/* Get All Categories */

router.get("/", categoreisController.getAllCategories);

/* Update Existing Category */

router.patch(
  "/edit/:cid",
  check("categoryTitle").not().isEmpty(),
  check("categoryDescription").not().isEmpty().isLength({ min: 5 }),
  categoreisController.updateCategory
);

/* Delete Existing Category */

router.delete("/:cid", categoreisController.deleteCategory);

module.exports = router;
