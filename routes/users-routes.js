const express = require("express");
const { check } = require("express-validator");

const protect = require("../middleware/authMiddleware");
const usersController = require("../controllers/users-controller");

const router = express.Router();

/* Get List of registered users */
router.get("/", usersController.getUsers);

/* Create (Register) new user */
router.post("/signup", [
    check("email").normalizeEmail() // check if Test@test.com =>  test@test.com
    .isEmail(),
    check("password").isLength( {min: 6} ),
    check("firstName").not().isEmpty(),
    check("lastName").not().isEmpty(),
    check("DateOfBirth").not().isEmpty(),
    check("Country").not().isEmpty(),
    check("Gender").not().isEmpty(),
] , usersController.signup);

/* Login the registered user */
router.post("/login", usersController.login);

/* Get User BY ID (Profile)  */
router.get("/profile", protect,usersController.getUserById);

/* Update existing user info */
router.put("/profile", 
[
    check("email").normalizeEmail() // check if Test@test.com =>  test@test.com
    .isEmail().optional(),
    check("password").isLength( {min: 6} ).optional(),
    check("firstName").optional(),
    check("lastName").optional(),
    check("DateOfBirth").optional(),
    check("Country").optional(),
    check("Gender").optional(),
    check("bio").optional({checkFalsy: true}), // Soruce: https://express-validator.github.io/docs/validation-chain-api.html#optionaloptions 
] ,
protect , usersController.editUser);

/* delete existing user */
router.delete("/:uid", usersController.deleteUser);

module.exports = router;
