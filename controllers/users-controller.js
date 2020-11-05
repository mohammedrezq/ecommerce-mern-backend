const { validationResult } = require("express-validator");
const generateToken = require("../utils/generateToken");

const HttpError = require("../models/http-error");
const user = require("../models/user");
const User = require("../models/user");
// const asyncHandler = require("express-async-handler");

/* Get List of registered users */

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find(
      {},
      "email firstName lastName Country Gender Avatar"
    );
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again in few moments",
      500
    );
    return next(error);
  }

  if (!users || users.length === 0) {
    const error = new HttpError("Could not find user ", 404);
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

/* Create (Register) new user */

const signup = async (req, res, next) => {
  const errors = validationResult(req); // Part of express-validator to check valiadtion for inputs

  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed please check your data again.",
      422
    );
    return next(error);
  }

  const {
    email,
    password,
    firstName,
    lastName,
    bio,
    cartHistory,
    DateOfBirth,
    Country,
    Gender,
  } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email }); // Check User existing by using email (unique email)
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again in few moments",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User already exists, please login instead",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    email,
    password,
    firstName,
    lastName,
    bio,
    cartHistory,
    DateOfBirth,
    Country,
    Gender,
    Avatar: "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png",
    products: [],
  });

  try {
    await createdUser.save(); // Signup new user using Save() method from mongoose
  } catch (err) {
    const error = new HttpError(
      "Signing up user failed, please try again in few moments",
      500
    );
    return next(error);
  }

  if (createdUser)
    res.status(201).json({
      users: {
        _id: createdUser._id,
        email: createdUser.email,
        // password:createdUser.password, // Should not be sent to the frontend!
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        bio: createdUser.bio,
        cartHistory: createdUser.cartHistory,
        DateOfBirth: createdUser.DateOfBirth,
        Country: createdUser.Country,
        Gender: createdUser.Gender,
        Avatar: createdUser.Avatar,
        products: [],
        token: generateToken(createdUser._id),
      },
    });
};

/* Login the registered user */

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email }); // Check if user exist using email as validator
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again in few moments",
      500
    );
    return next(error);
  }

  // if ( !existingUser || existingUser.password !== password) { // if email or password is wrong it sends back an error
  //   const error = new HttpError("Invalid credentials could not log you in.", 401);
  //   return next(error);
  // }
  console.log("thePassword", password);

  if (existingUser && (await existingUser.matchPassword(password))) {
    res.json({
      _id: existingUser._id,
      email: existingUser.email,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      isAdmin: existingUser.isAdmin,
      Country: existingUser.Country,
      Gender: existingUser.Gender,
      cartHistory: existingUser.cartHistory,
      DateOfBirth: existingUser.DateOfBirth,
      bio: existingUser.bio,
      token: generateToken(existingUser._id),
    });
  } else {
    const error = new HttpError("Invalid Email or Password", 401);
    return next(error);
  }

  // res.json({ message: "Logged In!" });
};

/* Get User BY ID (Profile) (For USER)  */

const getUserById = async (req, res, next) => {
  // const userId = req.params.uid;

  // console.log(userId)
  let user;
  try {
    user = await User.findById(req.user._id); // this will provide the user info for the user based on his id and Jsonwebtoken provided!
    // console.log(user)
  } catch (err) {
    const error = new HttpError(
      "Could not fetch user for the provided ID",
      500
    );
    return next(error);
  }

  // if (!user) {
  //   const error = new HttpError("Could not find a user for that ID!.", 404);
  //   return next(error);
  // }

  if (user) {
    res.json({ user: user.toObject({ getters: true }) });
  } else {
    const error = new HttpError("Could not find a user for that ID!.", 401);
    return next(error);
  }
};

/* Update User BY ID (Profile)  */

// const updateUserById = async (req, res, next) => {
//   // const userId = req.params.uid;

//   // console.log(userId)
//   let user;
//   try {
//     user = await User.findById(req.user._id); // this will provide the user info for the user based on his id and Jsonwebtoken provided!
//     // console.log(user)
//   } catch (err) {
//     const error = new HttpError(
//       "Could not fetch user for the provided ID",
//       500
//     );
//     return next(error);
//   }

//   // if (!user) {
//   //   const error = new HttpError("Could not find a user for that ID!.", 404);
//   //   return next(error);
//   // }

//   if (user) {
//     res.json({ user: user.toObject({ getters: true }) });
//   } else {
//     const error = new HttpError("Could not find a user for that ID!.", 401);
//     return next(error);
//   }
// };

/* Edit existing user info (UPDATE USER INFO BY USER) */

const editUser = async (req, res, next) => {

    let user = await User.findById(req.user._id);


  if(user) {
    user.bio = req.body.bio; // In case It is OK for field to be empty
    user.email = req.body.email || user.email;
    if(req.body.password) {
      user.password = req.body.password 
    }
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.DateOfBirth = req.body.DateOfBirth || user.DateOfBirth;
    user.Country = req.body.Country || user.Country;
    user.Gender = req.body.Gender || user.Gender;
    // user.Avatar = req.body.Avatar || user.Avatar;

    const updatedUser = await user.save();

    res.json({
        email: updatedUser.email,
        password: updatedUser.password,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        isAdmin: updatedUser.isAdmin,
        Country: updatedUser.Country,
        Gender: updatedUser.Gender,
        DateOfBirth: updatedUser.DateOfBirth,
        bio: updatedUser.bio,
        _id: updatedUser._id,
        token: generateToken(updatedUser._id),
    });

    } else {
      const error = new HttpError(
        "Updating user info failed, please try again in few moments",
        404
      );
      return next(error);
    }

};

/* delete existing user */

const deleteUser = async (req, res, next) => {
  const userId = req.params.uid;

  let user;

  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again in few moments",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find a user for this ID", 404);
    return next(error);
  }

  try {
    await user.remove(); // Deleting user from user list
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete the user. please try again in few moments",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "User Deleted." });
};


/* Get List of registered users */

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find(
      {},
      "email firstName lastName Country DateOfBirth Gender Avatar isAdmin"
    );
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again in few moments",
      500
    );
    return next(error);
  }

  if (!users || users.length === 0) {
    const error = new HttpError("Could not find any user", 404);
    return next(error);
  }

  res.json( users.map((user) => user.toObject({ getters: true })) );
};


/* Get User BY ID (Profile) (For Admin)  */

const getUserByIdAdmin = async (req, res, next) => {
  const userId = req.params.uid;

  // console.log(userId)
  let user;
  try {
    user = await User.findById(userId).select('-password'); // this will provide the user info for the user based on his id and Jsonwebtoken provided!
    // console.log(user)
  } catch (err) {
    const error = new HttpError(
      "Could not fetch user for the provided ID",
      500
    );
    return next(error);
  }

  // if (!user) {
  //   const error = new HttpError("Could not find a user for that ID!.", 404);
  //   return next(error);
  // }

  if (user) {
    res.json( user.toObject({ getters: true }) );
  } else {
    const error = new HttpError("Could not find a user for that ID!.", 401);
    return next(error);
  }
};


/* Edit  user info (UPDATE USER INFO BY ADMIN) */

const editUserAdmin = async (req, res, next) => {
  const userId = req.params.uid;


    let user = await User.findById(userId);
  console.log(user)


if(user) {
  user.bio = req.body.bio; // In case It is OK for field to be empty
  user.email = req.body.email || user.email;
  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;
  user.DateOfBirth = req.body.DateOfBirth || user.DateOfBirth;
  user.Country = req.body.Country || user.Country;
  user.Gender = req.body.Gender || user.Gender;
  user.isAdmin = req.body.isAdmin; // In case It is OK for field to be empty
  // user.Avatar = req.body.Avatar || user.Avatar;

  const updatedUser = await user.save();

  res.json({
      email: updatedUser.email,
      password: updatedUser.password,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      isAdmin: updatedUser.isAdmin,
      Country: updatedUser.Country,
      Gender: updatedUser.Gender,
      DateOfBirth: updatedUser.DateOfBirth,
      isAdmin: updatedUser.isAdmin,
      bio: updatedUser.bio,
      _id: updatedUser._id,
  });

  } else {
    const error = new HttpError(
      "Updating user info failed, please try again in few moments",
      404
    );
    return next(error);
  }

};


exports.getUsers = getUsers;
exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;
exports.editUser = editUser;
exports.editUserAdmin = editUserAdmin;
exports.getUserById = getUserById;
exports.getUserByIdAdmin = getUserByIdAdmin;
exports.deleteUser = deleteUser;
