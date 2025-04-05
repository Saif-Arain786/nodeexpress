require('dotenv').config();
const jwt = require("jsonwebtoken");
exports.authmiddleware = (req, res, next) => {
    try {
        console.log("Auth Middleware Triggered", req.headers.authorization);
        token = req.headers.authorization // Assuming Bearer token format
        secret = process.env.JWT_SECRET
        jwt.verify(token, secret, function (err, decoded) {
            console.log(decoded.foo) // bar
        });
        next();


    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(500).json({
            status: false,
            message: "An error occurred in the authentication middleware",
            error: error.message,
        });

    }

}