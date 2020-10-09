const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");

const { validationResult } = require("express-validator");

let DUMMY_CATEGORIES = [];

const createCategory = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed please check input fields again.",
      422
    );
    return next(error);
  }

  const { categoryTitle, categoryDescription } = req.body;

  // const categoryTitle = req.body.categoryTitle;

  const createdCategory = {
    id: uuidv4(),
    categoryTitle,
    categoryDescription,
  };

  DUMMY_CATEGORIES.unshift(createdCategory); //<push> if we want to make it to be the last element to be added

  res.status(201).json({ category: createdCategory });
};

/* Get Category By ID */

const getCategoryById = (req, res, next) => {
  const catId = req.params.cid;

  const categories = DUMMY_CATEGORIES.filter((c) => c.id === catId);

  if (!categories || categories.length === 0) {
    const error = new HttpError(
      "Could not find category for the provided ID.",
      404
    );
    return next(error);
  }

  res.json({ categories });
};

/* Get All Categories */

const getAllCategories = (req, res, next) => {
  res.json({ categories: DUMMY_CATEGORIES });
};

/* Update Category (BY ID) */

const updateCategory = (req, res, next) => {

  const errors = validationResult(req); // Part of express-validator to check valiadtion for inputs
  if (!errors.isEmpty()) {
    return next( new HttpError(
      "Update Failed due to invalid inputs please check the data in the input fields again.",
      422
    ));
  }

  const { categoryTitle, categoryDescription } = req.body;

  const catId = req.params.cid;

  const updatedCategory = { ...DUMMY_CATEGORIES.find((c) => c.id === catId) };

  const categoryIndex = DUMMY_CATEGORIES.findIndex((c) => c.id === catId);

  updatedCategory.categoryTitle = categoryTitle;
  updatedCategory.categoryDescription = categoryDescription;

  DUMMY_CATEGORIES[categoryIndex] = updatedCategory;

  res.status(200).json({
    category: updatedCategory,
    message: "Category Successfully Updated",
  });
};

/* Deleting a Category */

const deleteCategory = (req, res, next) => {
  const catId = req.params.cid;

  if (!DUMMY_CATEGORIES.find((c) => c.id === catId)) {
    const error = new HttpError(
      "Could not find a category for the provided ID.",
      404
    );
    return next(error);
  }

  DUMMY_CATEGORIES = DUMMY_CATEGORIES.filter((c) => c.id !== catId);

  res.json({ message: "Category Successfully Deleted." });
};

exports.createCategory = createCategory;
exports.getCategoryById = getCategoryById;
exports.getAllCategories = getAllCategories;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
