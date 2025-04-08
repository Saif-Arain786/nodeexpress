const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "auths",
        required: true,
        unique: true, // so each user has one profile
    },
    profileImage: String,
    name: String,
    age: Number || null,
    gender: String
});

module.exports = mongoose.models.profile || mongoose.model("profile", profileSchema);
