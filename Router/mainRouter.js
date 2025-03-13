const express = require("express");
const router = express.Router();
const authRouter = require("../routes/authrouter.js"); // Ensure correct file name

router.use("/auth", authRouter);
router.get("/login", (req, res) => {
    res.status(200).json({
        status: true,
        message: "User logged..... in successfully"
    });
});

module.exports = router;
