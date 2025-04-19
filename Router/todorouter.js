const express = require("express");
const router = express.Router();
const todocontroller=require("../controllers/todocontroller.js"); // Ensure correct file name
const { authmiddleware } = require("../middleware/authmiddleware.js");
router.post("/createtodos",authmiddleware, todocontroller.createtodos); // Ensure correct function name
router.get("/gettodos",authmiddleware, todocontroller.gettodos); // Ensure correct function name
router.delete("/deletetodos/:id",authmiddleware, todocontroller.deletetodos); // Ensure correct function name
module.exports = router;
