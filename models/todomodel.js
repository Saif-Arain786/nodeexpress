const mongoos = require("mongoose")
const todoSchema = new mongoos.Schema({
   
    title: {
        type: String,
        required: true
    },
  
    status: {
        type: String,
        enum: ['completed', 'pending', 'in-progress',"deleted"],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoos.Schema.Types.ObjectId,
        ref: 'auths',
        required: true
    },
})
// const Todo = mongoos.model('todos', todoSchema) // Ensure correct model name 
module.exports =  mongoos.model('todos', todoSchema) ; // Export the model for use in other files