const authmodel = require("../models/authmodel.js");
const userValidate = require("../Validator/authVAlidate.js");
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');


// Reusable function to send OTP email
const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "One Time Password (OTP)",
        html: `<h1>Verify Account</h1><p>Your OTP is ${otp}</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("OTP email sent successfully");
    } catch (err) {
        console.error("Error sending OTP email:", err);
        throw new Error("Failed to send OTP email");
    }
};

exports.signup = async (req, res) => {
    try {
        // Validate user input
        const validation = userValidate.validate(req.body, { abortEarly: false });

        if (validation.error) {
            const errorMessages = validation.error.details.map((err) => err.message);
            console.error("Validation Errors:", errorMessages);
            return res.status(400).json({
                status: false,
                message: "Validation failed",
                errors: errorMessages,
            });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000); // Ensure 6-digit OTP

        // Send OTP email
        await sendOtpEmail(req.body.email, otp);


        // Hash password BEFORE saving user
        const saltRounds = 12;
        req.body.password = await bcrypt.hash(req.body.password, saltRounds);

        console.log("Hashed Password:", req.body.password);

        // Save user to database
        const user = new authmodel({ ...req.body, otp }); // Include OTP in the user document
        const userSaved = await user.save();

        if (!userSaved) {
            return res.status(400).json({
                status: false,
                message: "Failed to save user",
            });
        }

        // Success response
        return res.status(200).json({
            status: true,
            message: "User signed up successfully",
            data: userSaved,
        });
    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({
            status: false,
            message: "An error occurred while signing up the user",
            error: error.message,
        });
    }
};

exports.login = async (req, res) => {
    try {
        // Add your login logic here
        return res.status(200).json({
            status: true,
            message: "User logged in successfully",
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            status: false,
            message: "An error occurred while logging in the user",
            error: error.message,
        });
    }
};
