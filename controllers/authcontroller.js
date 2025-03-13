
const userValidate = require("../Validator/authVAlidate.js");

exports.signup = async (req, res) => {
    try {
        // Validate user input and collect all errors
        const validation = userValidate.validate(req.body, { abortEarly: false }); // Prevent stopping at the first error

        if (validation.error) {
            // Extract all error messages
            const errorMessages = validation.error.details.map(err => err.message);

            console.error("Validation Errors:", errorMessages); // Log all errors in console

            return res.status(400).json({
                status: false,
                message: "Validation failed",
                errors: errorMessages, // Return all errors
            });
        }

        // Success response
        return res.status(200).json({
            status: true,
            message: "User signed up successfully",
        });

    } catch (error) {
        console.error("Signup Error:", error); // Log error in console
        return res.status(500).json({
            status: false,
            message: "An error occurred while signing up the user",
            error: error.message, // Return error in response
        });
    }
};


exports.login = async (req, res) => {
    try {
        return res.status(200).json({
            status: true,
            message: "User logged in successfully",
        });

    } catch (error) {
        console.error("Login Error:", error); // Log error in console
        return res.status(500).json({
            status: false,
            message: "An error occurred while logging in the user",
            error: error.message, // Return error in response
        });
    }
};
