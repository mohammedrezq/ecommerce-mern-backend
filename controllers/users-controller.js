const { validationResult } = require("express-validator");
const generateToken = require("../utils/generateToken");

const HttpError = require("../models/http-error");
const user = require("../models/user");
const User = require("../models/user");

/* Get List of registered users */

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find( {}, "email firstName lastName Country Gender Avatar" );
  } catch (err) {
    const error = new HttpError("Fetching users failed, please try again in few moments", 500);
    return next(error);
  }

  if (!users || users.length === 0 ) {
    const error = new HttpError("Could not find user ", 404);
    return next(error);
  }

  res.json({ users: users.map(user => user.toObject( { getters: true } )) });
};

/* Create (Register) new user */

const signup = async (req, res, next) => {

    const errors = validationResult(req); // Part of express-validator to check valiadtion for inputs

    if (!errors.isEmpty()) {
      const error = new HttpError("Invalid inputs passed please check your data again.", 422);
      return next(error);
    }

  const {
    email,
    password,
    fisrtName,
    lastName,
    bio,
    cartHistory,
    DateOfBirth,
    Country,
    Gender,
  } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({email: email}); // Check User existing by using email (unique email)
  } catch(err) {
    const error = new HttpError("Signing up failed, please try again in few moments", 500);
    return next(error);
  }

  if(existingUser) {
    const error = new HttpError("User already exists, please login instead", 422);
    return next(error);
  }

  const createdUser = new User( {
    email,
    password,
    fisrtName,
    lastName,
    bio,
    cartHistory,
    DateOfBirth,
    Country,
    Gender,
    Avatar: "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png",
    products: [],
  } )
  
  try {
    await createdUser.save(); // Signup new user using Save() method from mongoose
  } catch (err) {
    const error = new HttpError("Signing up user failed, please try again in few moments", 500);
    return next(error);
  }

  if(createdUser)
  res.status(201).json({ users: {
    _id:createdUser._id,
    email:createdUser.email,
    // password:createdUser.password, // Should not be sent to the frontend!
    fisrtName:createdUser.fisrtName,
    lastName:createdUser.lastName,
    bio:createdUser.bio,
    cartHistory:createdUser.cartHistory,
    DateOfBirth:createdUser.DateOfBirth,
    Country:createdUser.Country,
    Gender:createdUser.Gender,
    Avatar:createdUser.Avatar,
    products: [],
    token: generateToken(createdUser._id)
  } });
};

/* Login the registered user */

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({email}); // Check if user exist using email as validator
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again in few moments", 500);
    return next(error);
  }

  // if ( !existingUser || existingUser.password !== password) { // if email or password is wrong it sends back an error
  //   const error = new HttpError("Invalid credentials could not log you in.", 401);
  //   return next(error);
  // }
  console.log("thePassword", password)

  if(existingUser && (await existingUser.matchPassword(password))) {
    res.json({
      _id: existingUser._id,
      email: existingUser.email,
      firstName: existingUser.fisrtName,
      lastName: existingUser.lastName,
      isAdmin: existingUser.isAdmin,
      Country: existingUser.Country,
      Gender: existingUser.Gender,
      cartHistory: existingUser.cartHistory,
      DateOfBirth: existingUser.DateOfBirth,
      bio: existingUser.bio,
      token: generateToken(existingUser._id)
    })
  } else {
    const error = new HttpError("Invalid Email or Password", 401);
    return next(error);
  }


  // res.json({ message: "Logged In!" });
};

/* Get User BY ID (Profile)  */

const getUserById = async (req, res, next) => {
  // const userId = req.params.uid;

  // console.log(userId)
  let user;
  try {
    user = await User.findById(req.user._id); // this will provide the user info for the user based on his id and Jsonwebtoken provided!
    // console.log(user)
  } catch (err) {
    const error = new HttpError("Could not fetch user for the provided ID", 500);
    return next(error);
  }

  // if (!user) {
  //   const error = new HttpError("Could not find a user for that ID!.", 404);
  //   return next(error);
  // }

  if(user) {
    res.json({ user: user.toObject( { getters: true } ) });
  } else {
    const error = new HttpError("Could not find a user for that ID!.", 401);
    return next(error);
  }
};

/* Edit existing user info (UPDATE USER INFO) */

const editUser = async (req, res, next) => {

    const errors = validationResult(req);  // Part of express-validator to check valiadtion for inputs

    if(!errors.isEmpty()) {
        const error = new HttpError("Invalid inputs passed please check your data again.", 422 );
        return next(error);
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

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update user.", 500);
    return next(error);
  }

  user.email = email;
  user.password = password;
  user.fisrtName = fisrtName;
  user.lastName = lastName;
  user.DateOfBirth = DateOfBirth;
  user.Country = Country;
  user.Gender = Gender;
  user.Avatar = Avatar;

  // DUMMY_USERS[userIndex] = updatedUser;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError("Updating user info failed, please try again in few moments", 500);
    return next(error);
  }

  res.status(200).json({ users: user.toObject( {getters: true} ), message: "User info updated!" });
};

/* delete existing user */

const deleteUser = async (req, res, next) => {
  const userId = req.params.uid;

  let user;

  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again in few moments", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find a user for this ID", 404);
    return next(error);
  }

  try {
    await user.remove(); // Deleting user from user list 
  } catch (err) {
    const error = new HttpError("Something went wrong, could not delete the user. please try again in few moments", 500);
    return next(error);
  }

  res.status(200).json({ message: "User Successfully Deleted." });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.editUser = editUser;
exports.getUserById = getUserById;
exports.deleteUser = deleteUser;
