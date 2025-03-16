const mongoos = require("mongoose")
const authSchema = new mongoos.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoos.model('auth', authSchema) // Ensure correct model name