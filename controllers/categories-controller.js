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

  const { categoryTitle, categoryDescription, categoryImage } = req.body; // const categoryTitle = req.body.categoryTitle;

  const createdCategory = new Cat({
    categoryTitle,
    categoryDescription,
    categoryImage,
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
    .json( createdCategory );
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

  if(category) {
    res.json( category.toObject({ getters: true }) );
  }
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

  if (!categories || categories.length === 0 ) {
    const error = new HttpError("Could not fetch any categories.", 422);
    return next(error);
  }


  res.json( categories.map((category) => category.toObject( { getters: true } )) );
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

  const { categoryTitle, categoryDescription, categoryImage } = req.body;

  const catId = req.params.cid;

  let category;
  try {
    category = await Cat.findById(catId);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update category.", 500);
    return next(error);
  }

   // if title or description have not updated then keep the one already exist
  if (category) { // check if categroy exist
    category.categoryTitle = categoryTitle || category.categoryTitle;
    category.categoryDescription = categoryDescription || category.categoryDescription;
    category.categoryImage = categoryImage || category.categoryImage;
  }

  let updatedCategory;

  try {
    updatedCategory = await category.save();
  } catch (err) {
    const error = new HttpError("Category updating failed, please try again in few moments.", 500);
    return next(error);
  }

  res.status(200).json( updatedCategory.toObject( { getters: true } ) );
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




/* Get Category By ID */

const getCategoryByIdUsers = async (req, res, next) => {
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

  if(category) {
    res.json( category.toObject({ getters: true }) );
  }
};

/* Get All Categories */

const getAllCategoriesUsers = async (req, res, next) => {
  
  let categories;
  try {
    categories = await Cat.find();
  } catch(err) {
    const error = new HttpError("Could not fetch any categories, please try again in few moments", 422);
    return next(error);
  }

  if (!categories || categories.length === 0 ) {
    const error = new HttpError("Could not fetch any categories.", 422);
    return next(error);
  }


  res.json( categories.map((category) => category.toObject( { getters: true } )) );
};


exports.createCategory = createCategory;
exports.getCategoryById = getCategoryById;
exports.getAllCategories = getAllCategories;
exports.getCategoryByIdUsers = getCategoryByIdUsers;
exports.getAllCategoriesUsers = getAllCategoriesUsers;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
