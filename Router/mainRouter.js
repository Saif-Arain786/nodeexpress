const express = require("express");
const router = express.Router();
const authRouter = require("../routes/authrouter.js"); 
// Ensure correct file name
const todorouter = require("./todorouter.js"); // Ensure correct file name

router.use("/auth", authRouter);
router.use("/todos", todorouter); // Ensure correct file name


module.exports = router;
