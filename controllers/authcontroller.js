const authmodel = require("../models/authmodel.js");
const userValidate = require("../Validator/authVAlidate.js");
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
require("dotenv").config();
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier'); // For uploading buffer to Cloudinary
const profilemodel = require("../models/profilemodel.js");


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
        const user = new authmodel({ ...req.body, otp, verified: false }); // Include OTP in the user document
        const userSaved = await user.save();

        var token = JWT.sign({ _id: userSaved._id, email: userSaved.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
        console.log("User saved successfully:", userSaved);


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
            token
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


exports.verifyOtp = async (req, res) => {
    try {
        const user = await authmodel.findById(req._id);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }

        if (String(user.otp) !== String(req.body.otp)) {
            return res.status(400).json({
                status: false,
                message: "Invalid OTP",
            });
        }

        const updatedUser = await authmodel.findByIdAndUpdate(
            req._id,
            {
                verified: true,
                otp: null
            },
            { new: true } // returns updated user
        );

        return res.status(200).json({
            status: true,
            message: "OTP verified successfully",
            user: updatedUser,
        });

    } catch (error) {
        console.error("OTP Verification Error:", error);
        return res.status(500).json({
            status: false,
            message: "An error occurred while verifying the OTP",
            error: error.message,
        });
    }
};
// make sure it's configured

exports.completeProfile = async (req, res) => {
    try {


        const userId = req._id; // Get the user ID from the request object
        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: "Profile image is required",
            });
        }

        // Upload image to Cloudinary
        const streamUpload = (buffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'profile',
                        quality: "auto:low",
                        resource_type: 'image',
                    },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                streamifier.createReadStream(buffer).pipe(stream);
            });
        };

        const result = await streamUpload(req.file.buffer);
        const imageUrl = result.secure_url;


        // Check if profile exists already
        let profile = await profilemodel.findOne({ userId });

        if (profile) {
            // Update existing profile
            profile = await profilemodel.findOneAndUpdate(
                { userId },
                {
                    profileImage: imageUrl,
                    name: req.body.name,
                    age: Number(req.body.age),
                    gender: req.body.gender
                },
                { new: true }
            );
        } else {
            // Create new profile
            profile = new profilemodel({
                userId,
                profileImage: imageUrl,
                name: req.body.name,
                age: req.body.age,
                gender: req.body.gender
            });

            await profile.save();
        }
        const user = await profilemodel.findOne({ userId: profile.userId });
        if (user) {
            const Userchang = user._id;
            console.log("User Profile ID:", Userchang);

            // Now update the auth model with this profile ID
            await authmodel.findByIdAndUpdate(
                userId, // ✅ just the ID, not { userId }
                { profileId: Userchang },
                { new: true }
            );
        }

        return res.status(200).json({
            status: true,
            message: "Profile saved successfully.",
            user: profile,
        });

    } catch (error) {
        console.error("Profile Error:", error);
        return res.status(500).json({
            status: false,
            message: "Error while saving profile.",
            error: error.message,
        });
    }
};

exports.login = async (req, res) => {
    try {
        const user = await authmodel.findOne({ email: req.body.email }).populate("profileId");
        if (user.verified === false) {
            return res.status(400).json({ message: "please verify first" });
        }
        // Add your login logic here
        // const { email, password } = req.body;


        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);


        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        } else {
            console.log("User found db verified", user);
        }



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
