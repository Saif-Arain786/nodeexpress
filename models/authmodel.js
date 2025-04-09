const mongoos = require("mongoose")
const authSchema = new mongoos.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },

    profileId: {
        type: mongoos.Schema.Types.ObjectId,
        ref: "profile",
        default: null
    }



})

module.exports = mongoos.model('auths', authSchema) // Ensure correct model name