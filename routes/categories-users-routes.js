const express = require("express");
// const { check } = require("express-validator");

// const { protect, adminstrator } = require('../middleware/authMiddleware');

const categoreisController = require("../controllers/categories-controller");

const router = express.Router(); // const { Router } = require('express');

/* Get Category By ID ( For Users ) */

router.get("/:cid", categoreisController.getCategoryByIdUsers);

/* Get All Categories (For Users) */

router.get("/", categoreisController.getAllCategoriesUsers);

module.exports = router;
