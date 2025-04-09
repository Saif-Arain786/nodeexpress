require('dotenv').config();
const jwt = require("jsonwebtoken");

exports.authmiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("Auth Middleware Triggered", authHeader);

        if (!authHeader) {
            return res.status(401).json({
                status: false,
                message: "No token provided",
            });
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        const secret = process.env.JWT_SECRET;

        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                console.error("JWT Verification Error:", err);

                // Handle specific JWT errors
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({
                        status: false,
                        message: "Token expired. Please login again.",
                    });
                }

                if (err.name === "JsonWebTokenError") {
                    return res.status(401).json({
                        status: false,
                        message: "Invalid token. Please login again.",
                    });
                }

                return res.status(401).json({
                    status: false,
                    message: "Unauthorized access",
                    error: err.message,
                });
            }

            // Token is valid
            req._id = decoded._id;
            console.log("Decoded JWT:", decoded);
            next(); // ✅ Only call next here
        });

    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(500).json({
            status: false,
            message: "An error occurred in the authentication middleware",
            error: error.message,
        });
    }
};
