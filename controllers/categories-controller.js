const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");

const { validationResult } = require("express-validator");
const Cat = require("../models/category");

/* Create a category */

const createCategory = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed please check input fields again.",
      422
    );
    return next(error);
  }

  const { categoryTitle, categoryDescription } = req.body; // const categoryTitle = req.body.categoryTitle;

  const createdCategory = new Cat({
    categoryTitle,
    categoryDescription,
    products: []
  });

  try {
    await createdCategory.save();
  } catch (err) {
    const error = new HttpError(
      "Creating a category failed, please try again.",
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ category: createdCategory });
};

/* Get Category By ID */

const getCategoryById = async (req, res, next) => {
  const catId = req.params.cid;

  let category;
  try {
    category = await Cat.findById(catId);
  } catch (err) {
    const error = new HttpError(
      "Could not find category for the provided ID",
      500
    );
    return next(error);
  }

  if (!category) {
    const error = new HttpError(
      "Could not fetch category for the provided ID.",
      404
    );
    return next(error);
  }

  res.json({ category: category.toObject({ getters: true }) });
};

/* Get All Categories */

const getAllCategories = async (req, res, next) => {
  
  let categories;
  try {
    categories = await Cat.find();
  } catch(err) {
    const error = new HttpError("Could not fetch any categories, please try again in few moments", 422);
    return next(error);
  }

  if (categories.length === 0 ) {
    const error = new HttpError("Could not fetch any categories.", 422);
    return next(error);
  }


  res.json({ categories: categories.map((category) => category.toObject( { getters: true } )) });
};

/* Update Category (BY ID) */

const updateCategory = async (req, res, next) => {

  const errors = validationResult(req); // Part of express-validator to check valiadtion for inputs
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Update Failed due to invalid inputs please check the data in the input fields again.",
        422
      )
    );
  }

  const { categoryTitle, categoryDescription } = req.body;

  const catId = req.params.cid;

  let category;
  try {
    category = await Cat.findById(catId);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update category.", 500);
    return next(error);
  }

  category.categoryTitle = categoryTitle;
  category.categoryDescription = categoryDescription;

  try {
    await category.save();
  } catch (err) {
    const error = new HttpError("Category updating failed, please try again in few moments.", 500);
    return next(error);
  }

  res.status(200).json({
    category: category.toObject( { getters: true } ),
    message: "Category Successfully Updated",
  });
};

/* Deleting a Category */

const deleteCategory = async (req, res, next) => {
  const catId = req.params.cid;

  let category;
  try {
    category = await Cat.findById(catId);
  } catch (err) {
    const error = new HttpError("Could not fetch category for the provided ID", 404);
    return next(error);
  }

  if (!category) {
    const error =  new HttpError("Could not find category for the provided ID", 500);
    return next(error);
  }

  try {
    await category.remove();
  } catch (err) {
    const error = new HttpError("Could not delete the category, please try again in few moments", 500);
    return next(error);
  }

  res.json({ message: "Category Successfully Deleted." });
};

exports.createCategory = createCategory;
exports.getCategoryById = getCategoryById;
exports.getAllCategories = getAllCategories;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
