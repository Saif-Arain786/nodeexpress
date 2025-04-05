const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js"); // Make sure the path is correct
const { authmiddleware } = require("../middleware/authmiddleware.js");

router.post("/signup", authController.signup);
router.get("/login", authController.login);
router.post("/verifyotp", authmiddleware, authController.verifyOtp);



module.exports = router;
