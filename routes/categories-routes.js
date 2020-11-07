const express = require("express");
const { check } = require("express-validator");

const { protect, adminstrator } = require('../middleware/authMiddleware');

const categoreisController = require("../controllers/categories-controller");

const router = express.Router(); // const { Router } = require('express');

/* Create New Category */

router.post(
  "/",
  check("categoryTitle").not().isEmpty(),
  check("categoryDescription").not().isEmpty().isLength({ min: 3 }), protect, adminstrator,
  categoreisController.createCategory
);

/* Get Category By ID (For Admin) */

router.get("/:cid", protect, adminstrator, categoreisController.getCategoryById);

/* Get All Categories (For Admin) */

router.get("/", protect, adminstrator, categoreisController.getAllCategories);

/* Get Category By ID ( For Users ) */

router.get("/:cid", categoreisController.getCategoryByIdUsers);

/* Get All Categories (For Users) */

router.get("/", categoreisController.getAllCategoriesUsers);

/* Update Existing Category */

router.put(
  "/:cid",
  // check("categoryTitle").not().isEmpty(),
  // check("categoryDescription").not().isEmpty().isLength({ min: 3 }),
  protect, adminstrator,
  categoreisController.updateCategory
);

/* Delete Existing Category */

router.delete("/:cid", categoreisController.deleteCategory);

module.exports = router;
