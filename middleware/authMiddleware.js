const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler')

const HttpError = require("../models/http-error");
const User = require("../models/user");

const protect = async( req, res, next ) => {
    // let token
    // console.log(token)
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // console.log("token found")
            // console.log("theToken wereFound ", token)
            let token;
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // console.log("decoded Token", decoded)

            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (err) {
            console.error(err);
            const error = new HttpError("Not authorized 1 , token failed.", 401);
            return next(error);
        }
    } else {
        console.error(err);
        const error = new HttpError("Not authorized 2", 401);
        return next(error);
    }

    // console.log(token)

    if(!token) {
        const error = new HttpError("Not Authorized", 401);
        return next(error);
    }

    next()
};

module.exports = protect;