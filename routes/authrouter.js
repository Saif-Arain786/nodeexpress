const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js"); // Make sure the path is correct

router.post("/signup", authController.signup);
router.get("/login", authController.login);



module.exports = router;
