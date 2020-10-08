const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controller");

const router = express.Router();

/* Get List of registered users */
router.get("/", usersController.getUsers);

/* Create new user */
router.post("/signup", [
    check("email").normalizeEmail() // check if Test@test.com =>  test@test.com
    .isEmail(),
    check("password").isLength( {min: 6} ),
    check("fisrtName").not().isEmpty(),
    check("lastName").not().isEmpty(),
    check("DateOfBirth").not().isEmpty(),
    check("Country").not().isEmpty(),
    check("Gender").not().isEmpty(),
    check("Avatar").not().isEmpty(),
] , usersController.signup);

/* Login the registered user */
router.post("/login", usersController.login);

/* Get User BY ID (Profile)  */
router.get("/profile/:uid", usersController.getUserById);

/* Edit existing user info */
router.patch("/edit/:uid", [
    check("email").normalizeEmail() // check if Test@test.com =>  test@test.com
    .isEmail(),
    check("password").isLength( {min: 6} ),
    check("fisrtName").not().isEmpty(),
    check("lastName").not().isEmpty(),
    check("DateOfBirth").not().isEmpty(),
    check("Country").not().isEmpty(),
    check("Gender").not().isEmpty(),
    check("Avatar").not().isEmpty(),
] , usersController.editUser);

/* delete existing user */
router.delete("/:uid", usersController.deleteUser);

module.exports = router;
