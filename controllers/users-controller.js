const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

let DUMMY_USERS = [
  {
    id: "u1",
    email: "mohammed@gmail.com",
    password: 123456,
    fisrtName: "mohammed",
    lastName: "rezq",
    DateOfBirth: "30/12/1992",
    Country: "USA",
    Gender: "Male",
    Avatar:
      "https://thumbs.dreamstime.com/b/default-avatar-photo-placeholder-profile-icon-eps-file-easy-to-edit-default-avatar-photo-placeholder-profile-icon-124557887.jpg",
  },
];

/* Get List of registered users */

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

/* Create new user */

const signup = (req, res, next) => {

    const errors = validationResult(req); // Part of express-validator to check valiadtion for inputs

    if (!errors.isEmpty()) {
      throw new HttpError("Invalid inputs passed please check your data again.", 422)
    }

  const {
    email,
    password,
    fisrtName,
    lastName,
    DateOfBirth,
    Country,
    Gender,
    Avatar,
  } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);

  if (hasUser) {
    const error = new HttpError(
      "Could not create user, Email already exists.",
      422
    ); // 402 invalid user input

    return next(error);
  }

  const createdUser = {
    id: uuidv4(),
    email,
    password,
    fisrtName,
    lastName,
    DateOfBirth,
    Country,
    Gender,
    Avatar,
  };

  DUMMY_USERS.unshift(createdUser);

  res.status(201).json({ users: createdUser });
};

/* Login the registered user */

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    const error = new HttpError(
      "Credentials seems to be wrong, could not identify user.",
      401
    ); // 401 authentication failed
    return next(error);
  }

  res.json({ message: "Logged In!" });
};

/* Get User BY ID (Profile)  */

const getUserById = (req, res, next) => {
  const userId = req.params.uid;

  const user = DUMMY_USERS.find((u) => u.id === userId);

  if (!user) {
    const error = new HttpError("Could not find a user for that ID!.", 404);
    return next(error);
  }

  res.json({ user });
};

/* Edit existing user info */

const editUser = (req, res, next) => {

    const errors = validationResult(req);  // Part of express-validator to check valiadtion for inputs

    if(!errors.isEmpty()) {
        throw new HttpError("Invalid inputs passed please check your data again.", 422 )
    }

  const {
    email,
    password,
    fisrtName,
    lastName,
    DateOfBirth,
    Country,
    Gender,
    Avatar,
  } = req.body;

  const userId = req.params.uid;
  // make sure to make a copy of existing info (Spread operator.)
  const updatedUser = { ...DUMMY_USERS.find((u) => u.id === userId) };
  const userIndex = DUMMY_USERS.findIndex((u) => u.id === userId);

  updatedUser.email = email;
  updatedUser.password = password;
  updatedUser.fisrtName = fisrtName;
  updatedUser.lastName = lastName;
  updatedUser.DateOfBirth = DateOfBirth;
  updatedUser.Country = Country;
  updatedUser.Gender = Gender;
  updatedUser.Avatar = Avatar;

  DUMMY_USERS[userIndex] = updatedUser;

  res.status(200).json({ users: updatedUser, message: "User info updated!" });
};

/* delete existing user */

const deleteUser = (req, res, next) => {
  const userId = req.params.uid;

  if (!DUMMY_USERS.find( u => u.id === userId)) {
      const error = new HttpError("Could not find a user for that ID.", 404);
      return next(error);
  }

  DUMMY_USERS = DUMMY_USERS.filter((u) => u.id !== userId);

  res.status(200).json({ message: "User Successfully Deleted." });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.editUser = editUser;
exports.getUserById = getUserById;
exports.deleteUser = deleteUser;
