const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js"); // Make sure the path is correct
const { authmiddleware } = require("../middleware/authmiddleware.js");
cloudnary = require('cloudinary').v2;
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/verifyotp", authmiddleware, authController.verifyOtp);
router.post("/completeprofile", authmiddleware, upload.single('profileImage'), authController.completeProfile);



module.exports = router;
