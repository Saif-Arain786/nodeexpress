require('dotenv').config();
const jwt = require("jsonwebtoken");
exports.authmiddleware = (req, res, next) => {
    try {
        console.log("Auth Middleware Triggered", req.headers.authorization);
        token = req.headers.authorization // Assuming Bearer token format
        secret = process.env.JWT_SECRET
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                console.error("JWT Verification Error:", err);
                return res.status(401).json({
                    status: false,
                    message: "Unauthorized access",
                    error: err.message,
                });
            }
            req._id = decoded._id; // Assuming the token contains user ID
            console.log(decoded) // bar
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