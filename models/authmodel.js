const mongoos = require("mongoose")
const authSchema = new mongoos.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoos.model('auths', authSchema) // Ensure correct model name