const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler')

const HttpError = require("../models/http-error");
const User = require("../models/user");

const protect = async( req, res, next ) => {
    // let token
    // console.log(token)
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            let token;
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (err) {
            const error = new HttpError("Not authorized , token failed.", 401);
            return next(error);
        }
    } else {
        const error = new HttpError("Not authorized", 401);
        return next(error);
    }


    if(!token) {
        const error = new HttpError("Not Authorized, No Token", 401);
        return next(error);
    }

    next()
};


const adminstrator = async (req, res, next) => {
    if(req.user && req.user.isAdmin) {
        next();
    } else {
        const error = new HttpError("Not Authorized To Access this page, Only Adminstrator", 401)
        return next(error);
    }
}


// module.exports = protect;
exports.protect = protect;
exports.adminstrator = adminstrator;